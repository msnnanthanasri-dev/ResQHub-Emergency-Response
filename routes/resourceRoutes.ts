import { Router } from "express";

import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resourceController";

const router = Router();

// Get all resources
router.get("/", getResources);

// Add a new resource
router.post("/", createResource);

// Edit / update an existing resource
router.put("/:id", updateResource);

// Delete a resource
router.delete("/:id", deleteResource);

export default router;
