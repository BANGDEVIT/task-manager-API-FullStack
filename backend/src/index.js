import express from "express";
import dotenv from "dotenv";
import { AdminRouter } from "./routes/index.route.js";
import { connectDB } from "./config/database.js";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

// parse application/json sử dụng cái này là ko cần sài body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// End parse application/json sử dụng cái này là ko cần sài body-parser

//Cho phép chia sẻ DB từ BE trả về FE
app.use(cors());

// if (process.env.NODE_ENV !== "production") {
//   app.use(cors());
// }

//End Cho phép chia sẻ DB từ BE trả về FE

AdminRouter(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
