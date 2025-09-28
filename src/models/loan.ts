import { model, Schema } from "mongoose";

const loanSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // owner
    borrowerId: { type: Schema.Types.ObjectId, ref: "Borrower", required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: "BDT" },
    disbursementDate: { type: Date, required: true }, // disbursement date
    disbursementMethod: { type: String, required: true },
    repaymentPlan: { type: String, enum: ["one_time", "installments"], required: true },
    oneTimePlan: {
        dueDate: { type: Date },
    },
    installmentPlan: {
        numberOfInstallments: { type: Number },
        cycle: { type: String, },
        firstDueDate: { type: Date },
    }
}, { timestamps: true });



const LoanModel = model('Loan', loanSchema)
export default LoanModel