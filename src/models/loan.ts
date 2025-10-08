import { model, Schema } from "mongoose";

const loanSchema = new Schema(
    {
        loanId: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        borrower: { type: Schema.Types.ObjectId, ref: "Borrower", required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: "BDT" },
        disbursementDate: { type: Date, required: true },
        disbursementMethod: { type: String, required: true },
        dueDate: { type: Date, required: true },
    },
    { timestamps: true }
);

const LoanModel = model('Loan', loanSchema)
export default LoanModel