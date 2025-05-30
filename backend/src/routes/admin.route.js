import { Router } from "express";
import { 
    createSong, 
    deleteSong, 
    createAlbum, 
    deleteAlbum, 
    checkAdmin,
    getAllUsers,
    updateUserRole,
    deleteUser
} from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Middleware to protect routes and require admin access
router.use(protectRoute );

router.get("/check", requireAdmin, checkAdmin);

// Song management routes
router.post("/songs", createSong);
router.delete("/songs/:songId", deleteSong);

// Album management routes
router.post("/albums", createAlbum);
router.delete("/albums/:albumId", deleteAlbum);

// User management routes
router.get("/users", requireAdmin, getAllUsers);
router.patch("/users/:userId/role", requireAdmin, updateUserRole);
router.delete("/users/:userId", requireAdmin, deleteUser);

export default router;