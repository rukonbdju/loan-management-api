import PaymentModel from "../../models/payment";
import { CreatePaymentDTO, UpdatePaymentDTO } from "./payment.types";
import mongoose from "mongoose";

interface PaginationParams {
    createdBy: string;
    page?: number;
    limit?: number;
}




const PaymentService = {
    create: async (data: CreatePaymentDTO) => {
        const newPayment = new PaymentModel(data)
        return await newPayment.save()
    },

    update: async (id: string, data: UpdatePaymentDTO) => {
        return await PaymentModel.findByIdAndUpdate(id, data, { new: true })
    },

    delete: async (id: string,) => {
        return await PaymentModel.findByIdAndDelete(id)
    },

    filterByUserId: async (userId: string) => {
        return await PaymentModel.find({ createdBy: userId }).populate('borrower')
    },

    filterByBorrowerId: async (borrowerId: string) => {
        return await PaymentModel.find({ borrower: borrowerId }).populate('loan')
    },

    getPaymentHistory: async ({ createdBy, page = 1, limit = 10, }: PaginationParams) => {
        const userId = new mongoose.Types.ObjectId(createdBy)
        const skip = (page - 1) * limit;

        // Aggregation pipeline
        const payments = await PaymentModel.aggregate([
            { $match: { createdBy: userId } },

            // Lookup borrower info
            {
                $lookup: {
                    from: "borrowers",
                    localField: "borrower",
                    foreignField: "_id",
                    as: "borrower",
                },
            },
            { $unwind: "$borrower" },

            // Lookup loan info
            {
                $lookup: {
                    from: "loans",
                    localField: "loan",
                    foreignField: "_id",
                    as: "loan",
                },
            },
            { $unwind: "$loan" },

            // Project final fields
            {
                $project: {
                    _id: 0,
                    borrower: "$borrower.name",
                    borrowerId: "$borrower.borrowerId",
                    loanId: "$loan.loanId",
                    loanAmount: "$loan.amount",
                    paymentAmount: 1,
                    paymentMethod: 1,
                    paymentDate: 1,
                },
            },

            // Sort by latest payment
            { $sort: { paymentDate: -1 } },

            // Pagination
            { $skip: skip },
            { $limit: limit },
        ]);

        // Get total count for pagination
        const totalCount = await PaymentModel.countDocuments({ createdBy: userId });

        return {
            payments,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }
}

export default PaymentService;