import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Search, Heart, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import PlaylistList from "@/components/playlists/PlaylistList";
import CreatePlaylistDialog from "@/components/playlists/CreatePlaylistDialog";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const { user: clerkUser } = useUser();
  const { user } = useUserStore();
  const { playlists, fetchPlaylists } = usePlaylistStore();
  const likedSongs = user?.likedSongs || [];
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists(user._id);
    }
  }, [user?._id, fetchPlaylists]);

  console.log({ albums });

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <Link
            to={"/search"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <Search className="mr-2 size-5" />
            <span className="hidden md:inline">Search</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>
      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Playlists</span>
          </div>
          <button
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
            onClick={() => setIsCreateDialogOpen(true)}
            title="Tạo playlist mới"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              <>
                <SignedIn>
                  <Link
                    to={"/liked-songs"}
                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="size-12 rounded-md flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Heart className="size-6 text-white" fill="white" />
                    </div>

                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">Bài hát yêu thích</p>
                      <p className="text-sm text-zinc-400 truncate">
                        Playlist • {likedSongs.length} bài hát
                      </p>
                    </div>
                  </Link>
                </SignedIn>

                <SignedIn>
                  <PlaylistList />
                </SignedIn>

                {albums.map((album) => (
                  <Link
                    to={`/albums/${album._id}`}
                    key={album._id}
                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <img
                      src={album.imageUrl}
                      alt="Playlist img"
                      className="size-12 rounded-md flex-shrink-0 object-cover"
                    />

                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">{album.title}</p>
                      <p className="text-sm text-zinc-400 truncate">
                        Album • {album.artist}
                      </p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
      <CreatePlaylistDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default LeftSidebar;
