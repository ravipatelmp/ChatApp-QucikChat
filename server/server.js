import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./lib/db.js";

import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);

// ===== Socket.IO Setup =====
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Store online users
export const userSocketMap = {};

// ===== Socket Connection =====
io.on("connection", (socket) => {
  try {
    const userId = socket.handshake.query.userId;

    console.log("User Connected:", userId);

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // send online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User Disconnected:", userId);

      if (userId) {
        delete userSocketMap[userId];
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

  } catch (error) {
    console.log("Socket Error:", error.message);
  }
});

// ===== Middleware =====
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ IMPORTANT: JSON parser (safe)
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));

// ===== Routes =====
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/messages", messageRoutes);

// ===== Database =====
connectDB();

// ===== Health Check =====
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});