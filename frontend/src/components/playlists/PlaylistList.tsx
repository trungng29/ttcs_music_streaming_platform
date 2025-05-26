import { useState } from "react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

const PlaylistList = () => {
  const { playlists, deletePlaylist } = usePlaylistStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist(playlistId);
      toast.success("Playlist đã được xóa!");
    } catch (error) {
      toast.error("Không thể xóa playlist!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md group"
          >
            <Link
              to={`/playlists/${playlist._id}`}
              className="flex-1 flex items-center gap-3"
            >
              <div className="size-12 rounded-md flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {playlist.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{playlist.name}</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeletePlaylist(playlist._id)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <CreatePlaylistDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default PlaylistList; 