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
        return await PaymentModel.find({ createdBy: userId }).populate('contact')
    },

    filterByContactId: async (contactId: string) => {
        return await PaymentModel.find({ contact: contactId }).populate('loan')
    },

    getPaymentHistory: async ({ createdBy, page = 1, limit = 10, }: PaginationParams) => {
        const userId = new mongoose.Types.ObjectId(createdBy)
        const skip = (page - 1) * limit;

        const payments = await PaymentModel.aggregate([
            { $match: { createdBy: userId } },

            {
                $lookup: {
                    from: "contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            { $unwind: "$contact" },

            {
                $lookup: {
                    from: "loans",
                    localField: "loan",
                    foreignField: "_id",
                    as: "loan",
                },
            },
            { $unwind: "$loan" },

            {
                $project: {
                    _id: 0,
                    contact: "$contact.name",
                    contactId: "$contact.contactId",
                    loanId: "$loan.loanId",
                    loanAmount: "$loan.amount",
                    paymentAmount: 1,
                    paymentMethod: 1,
                    paymentDate: 1,
                },
            },

            { $sort: { paymentDate: -1 } },

            { $skip: skip },
            { $limit: limit },
        ]);

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