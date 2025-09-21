import { NextFunction, Request, Response } from "express";
import { borrowerService } from "./borrower.service";
import { parseError } from "../../utils/parseError";

export const borrowerController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await borrowerService.createBorrower(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await borrowerService.getAllBorrowers();
            res.json({ success: true, data: users });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await borrowerService.getBorrowerById(req.params.id);
            if (!user) return res.status(404).json({ message: "Borrower not found" });
            res.json({ success: true, data: user });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async getByCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await borrowerService.getBorrowersByCreator(req.params.creatorId);
            res.json({ success: true, data: users });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await borrowerService.updateBorrower(req.params.id, req.body);
            if (!user) return res.status(404).json({ message: "Borrower not found" });
            res.json({ success: true, data: user });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await borrowerService.deleteBorrower(req.params.id);
            if (!user) return res.status(404).json({ message: "Borrower not found" });
            res.json({ message: "Borrower deleted successfully" });
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError);
        }
    },
};
