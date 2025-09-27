import { model, Schema } from "mongoose";

const installmentSchema = new Schema(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // owner
        loanId: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
        borrowerId: { type: Schema.Types.ObjectId, ref: "Borrower", required: true },

        dueDate: { type: Date, required: true },
        amount: { type: Number, required: true },

        // derived field, but can be persisted for faster queries
        status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    },
    { timestamps: true }
);

const InstallmentModel = model('Installment', installmentSchema)
