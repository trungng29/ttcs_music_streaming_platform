import { User } from "../models/user.model.js";

// Khi người dùng log in với clerk, clerk sẽ gửi một request đến endpoint này với thông tin của người dùng
// Controller trong endpoint này kiểm tra trong database xem người dùng đã tồn tại hay chưa
// Nếu chưa tồn tại thì tạo mới một user trong database với thông tin của người dùng
export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		// check if user already exists
		const user = await User.findOne({ clerkId: id });

		if (!user) {
			// signup
			await User.create({
				clerkId: id,
				fullName: `${firstName || ""} ${lastName || ""}`.trim(),
				imageUrl,
			});
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};
