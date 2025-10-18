import { tasksRouter } from "./tasks.route.js";
import { usersRouter } from "./users.route.js";

export const AdminRouter = (app) => {
  app.use("/tasks", tasksRouter);

  app.use("/users",usersRouter);
};


