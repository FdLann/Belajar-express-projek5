import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoutes.js";
import AppError from "./utils/AppError.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser()); // ← tambah ini
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); // ← tambah ini

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export default app;
