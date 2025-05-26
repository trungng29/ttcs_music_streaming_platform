import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";

interface AddToPlaylistButtonProps {
  songId: string;
}

const AddToPlaylistButton = ({ songId }: AddToPlaylistButtonProps) => {
  const { playlists, addSongToPlaylist } = usePlaylistStore();
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      toast.success("Đã thêm bài hát vào playlist!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Không thể thêm bài hát vào playlist!");
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-zinc-400 hover:text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Thêm vào playlist
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-md bg-zinc-900 shadow-lg z-50">
          <div className="py-1">
            {playlists.length === 0 ? (
              <div className="px-4 py-2 text-sm text-zinc-400">
                Bạn chưa có playlist nào
              </div>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-800"
                >
                  {playlist.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToPlaylistButton; 