import { Router } from "express";
import { reindexAllCars } from "./semantic.service.js";
import { searchCarsSemantic } from "./search.controller.js";

import { protect, requireAdmin } from "../../middleware/auth.js";

const router = Router();

router.post("/reindex-cars", protect, requireAdmin, reindexAllCars);

router.get("/cars", searchCarsSemantic);

export default router;
