import express from "express";
import askQuestion from "../controllers/openaiController.js";
import {
  addPerson,
  getAllPersons,
  getPersonDetailsnChats,
  updatePerson,
} from "../controllers/personController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get_all_persons", authMiddleware, getAllPersons);
router.post("/add_person", authMiddleware, addPerson);
router.patch("/update_person/:person_id", authMiddleware, updatePerson);
router.get("/:person_id/ask_question", authMiddleware, askQuestion);
router.get("/:person_id/", authMiddleware, getPersonDetailsnChats);

export default router;
