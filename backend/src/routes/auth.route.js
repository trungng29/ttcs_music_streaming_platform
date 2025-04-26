import { Router } from "express";
import { authCallback } from "../controller/auth.controller.js";

const router = Router();

// Khi người dùng log in với clerk, clerk sẽ gửi một request đến endpoint này với thông tin của người dùng
// Controller trong endpoint này kiểm tra trong database xem người dùng đã tồn tại hay chưa
// Nếu chưa tồn tại thì tạo mới một user trong database với thông tin của người dùng
router.post("/callback", authCallback);

export default router;