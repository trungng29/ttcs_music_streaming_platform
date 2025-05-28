import { useUserStore } from "@/stores/useUserStore";

const ArtistAbout = () => {
  const { currentArtist } = useUserStore();
  if (!currentArtist || !currentArtist.artistInfo?.bio) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Giới thiệu</h2>
      <p className="text-base text-white/90">
        {currentArtist.artistInfo.bio}
      </p>
    </div>
  );
};

export default ArtistAbout; 