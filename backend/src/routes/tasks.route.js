import express from "express";
import * as controller from "../controllers/tasks.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getAllTasks);

router.post("/", controller.createTask);

router.patch("/:id", controller.updateTask);

router.delete("/:id", controller.deleteTask);

export const tasksRouter = router;
