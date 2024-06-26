import express from "express";
import { authenticateAccount } from "../middlewares/auth.js";
import * as noteController from "../controllers/note.controller.js";

const router = express.Router();

router.post("/", authenticateAccount, noteController.createNote);
router.get("/", authenticateAccount, noteController.getNotes);
router.get("/:noteId", authenticateAccount, noteController.getNoteById);
router.put("/:noteId", authenticateAccount, noteController.updateNoteById);
router.delete("/:noteId", authenticateAccount, noteController.deleteNoteById);

export default router;
