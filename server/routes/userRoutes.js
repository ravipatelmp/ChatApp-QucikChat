import express from "express";
import { signup, login, checkAuth, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route (example)
router.get("/profile", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Update profile (with profile pic)
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;