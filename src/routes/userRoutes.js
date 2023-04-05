import express from "express";
import {
  login,
  register,
  getUserDetails,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/get_user_details", authMiddleware, getUserDetails);

export default router;
