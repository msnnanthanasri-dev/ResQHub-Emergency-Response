import { Router } from "express";

import {
  getResources,
  createResource,
  deleteResource,
} from "../controllers/resourceController";

const router = Router();

router.get("/", getResources);
router.post("/", createResource);
router.delete("/:id", deleteResource);

export default router;