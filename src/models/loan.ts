import { model, Schema } from "mongoose";
import PaymentModel from "./payment";

const loanSchema = new Schema(
    {
        loanId: { type: String, unique: true }, // Auto-generated
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        contact: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: "BDT" },
        loanType: { type: String, enum: ['one-time', 'installment'], default: 'one-time', required: true },
        installments: { type: Number, default: 1 },
        disbursementDate: { type: Date, required: true },
        disbursementMethod: { type: String, required: true },
        dueDate: { type: Date, required: true },
    },
    { timestamps: true }
);

// 🕵🏼 Cascade delete when a loan is deleted
loanSchema.pre('findOneAndDelete', async function (next) {
    const loan = await this.model.findOne(this.getFilter())
    if (loan) {
        await PaymentModel.deleteMany({ loan: loan._id })
    }
    next();
})

const LoanModel = model('Loan', loanSchema)
export default LoanModel