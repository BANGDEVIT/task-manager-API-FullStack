import User from "../models/users.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const tokenUser = req.cookies.tokenUser;

    // Kiểm tra có token không
    if (!tokenUser) {
      return res.status(401).json({
        code: 401,
        message: "Please login",
      });
    }

    // Tìm user theo token
    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false,
    });

    // Kiểm tra user có tồn tại không
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Token is invalid or expired",
      });
    }

    //  Lưu thông tin user vào req để dùng ở controller
    req.user = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    };
    next(); // Cho phép tiếp tục
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      code: 500,
      message: "Authentication error",
    });
  }
};
