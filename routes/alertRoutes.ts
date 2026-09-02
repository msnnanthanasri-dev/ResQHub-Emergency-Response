import { Router } from "express";

import {
  getAlerts,
  createAlert,
  deleteAlert,
} from "../controllers/alertController";

const router = Router();

router.get("/", getAlerts);
router.post("/", createAlert);
router.delete("/:id", deleteAlert);

export default router;