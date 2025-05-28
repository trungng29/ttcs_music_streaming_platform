import { useMusicStore } from "@/stores/useMusicStore";
import { Album } from "@/types";
import AlbumItem from "@/components/AlbumItem.tsx";

const ArtistAlbums = () => {
  const { artistAlbums } = useMusicStore();

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {artistAlbums.map((album: Album) => (
          <AlbumItem key={album._id} album={album} />
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbums; 