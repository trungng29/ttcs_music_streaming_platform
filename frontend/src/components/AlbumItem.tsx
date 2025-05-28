import { Album } from "@/types";
import { Play } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";

interface AlbumItemProps {
  album: Album;
}

const AlbumItem = ({ album }: AlbumItemProps) => {
  const { setCurrentSong } = useMusicStore();

  const handlePlay = () => {
    if (album.songs.length > 0) {
      setCurrentSong(album.songs[0]);
    }
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
          src={album.imageUrl}
          alt={album.title}
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
        <p className="text-white truncate">{album.title}</p>
        <p className="text-neutral-400 text-sm truncate">
          {album.artist}
        </p>
      </div>
    </div>
  );
};

export default AlbumItem; 