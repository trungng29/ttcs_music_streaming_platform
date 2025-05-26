import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useUserStore } from "@/stores/useUserStore";
import { toast, Toaster } from "sonner";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const LikedSongsPage = () => {
  const { likeSong, unlikeSong } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const { user: clerkUser } = useUser();
  const { user, fetchUser, fetchLikedSongsOfUser } = useUserStore();
  const { getToken } = useAuth();
  const userId = user?._id;
  const [loadingLike, setLoadingLike] = useState<string | null>(null);
  const [likedSongsData, setLikedSongsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Đảm bảo fetchUser được gọi trước khi lấy bài hát yêu thích
  useEffect(() => {
    if (clerkUser?.id && !user?._id) {
      const fetchUserData = async () => {
        const token = await getToken();
        if (token) await fetchUser(clerkUser.id, token);
      };
      fetchUserData();
    }
  }, [clerkUser, user, fetchUser, getToken]);

  // Lấy danh sách bài hát yêu thích từ store
  const fetchLikedSongs = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchLikedSongsOfUser(userId);
      setLikedSongsData(data);
      console.log("userId:", userId);
      console.log("likedSongsData:", data);
    } catch (error) {
      setLikedSongsData([]);
      console.log("Error fetching liked songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchLikedSongs();
    // eslint-disable-next-line
  }, [userId]);

  const handlePlayAll = () => {
    if (likedSongsData.length === 0) return;
    const isCurrentPlaylistPlaying = likedSongsData.some((song) => song._id === currentSong?._id);
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playAlbum(likedSongsData, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (likedSongsData.length === 0) return;
    playAlbum(likedSongsData, index);
  };

  const handleLikeSong = async (songId: string, isLiked: boolean) => {
    try {
      setLoadingLike(songId);
      const token = await getToken();
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        return;
      }
      const song = likedSongsData.find(s => s._id === songId);
      if (isLiked) {
        await unlikeSong(token, songId);
        toast.success(`Đã xóa "${song?.title}" khỏi bài hát yêu thích`);
      } else {
        await likeSong(token, songId);
        toast.success(`Đã thêm "${song?.title}" vào bài hát yêu thích`);
      }
      // Sau khi like/unlike, reload lại danh sách bài hát yêu thích
      await fetchLikedSongs();
      // Reload lại user để cập nhật likedSongs
      const decoded: any = jwtDecode(token);
      await fetchUser(decoded.sub, token);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      } else {
        toast.error("Có lỗi xảy ra khi thao tác với bài hát yêu thích");
      }
    } finally {
      setLoadingLike(null);
    }
  };

  const isArray = Array.isArray(likedSongsData);

  if (!userId) {
    return <div className="flex justify-center items-center h-full text-lg">Đang tải thông tin người dùng...</div>;
  }

  if (isLoading) return <div className="flex justify-center items-center h-full text-lg">Đang tải...</div>;

  if (!isLoading && (!isArray || likedSongsData.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-lg text-zinc-400">
        {isArray ? "Bạn chưa có bài hát yêu thích nào!" : "Lỗi dữ liệu: API không trả về danh sách bài hát!"}
      </div>
    );
  }

  return (
    <div className='h-full'>
      <Toaster richColors position="top-center" />
      <ScrollArea className='h-full rounded-md'>
        <div className='relative min-h-full'>
          <div
            className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
            to-zinc-900 pointer-events-none'
            aria-hidden='true'
          />

          <div className='relative z-10'>
            <div className='flex p-6 gap-6 pb-8'>
              <div className='w-[240px] h-[240px] shadow-xl rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
                <Heart className="w-24 h-24 text-white" fill="white" />
              </div>
              <div className='flex flex-col justify-end'>
                <p className='text-sm font-medium'>Playlist</p>
                <h1 className='text-7xl font-bold my-4'>Bài hát yêu thích</h1>
                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                  <span className='font-medium text-white'>{user?.username}</span>
                  <span>• {isArray ? likedSongsData.length : 0} bài hát</span>
                </div>
              </div>
            </div>

            <div className='px-6 pb-4 flex items-center gap-6'>
              <Button
                onClick={handlePlayAll}
                size='icon'
                className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all'
              >
                {isPlaying && isArray && likedSongsData.some((song) => song._id === currentSong?._id) ? (
                  <Pause className='h-7 w-7 text-black' />
                ) : (
                  <Play className='h-7 w-7 text-black' />
                )}
              </Button>
            </div>

            <div className='bg-black/20 backdrop-blur-sm'>
              <div
                className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
                text-zinc-400 border-b border-white/5'
              >
                <div>#</div>
                <div>Title</div>
                <div>Artist</div>
                <div>
                  <Clock className='h-4 w-4' />
                </div>
              </div>

              <div className='px-6'>
                <div className='space-y-2 py-4'>
                  {isArray && likedSongsData.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    // Kiểm tra like dựa vào danh sách hiện tại
                    const isLiked = likedSongsData.some(s => s._id === song._id);
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                        text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className='flex items-center justify-center'>
                          {isCurrentSong && isPlaying ? (
                            <div className='size-4 text-green-500'>♫</div>
                          ) : (
                            <span className='group-hover:hidden'>{index + 1}</span>
                          )}
                          {!isCurrentSong && (
                            <Play className='h-4 w-4 hidden group-hover:block' />
                          )}
                        </div>

                        <div className='flex items-center gap-3'>
                          <img src={song.imageUrl} alt={song.title} className='size-10' />
                          <div>
                            <div className={`font-medium text-white`}>{song.title}</div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className='flex items-center'>{song.artist}</div>
                        <div className='flex items-center gap-2'>
                          {formatDuration(song.duration)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeSong(song._id, isLiked);
                            }}
                            className={`p-1 rounded-full transition-all duration-300 ${
                              isLiked ? "bg-emerald-500/20" : ""
                            }`}
                          >
                            <Heart
                              className={`h-5 w-5 transition-all duration-300 ${
                                isLiked ? "text-emerald-500" : "text-zinc-400"
                              } ${loadingLike === song._id ? "opacity-50" : ""}`}
                              fill={isLiked ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default LikedSongsPage; 