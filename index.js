//1. import necessary packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import setupSocket from "./socket.js";

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
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

//5. start server
const server = app.listen(port, () => {
  console.log("Server is running on port: ", port);
});

setupSocket(server)

//6. connect to db
mongoose
  .connect(databaseURl)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err.message));
