import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getReportSummary, getStatusDistribution, getCashFlowData } from "./report.controller";

const router = Router();

router.get("/summary", authMiddleware, getReportSummary);
router.get("/distribution", authMiddleware, getStatusDistribution);
router.get("/cashflow", authMiddleware, getCashFlowData);

export default router;
