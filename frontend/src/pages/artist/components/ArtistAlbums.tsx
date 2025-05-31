import { useMusicStore } from "@/stores/useMusicStore";
import { Album } from "@/types";
import AlbumItem from "@/components/AlbumItem.tsx";

const ArtistAlbums = () => {
  const { artistAlbums } = useMusicStore();

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artistAlbums.map((album: Album) => (
          <div key={album._id} className="min-w-0">
            <AlbumItem album={album} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbums; 