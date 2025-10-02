import express from "express";
import * as controller from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/", controller.getAllTasks);

router.post("/", controller.createTask);

router.patch("/:id", controller.updateTask);

router.delete("/:id", controller.deleteTask);

export const tasksRouter = router;
