import express from "express";
import dotenv from "dotenv";
import { AdminRouter } from "./routes/index.route.js";
import { connectDB } from "./config/database.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

//Cho phép chia sẻ DB từ BE trả về FE
app.use(
  cors({
    origin: "http://localhost:5173", // URL frontend
    credentials: true, // Cho phép gửi cookies
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

// parse application/json sử dụng cái này là ko cần sài body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// End parse application/json sử dụng cái này là ko cần sài body-parser
app.use(cookieParser());
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
