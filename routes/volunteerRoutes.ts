import { Router } from "express";

import {
  getVolunteers,
  createVolunteer,
  deleteVolunteer,
} from "../controllers/volunteerController";

const router = Router();

router.get("/", getVolunteers);

router.post("/", createVolunteer);

router.delete("/:id", deleteVolunteer);

export default router;