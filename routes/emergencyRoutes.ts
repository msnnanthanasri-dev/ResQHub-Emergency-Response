import express from "express";
import {
  getEmergencyReports,
  createEmergencyReport,
} from "../controllers/emergencyController";

const router = express.Router();

router.get("/", getEmergencyReports);
router.post("/", createEmergencyReport);

export default router;