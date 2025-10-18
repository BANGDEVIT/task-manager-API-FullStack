import User from "../models/users.model.js";
import md5 from "md5";
import bcrypt from "bcrypt";

//[POST] users/register
export const register = async (req, res) => {
  try {
    const emailExist = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      // req.body.password = md5(req.body.password);
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = new User(req.body);
      await user.save();

      res.status(201).json({ message: "Register successfully" });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("register is error", error);
    res.status(500).json({ message: "System is error" });
  }
};

//[POST] users/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase(),
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({ message: "Email dosen't exist" });
    }

    const existsPassword = await bcrypt.compare(password, user.password);
    if (!existsPassword) {
      return res.status(400).json({ message: "password is wrong" });
    } else {
      res.cookie("tokenUser", user.tokenUser, {
        httpOnly: true, // Bảo mật hơn
        secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS ở production
        sameSite: "lax", // Bảo vệ CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      });
      res.status(201).json({ message: "Login successfully" });
    }
  } catch (error) {
    console.error("Login is error", error);
    res.status(500).json({ message: "System is error" });
  }
};

//[GET] users/verify-auth
export const verifyAuth = async (req, res) =>{
  try {
    res.status(200).json({
      code : 200,
      message :"Authenticated",
      user: req.user
    })
  } catch (error) {
    res.status(401).json({
      code : 401,
      message : "Not Authenticated"
    })
  }
}

//[GET] users/logout
export const logout = async(req,res) => {
  try {
    res.clearCookie("tokenUser");
    res.status(200).json({
      message:"Logout Successfully"
    })
  } catch (error) {
    res.status(500).json({
      message:"System is error"
    })    
  }
}