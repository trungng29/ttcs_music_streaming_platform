import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, Heart } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useUserStore } from "@/stores/useUserStore";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const SongPage = () => {
  const { songId } = useParams();
  const { fetchSongById, currentSong: songData, isLoading, error, likeSong, unlikeSong } = useMusicStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const { user: clerkUser } = useUser();
  const userId = clerkUser?.id;
  const { user, fetchUser } = useUserStore();
  const likedSongs = user?.likedSongs || [];

  useEffect(() => {
    console.log("songData:", songData);
    console.log("error:", error);
  }, [songData, error]);

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId, fetchUser]);

  useEffect(() => {
    if (songId) fetchSongById(songId);
  }, [fetchSongById, songId]);

  if (isLoading) return <div className="flex justify-center items-center h-full text-lg">Đang tải...</div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-500 text-lg">Lỗi: {error}</div>;
  if (!songData) return <div className="flex justify-center items-center h-full text-lg">Không tìm thấy bài hát.</div>;

  const handlePlaySong = () => {
    if (!songData) return;

    const isCurrentSongPlaying = currentSong?._id === songData._id;
    if (isCurrentSongPlaying) {
      togglePlay();
    } else {
      setCurrentSong(songData);
    }
  };

  const handleLike = async () => {
    if (!userId || !songData) return;
    const isLiked = likedSongs.includes(songData._id);
    if (isLiked) {
      await unlikeSong(userId, songData._id);
    } else {
      await likeSong(userId, songData._id);
    }
    await fetchUser(userId);
  };

  return (
    <div className='h-full'>
      <ScrollArea className='h-full rounded-md'>
        {/* Main Content */}
        <div className='relative min-h-[100vh]'>
          {/* bg gradient */}
          <div
            className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
            to-zinc-900 pointer-events-none'
            aria-hidden='true'
          />

          {/* Content */}
          <div className='relative z-10'>
            <div className='flex p-6 gap-6 pb-8'>
              <img
                src={songData?.imageUrl}
                alt={songData?.title}
                className='w-[240px] h-[240px] shadow-xl rounded bg-zinc-800 object-cover'
              />
              <div className='flex flex-col justify-end'>
                <p className='text-sm font-medium'>Bài hát</p>
                <h1 className='text-7xl font-bold my-4'>{songData?.title}</h1>
                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                  <span className='font-medium text-white'>{songData?.artist}</span>
                  <span>• {formatDuration(songData?.duration || 0)}</span>
                  <span>• {songData?.createdAt?.split("T")[0]}</span>
                </div>
              </div>
            </div>

            {/* play button */}
            <div className='px-6 pb-4 flex items-center gap-6'>
              <Button
                onClick={handlePlaySong}
                size='icon'
                className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all'
              >
                {isPlaying && currentSong?._id === songData?._id ? (
                  <Pause className='h-7 w-7 text-black' />
                ) : (
                  <Play className='h-7 w-7 text-black' />
                )}
              </Button>
              <Button
                onClick={handleLike}
                size='icon'
                variant='ghost'
                className='hover:scale-105 transition-all'
              >
                <Heart
                  className={`h-7 w-7 ${likedSongs.includes(songData._id) ? 'text-red-500 fill-red-500' : 'text-white'}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SongPage;
