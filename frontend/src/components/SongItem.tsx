import { Song } from "@/types";
import { Play } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";

interface SongItemProps {
  song: Song;
}

const SongItem = ({ song }: SongItemProps) => {
  const { setCurrentSong } = useMusicStore();

  const handlePlay = () => {
    setCurrentSong(song);
  };

  return (
    <div
      onClick={handlePlay}
      className="
        flex 
        items-center 
        gap-x-4 
        cursor-pointer 
        hover:bg-neutral-800/50 
        w-full 
        p-2 
        rounded-md
      "
    >
      <div className="relative min-h-[48px] min-w-[48px] overflow-hidden rounded-md">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="object-cover"
        />
        <div 
          className="
            absolute 
            inset-0 
            flex 
            items-center 
            justify-center 
            bg-black 
            bg-opacity-50 
            opacity-0 
            hover:opacity-100 
            transition
          "
        >
          <Play className="text-white" size={20} />
        </div>
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{song.title}</p>
        <p className="text-neutral-400 text-sm truncate">
          {song.artist}
        </p>
      </div>
    </div>
  );
};

export default SongItem;
