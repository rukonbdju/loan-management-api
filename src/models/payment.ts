import { model, Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        loan: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
        borrower: { type: Schema.Types.ObjectId, ref: "Borrower", required: true },
        paymentAmount: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        paymentDate: { type: Date, required: true }
    },
    { timestamps: true }
);


const PaymentModel = model('Payment', paymentSchema)
export default PaymentModel;