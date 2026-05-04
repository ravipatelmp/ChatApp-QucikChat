import express from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  markMessageAsSeen
} from "../controllers/messageController.js";

import { protectRoute } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);



router.post(
  "/send/:id",
  protectRoute,
  (req, res, next) => {
    const type = req.headers["content-type"] || "";

    if (type.includes("multipart/form-data")) {
      upload.single("image")(req, res, (err) => {
        if (err) {
          console.log("MULTER ERROR:", err.message);
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }
        next();
      });
    } else {
      next();
    }
  },
  sendMessage
);




router.put("/mark/:id", protectRoute, markMessageAsSeen);

export default router;