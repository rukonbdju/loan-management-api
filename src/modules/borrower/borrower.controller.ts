import { NextFunction, Request, Response } from "express";
import { BorrowerService } from "./borrower.service";
import { parseError } from "../../utils/parseError";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const BorrowerController = {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const creatorId = req.userId;
            if (!creatorId) {
                return res.status(401).json({ success: false, message: 'User ID is not found' })
            }
            const borrowerId = req?.body?.borrowerId
            if (!borrowerId) {
                return res.status(401).json({ success: false, message: 'Borrower ID is required' })
            }
            const isExist = await BorrowerService.filterBorrowerByCreatorAndBorrowerId(borrowerId, creatorId)
            console.log('Existing doc', isExist)
            if (isExist) {
                return res.status(400).json({ success: false, message: 'Borrower ID already exist!' })
            }
            const user = await BorrowerService.createBorrower(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await BorrowerService.getAllBorrowers();
            res.json({ success: true, data: users });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await BorrowerService.getBorrowerById(req.params.id);
            if (!user) return res.status(404).json({ message: "Borrower not found" });
            res.json({ success: true, data: user });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getByCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await BorrowerService.getBorrowersByCreator(req.params.creatorId);
            res.json({ success: true, data: users });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await BorrowerService.updateBorrower(req.params.id, req.body);
            if (!user) return res.status(404).json({ message: "Borrower not found" });
            res.json({ success: true, data: user });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await BorrowerService.deleteBorrower(req.params.id);
            if (!user) return res.status(404).json({ message: "Borrower not found" });
            res.json({ message: "Borrower deleted successfully" });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },
};
