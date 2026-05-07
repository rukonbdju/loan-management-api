import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { parseError } from "../../utils/parseError";
import TransactionService from "./transaction.service";

const TransactionController = {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const creatorId = req.userId;
            if (!creatorId) {
                return res.status(401).json({ success: false, message: 'User ID not found' });
            }
            const result = await TransactionService.create({ ...req.body, createdBy: creatorId });
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(parseError(error));
        }
    },

    async getDaily(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const creatorId = req.userId;
            const date = req.query.date as string;
            if (!creatorId) {
                return res.status(401).json({ success: false, message: 'User ID not found' });
            }
            if (!date) {
                return res.status(400).json({ success: false, message: 'Date is required' });
            }
            const result = await TransactionService.filterByDate(creatorId, date);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(parseError(error));
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const result = await TransactionService.update(id, req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(parseError(error));
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const result = await TransactionService.delete(id);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(parseError(error));
        }
    },

    async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const creatorId = req.userId;
            if (!creatorId) {
                return res.status(401).json({ success: false, message: 'User ID not found' });
            }
            const result = await TransactionService.getSummary(creatorId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(parseError(error));
        }
    }
};

export default TransactionController;
