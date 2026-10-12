import { Router } from "express";
import { getApiTest, getDatabaseHealth, getHealth } from "../controllers/health.controller";

const router = Router();

router.get("/health", getHealth);
router.get("/health/db", getDatabaseHealth);
router.get("/test", getApiTest);

export default router;
