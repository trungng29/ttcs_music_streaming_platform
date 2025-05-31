import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUserStore } from "@/stores/useUserStore";
import { Play, Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const ArtistSongs = () => {
  const { artistSongs } = useMusicStore();
  const { currentSong, isPlaying, playAlbum } = usePlayerStore();
  const { user, fetchUser } = useUserStore();
  const likedSongs = user?.likedSongs || [];
  const { getToken } = useAuth();
  const [loadingLike, setLoadingLike] = useState<string | null>(null);

  const handlePlaySong = (index: number) => {
    playAlbum(artistSongs, index);
  };

  const handleLikeSong = async (songId: string, isLiked: boolean) => {
    try {
      setLoadingLike(songId);
      const token = await getToken();
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        return;
      }
      const song = artistSongs.find(s => s._id === songId);
      if (isLiked) {
        await useMusicStore.getState().unlikeSong(token, songId);
        toast.success(`Đã xóa "${song?.title}" khỏi bài hát yêu thích`);
      } else {
        await useMusicStore.getState().likeSong(token, songId);
        toast.success(`Đã thêm "${song?.title}" vào bài hát yêu thích`);
      }
      const decoded: any = jwtDecode(token);
      await fetchUser(decoded.sub, token);
    } catch (error: any) {
      toast.error("Có lỗi xảy ra khi thao tác với bài hát yêu thích");
    } finally {
      setLoadingLike(null);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl">
      <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
        <div>#</div>
        <div>Tiêu đề</div>
        <div>Ngày phát hành</div>
        <div>
          <span className="sr-only">Thời lượng</span>
        </div>
      </div>
      <div className="px-6">
        <div className="space-y-2 py-4">
          {artistSongs.map((song, index) => {
            const isCurrentSong = currentSong?._id === song._id;
            const isLiked = likedSongs.includes(song._id);
            return (
              <div
                key={song._id}
                onClick={() => handlePlaySong(index)}
                className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
              >
                <div className="flex items-center justify-center">
                  {isCurrentSong && isPlaying ? (
                    <div className="size-4 text-green-500">♫</div>
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  {!isCurrentSong && (
                    <Play className="h-4 w-4 hidden group-hover:block" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <img src={song.imageUrl} alt={song.title} className="size-10" />
                  <div>
                    <div className="font-medium text-white">{song.title}</div>
                    <div>{typeof song.artist === "string" ? song.artist : song.artist?.fullName}</div>
                  </div>
                </div>
                <div className="flex items-center">{song.createdAt ? song.createdAt.split("T")[0] : ""}</div>
                <div className="flex items-center gap-2">
                  {formatDuration(song.duration)}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleLikeSong(song._id, isLiked);
                    }}
                    className={`ml-4 p-1 rounded-full transition-all duration-300 ${isLiked ? "bg-emerald-500/20" : ""}`}
                  >
                    <Heart
                      className={`h-5 w-5 transition-all duration-300 ${isLiked ? "text-emerald-500" : "text-zinc-400"} ${loadingLike === song._id ? "opacity-50" : ""}`}
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
  );
};

export default ArtistSongs;