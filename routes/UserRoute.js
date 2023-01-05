import express from "express";
import { runValidation, saveValidation } from "../validation/index.js";
import {
  getUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/users", verifyToken, saveValidation, runValidation, saveUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

export default router;
