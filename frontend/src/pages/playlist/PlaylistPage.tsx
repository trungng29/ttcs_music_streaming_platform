import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Trash2, Plus, Search as SearchIcon, Clock, Heart } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useUserStore } from "@/stores/useUserStore";
import { jwtDecode } from "jwt-decode";
import { useMusicStore } from "@/stores/useMusicStore";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { currentPlaylist, fetchPlaylistById, removeSongFromPlaylist, addSongToPlaylist } = usePlaylistStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user: clerkUser } = useUser();
  const userId = clerkUser?.id;
  const { user, fetchUser } = useUserStore();
  const likedSongs = user?.likedSongs || [];
  const [loadingLike, setLoadingLike] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistById(playlistId);
    }
  }, [playlistId, fetchPlaylistById]);

  const handlePlayAll = () => {
    if (!currentPlaylist || currentPlaylist.songs.length === 0) return;

    const isCurrentPlaylistPlaying = currentPlaylist.songs.some(
      (song) => song._id === currentSong?._id
    );

    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playAlbum(currentPlaylist.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentPlaylist) return;
    playAlbum(currentPlaylist.songs, index);
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlistId) return;
    try {
      await removeSongFromPlaylist(playlistId, songId);
      toast.success("Đã xóa bài hát khỏi playlist!");
    } catch (error) {
      toast.error("Không thể xóa bài hát!");
    }
  };

  // Search logic
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axiosInstance.get(`/songs/search?title=${encodeURIComponent(search)}`);
      setSearchResults(res.data);
    } catch (error) {
      toast.error("Không thể tìm kiếm bài hát!");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddSong = async (songId: string) => {
    if (!playlistId) return;
    try {
      await addSongToPlaylist(playlistId, songId);
      toast.success("Đã thêm bài hát vào playlist!");
      // Xóa hết kết quả tìm kiếm và clear input
      setSearchResults([]);
      setSearch("");
      // Refresh playlist
      fetchPlaylistById(playlistId);
    } catch (error) {
      toast.error("Không thể thêm bài hát!");
    }
  };

  const handleLikeSong = async (songId: string, isLiked: boolean) => {
    try {
      setLoadingLike(songId);
      const token = await getToken();
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        return;
      }
      const song = currentPlaylist?.songs.find(s => s._id === songId);
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
      if (error?.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      } else {
        toast.error("Có lỗi xảy ra khi thao tác với bài hát yêu thích");
      }
    } finally {
      setLoadingLike(null);
    }
  };

  if (isLoading || !currentPlaylist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full">
      <div className="relative min-h-full">
        {/* bg gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
          aria-hidden="true"
        />
        {/* Content */}
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="size-48 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">
                {currentPlaylist.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">{currentPlaylist.name}</h1>
              <p className="text-zinc-400">
                {currentPlaylist.songs.length} bài hát
              </p>
              <Button
                onClick={handlePlayAll}
                className="bg-green-500 hover:bg-green-400"
              >
                {isPlaying &&
                currentPlaylist.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Phát tất cả
              </Button>
            </div>
          </div>

          {/* Search bar thêm bài hát */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-xl">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài hát..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 py-6 text-lg bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
              />
              <Button
                type="submit"
                disabled={searchLoading || !search.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-400 px-4 py-2 h-auto"
              >
                Tìm kiếm
              </Button>
            </div>
          </form>
          {searchResults.length > 0 && (
            <div className="bg-zinc-900 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Kết quả tìm kiếm</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((song) => (
                  <div key={song._id} className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md">
                    <div className="flex items-center gap-3">
                      <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-zinc-400">{song.artist}</p>
                      </div>
                    </div>
                    <Button size="icon" onClick={() => handleAddSong(song._id)} className="bg-green-500 hover:bg-green-400">
                      <Plus className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slider bài hát trong playlist */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg">
            <div
              className="grid grid-cols-[16px_4fr_2fr_1fr_40px_40px] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5"
            >
              <div>#</div>
              <div>Tiêu đề</div>
              <div>Ngày thêm</div>
              <div>
                <Clock className="h-4 w-4" />
              </div>
              <div></div>
              <div></div>
            </div>
            <div className="px-6">
              <div className="space-y-2 py-4">
                {currentPlaylist.songs.map((song, index) => {
                  const isCurrentSong = currentSong?._id === song._id;
                  const isLiked = likedSongs.includes(song._id);
                  return (
                    <div
                      key={song._id}
                      onClick={() => handlePlaySong(index)}
                      className={`grid grid-cols-[16px_4fr_2fr_1fr_40px_40px] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer ${isCurrentSong ? "bg-green-500/10" : ""}`}
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
                      <div className='flex items-center'>{song.createdAt?.split("T")[0]}</div>
                      <div className='flex items-center'>{formatDuration(song.duration)}</div>
                      <div className='flex items-center'>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleLikeSong(song._id, isLiked);
                          }}
                          className={`p-1 rounded-full transition-all duration-300 ${isLiked ? "bg-emerald-500/20" : ""}`}
                        >
                          <Heart
                            className={`h-5 w-5 transition-all duration-300 ${isLiked ? "text-emerald-500" : "text-zinc-400"} ${loadingLike === song._id ? "opacity-50" : ""}`}
                            fill={isLiked ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <div className='flex items-center'>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveSong(song._id);
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default PlaylistPage; 