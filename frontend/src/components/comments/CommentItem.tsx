import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/types/comment.types";
import { useCommentStore } from "@/stores/useCommentStore";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  isReplying?: boolean;
  replyContent?: string;
  onChangeReply?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitReply?: (e: React.FormEvent) => void;
  onCancelReply?: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

const CommentItem = ({ comment, onReply, isReplying, replyContent, onChangeReply, onSubmitReply, onCancelReply, textareaRef }: CommentItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  const { deleteComment, toggleLikeComment } = useCommentStore();
  const userId = user?.id;

  const handleDelete = async () => {
    if (!userId) return;
    try {
      setIsDeleting(true);
      const token = await getToken();
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn");
        return;
      }
      await deleteComment(comment._id, token);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để thích bình luận");
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn");
        return;
      }
      await toggleLikeComment(comment._id, token);
    } catch (error) {
      toast.error("Không thể thao tác với bình luận");
    }
  };

  const isLiked = userId ? (comment.likes || []).includes(userId) : false;
  const isOwner = comment.userId === userId;

  return (
    <div className="flex gap-4 p-4 mb-4 bg-zinc-900/80 rounded-xl shadow-md border border-zinc-800 hover:shadow-lg transition-all">
      <Avatar className="w-14 h-14 border-2 border-green-500 shadow-sm">
        <AvatarImage src={comment.user?.avatarUrl} />
        <AvatarFallback>
          {(comment.user?.username ? comment.user.username.slice(0, 2).toUpperCase() : "??")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {comment.user?.username || "Ẩn danh"}
          </span>
          <span className="text-xs text-zinc-400 ml-2">
            {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
              ? formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })
              : "Vừa xong"}
          </span>
        </div>
        <p className="mt-1 text-base text-zinc-100 leading-relaxed break-words">
          {comment.content}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-zinc-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all ${isLiked ? 'bg-pink-500/10 text-pink-500' : ''}`}
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-pink-500" : ""} transition-all`}
            />
            <span className="text-xs font-medium">{comment.likes.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
            onClick={() => onReply(comment._id)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Trả lời</span>
          </Button>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2 py-1 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isReplying && (
          <form onSubmit={onSubmitReply} className="mt-4 space-y-2">
            <textarea
              ref={textareaRef}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none min-h-[60px]"
              placeholder={`Phản hồi @${comment.user?.username || "Ẩn danh"}...`}
              value={replyContent}
              onChange={onChangeReply}
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={!replyContent?.trim()}>Gửi</Button>
              <Button type="button" size="sm" variant="ghost" onClick={onCancelReply}>Hủy</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentItem; 