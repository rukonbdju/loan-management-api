import { model, Schema } from "mongoose";

const transactionSchema = new Schema(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ['income', 'expense'], required: true },
        date: { type: Date, required: true }
    },
    { timestamps: true }
);

const TransactionModel = model('Transaction', transactionSchema);
export default TransactionModel;
