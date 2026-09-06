import { Router } from "express";

import {
  getReliefCamps,
  createReliefCamp,
  updateReliefCamp,
  deleteReliefCamp,
} from "../controllers/reliefCampController";

const router = Router();

router.get("/", getReliefCamps);
router.post("/", createReliefCamp);
router.put("/:id", updateReliefCamp);
router.delete("/:id", deleteReliefCamp);

export default router;
