import express from "express";
import {
  getAdmin,
  registerAdmin,
  login,
  deleteAdmin,
  logout,
} from "../controllers/AdminController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
const router = express.Router();

router.get("/admins", verifyToken, getAdmin);
// router.get("/users/:id", getUserById);
router.post("/admins", registerAdmin);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/deleteAdmin/:id", verifyToken, deleteAdmin);
router.delete("/logout", logout);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
