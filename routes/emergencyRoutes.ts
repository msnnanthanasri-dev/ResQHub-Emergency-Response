import express from "express";

import {
  getEmergencyReports,
  createEmergencyReport,
  updateEmergencyReport,
  deleteEmergencyReport,
} from "../controllers/emergencyController";

const router = express.Router();

router.get("/", getEmergencyReports);

router.post("/", createEmergencyReport);

router.put("/:id", updateEmergencyReport);

router.delete("/:id", deleteEmergencyReport);

export default router;
