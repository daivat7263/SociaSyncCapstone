import express from "express";
import {
  getUserMessages,
  DeleteMessage,
} from "../controllers/message.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id/user/:friendId", verifyToken, getUserMessages);
router.get('/:id/delete', verifyToken, DeleteMessage);

export default router;