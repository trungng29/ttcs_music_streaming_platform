import { useState } from "react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CreatePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlaylistDialog = ({ isOpen, onClose }: CreatePlaylistDialogProps) => {
  const { createPlaylist } = usePlaylistStore();
  const { user } = useUserStore();
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim() || !user?._id) return;

    try {
      await createPlaylist(newPlaylistName, user._id);
      setNewPlaylistName("");
      onClose();
      toast.success("Playlist đã được tạo thành công!");
    } catch (error) {
      toast.error("Không thể tạo playlist!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo playlist mới</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Tên playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleCreatePlaylist}
            className="bg-green-500 hover:bg-green-400"
            disabled={!newPlaylistName.trim()}
          >
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog; 