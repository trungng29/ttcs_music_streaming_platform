import React, { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommentStore } from "@/stores/useCommentStore";
import CommentItem from "./CommentItem";
import { toast } from "sonner";
import { Comment } from "@/types/comment.types";
import type { JSX } from "react";

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

interface CommentSectionProps {
  songId: string;
}

const CommentSection = ({ songId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { getToken } = useAuth();
  const { comments, isLoading, fetchComments, createComment } = useCommentStore();
  const { user } = useUser();

  useEffect(() => {
    fetchComments(songId);
  }, [songId, fetchComments]);

  useEffect(() => {
    if (replyTo && textareaRef.current) {
      const len = newComment.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [replyTo, newComment]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Vui lòng đăng nhập để bình luận");
        return;
      }

      await createComment(
        {
          content: newComment,
          songId,
          parentId: replyTo || undefined,
        },
        token
      );

      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      toast.error("Không thể đăng bình luận");
    }
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
    const comment = comments.find((c) => c._id === commentId);
    if (comment) {
      const mention = `@${comment.user.username} `;
      setNewComment(mention);
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setNewComment("");
  };

  // Hàm build tree từ mảng comments phẳng
  function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
    const map: Record<string, CommentWithReplies> = {};
    const roots: CommentWithReplies[] = [];
    comments.forEach((comment) => {
      map[comment._id] = { ...comment, replies: [] };
    });
    comments.forEach((comment) => {
      if (comment.parentId) {
        map[comment.parentId]?.replies.push(map[comment._id]);
      } else {
        roots.push(map[comment._id]);
      }
    });
    return roots;
  }

  const commentTree = buildCommentTree(comments);

  function renderComments(comments: CommentWithReplies[], level = 0): JSX.Element[] {
    return comments.map((comment) => {
      const items = [
        <div key={comment._id} className={level > 0 ? 'ml-8' : ''}>
          <CommentItem
            comment={comment}
            onReply={handleReply}
            isReplying={replyTo === comment._id}
            replyContent={replyTo === comment._id ? newComment : ""}
            onChangeReply={(e) => setNewComment(e.target.value)}
            onSubmitReply={async (e) => {
              e.preventDefault();
              if (!newComment.trim()) return;
              try {
                const token = await getToken();
                if (!token) {
                  toast.error("Vui lòng đăng nhập để bình luận");
                  return;
                }
                await createComment(
                  {
                    content: newComment,
                    songId,
                    parentId: comment._id,
                  },
                  token
                );
                setNewComment("");
                setReplyTo(null);
              } catch (error) {
                toast.error("Không thể đăng bình luận");
              }
            }}
            onCancelReply={() => {
              setReplyTo(null);
              setNewComment("");
            }}
            textareaRef={replyTo === comment._id ? textareaRef : undefined}
          />
        </div>
      ];
      if (comment.replies && comment.replies.length > 0) {
        items.push(...renderComments(comment.replies, level + 1));
      }
      return items;
    }).flat();
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Bình luận</h2>
      <form onSubmit={handleSubmitComment} className="flex items-start gap-4 bg-zinc-900/80 rounded-xl shadow-md border border-zinc-800 p-4 mb-6">
        <div className="pt-1">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-green-500 object-cover bg-zinc-800"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-green-500 bg-zinc-800 flex items-center justify-center text-xl text-white font-bold">
              {user?.username?.slice(0,2).toUpperCase() || "??"}
            </div>
          )}
        </div>
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài hát này..."
            value={!replyTo ? newComment : ""}
            onChange={(e) => {
              if (!replyTo) setNewComment(e.target.value);
            }}
            className="min-h-[80px] rounded-lg border border-zinc-700 bg-zinc-800 text-base text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none shadow-sm"
          />
          <div className="flex items-center gap-2 mt-2 justify-end pt-3">
            <Button
              type="submit"
              disabled={isLoading || !!replyTo || !newComment.trim()}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-green-400 hover:to-blue-400 transition-all"
            >
              {isLoading ? "Đang đăng..." : "Gửi bình luận"}
            </Button>
          </div>
        </div>
      </form>
      <div className="space-y-6">
        {renderComments(commentTree, 0)}
      </div>
    </div>
  );
};

export default CommentSection; 