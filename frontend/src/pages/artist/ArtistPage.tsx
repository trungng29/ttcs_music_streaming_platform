import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import { useMusicStore } from "@/stores/useMusicStore";
import ArtistSongs from "./components/ArtistSongs";
import ArtistAlbums from "./components/ArtistAlbums";
import ArtistAbout from "./components/ArtistAbout";
import { ScrollArea } from "@/components/ui/scroll-area";

const ArtistPage = () => {
  const { artistId } = useParams();
  const { currentArtist, fetchArtist } = useUserStore();
  const { fetchArtistSongs, fetchArtistAlbums } = useMusicStore();
  const [activeTab, setActiveTab] = useState("songs");

  useEffect(() => {
    if (artistId) {
      fetchArtist(artistId);
      fetchArtistSongs(artistId);
      fetchArtistAlbums(artistId);
    }
  }, [artistId]);

  if (!currentArtist) return <div>Đang tải thông tin nghệ sĩ...</div>;

  return (
    <div className="relative h-full bg-gradient-to-b from-[#1e2746] via-[#232a3d] to-[#181c2b]">
      {/* Background blur giống Spotify */}
      <div
        className="absolute inset-0 -z-10 h-96 w-full overflow-hidden"
        style={{
          background: `url(${currentArtist.imageUrl}) center/cover no-repeat`,
          filter: "blur(40px) brightness(0.6)",
          opacity: 0.8,
        }}
      />
      <ScrollArea className="h-full">
        <div className="relative z-10 px-8 pt-16 pb-8">
          <div className="flex items-end gap-8">
            <img
              src={currentArtist.imageUrl}
              alt={currentArtist.fullName}
              className="w-48 h-48 rounded-full object-cover shadow-2xl border-4 border-white"
            />
            <div>
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                {currentArtist.fullName}
              </h1>
            </div>
          </div>
          {/* Tabs */}
          <div className="mt-10 flex gap-6">
            <button
              className={`text-lg font-semibold pb-2 border-b-2 transition-all ${
                activeTab === "songs"
                  ? "border-green-500 text-white"
                  : "border-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("songs")}
            >
              Bài hát
            </button>
            <button
              className={`text-lg font-semibold pb-2 border-b-2 transition-all ${
                activeTab === "albums"
                  ? "border-green-500 text-white"
                  : "border-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("albums")}
            >
              Album
            </button>
          </div>
          <div className="mt-8">
            {activeTab === "songs" && <ArtistSongs />}
            {activeTab === "albums" && <ArtistAlbums />}
          </div>
          {/* Panel giới thiệu full chiều rộng dưới tabs */}
          <div className="mt-10 w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white w-full">
              <ArtistAbout />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistPage; 