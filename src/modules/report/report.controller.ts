import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { ReportService } from "./report.service";
import { parseError } from "../../utils/parseError";

export const getReportSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(404).json({ success: false, message: "User not found" });

        const { startDate, endDate } = req.query;
        
        const summary = await ReportService.getFinancialSummary(
            userId, 
            startDate ? new Date(startDate as string) : undefined, 
            endDate ? new Date(endDate as string) : undefined
        );

        res.json({ success: true, data: summary });
    } catch (error) {
        next(parseError(error));
    }
};

export const getStatusDistribution = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(404).json({ success: false, message: "User not found" });

        const distribution = await ReportService.getLoanStatusDistribution(userId);
        res.json({ success: true, data: distribution });
    } catch (error) {
        next(parseError(error));
    }
};

export const getCashFlowData = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(404).json({ success: false, message: "User not found" });

        const data = await ReportService.getCashFlowChartData(userId);
        res.json({ success: true, data });
    } catch (error) {
        next(parseError(error));
    }
};
