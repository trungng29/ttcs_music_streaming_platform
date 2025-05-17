import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Search } from "lucide-react";
import { Song } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/songs/search?title=${searchQuery}`);
      setSongs(response.data);
    } catch (error) {
      console.error("Error searching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (song: Song) => {
    const isCurrentSong = currentSong?._id === song._id;
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <div className="h-full w-full">
      <ScrollArea className="h-full w-full rounded-md">
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
            to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 p-6" style={{ minHeight: "100vh" }}>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search for songs..."
                  value={searchQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                />
              </div>
            </form>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {songs.length > 0 ? (
                  songs.map((song) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors group"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              onClick={() => handlePlay(song)}
                              size="icon"
                              className="size-10 rounded-full bg-white hover:bg-white/90 hover:scale-110 transition-all"
                            >
                              {isCurrentSong && isPlaying ? (
                                <Pause className="h-5 w-5 text-black" />
                              ) : (
                                <Play className="h-5 w-5 text-black" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{song.title}</h3>
                          <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                        </div>

                        <div className="text-sm text-zinc-400">
                          {Math.floor(song.duration / 60)}:
                          {(song.duration % 60).toString().padStart(2, "0")}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  searchQuery && (
                    <div className="text-center text-zinc-400 py-8">
                      No songs found matching your search
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchPage;
