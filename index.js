//1. import necessary packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

//2. config .env
dotenv.config();

//3. create app
const app = express();
const port = process.env.PORT || 5001;
const databaseURl = process.env.DATABASE_URL;

// 4. add middlewares
app.use(
  cors({
    origin: [process.env.ORIGIN],
    // origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

//5. start server
const server = app.listen(port, () => {
  console.log("Server is running on port: ", port);
});

//6. connect to db
mongoose
  .connect(databaseURl)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err.message));