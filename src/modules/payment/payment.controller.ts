import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { parseError } from "../../utils/parseError";
import PaymentService from "./payment.service";

const PaymentController = {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const creatorId = req.userId;
            if (!creatorId) {
                return res.status(401).json({ success: false, message: 'User ID is not found' })
            }
            const result = await PaymentService.create(req.body)
            res.status(201).json({ success: true, data: result })

        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError)
        }
    },

    async filterByUserId(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const creatorId = req.userId;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const page = req.query.page ? Number(req.query.page) : 1;
            if (!creatorId) {
                return res.status(401).json({ success: false, message: 'User ID is not found' })
            }
            const result = await PaymentService.getPaymentHistory({ createdBy: creatorId, limit, page })
            res.status(200).json({ success: true, data: result })
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError)
        }
    },

    async filterByBorrowerId(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            const result = await PaymentService.filterByBorrowerId(id)
            res.status(200).json({ success: true, data: result })
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError)
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req?.params?.id
            if (!id) {
                return res.status(404).json({ success: false, message: 'Item not found' })
            }
            const result = await PaymentService.update(id, req.body)
            res.status(200).json({ success: true, data: result })
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError)
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req?.params?.id
            if (!id) {
                return res.status(404).json({ success: false, message: 'Item not found' })
            }
            const result = await PaymentService.delete(id)
            res.status(200).json({ success: true, data: result })
        } catch (error) {
            const parsedError = parseError(error)
            next(parsedError)
        }
    }
}


export default PaymentController;