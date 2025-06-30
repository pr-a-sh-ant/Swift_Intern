import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per hour)
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

app.use(cookieParser());

//routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/posts", postRouter);

export default app;
