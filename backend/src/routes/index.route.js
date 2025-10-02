import { tasksRouter } from "./tasks.route.js";

export const AdminRouter = (app) => {
  app.use("/tasks", tasksRouter);
};
