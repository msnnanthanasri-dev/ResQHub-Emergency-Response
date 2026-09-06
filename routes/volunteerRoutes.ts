import { Router } from "express";

import {
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} from "../controllers/volunteerController";

const router = Router();

router.get("/", getVolunteers);

router.post("/", createVolunteer);

router.put("/:id", updateVolunteer);

router.delete("/:id", deleteVolunteer);

export default router;
