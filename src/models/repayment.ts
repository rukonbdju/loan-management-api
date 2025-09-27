import { model, Schema } from "mongoose";

const repaymentSchema = new Schema(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // owner
        loanId: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
        borrowerId: { type: Schema.Types.ObjectId, ref: "Borrower", required: true },
        installmentId: { type: Schema.Types.ObjectId, ref: "Installment" }, // optional for one-time loans
        amount: { type: Number, required: true },
        method: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now }
    },
    { timestamps: true }
);


const RepaymentModel = model('Repayment', repaymentSchema)
export default RepaymentModel;