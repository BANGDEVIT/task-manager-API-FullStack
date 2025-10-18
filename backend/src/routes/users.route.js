import express from "express"
import * as controller from "../controllers/users.controller.js"
import * as validates from  "../validates/users.validate.js"
import { requireAuth } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/register",validates.register,controller.register)

route.post("/login",validates.login,controller.login);

route.get("/verify-auth",requireAuth,controller.verifyAuth);

route.get("/logout",controller.logout);

export const usersRouter = route;