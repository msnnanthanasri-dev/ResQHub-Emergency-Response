import { Router } from "express";

import {
  getReliefCamps,
  createReliefCamp,
  deleteReliefCamp,
} from "../controllers/reliefCampController";

const router = Router();

router.get("/", getReliefCamps);

router.post("/", createReliefCamp);

router.delete("/:id", deleteReliefCamp);

export default router;