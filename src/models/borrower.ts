import { model, Schema } from "mongoose";
import LoanModel from "./loan";

const borrowerSchema = new Schema(
    {
        borrowerId: { type: String, required: true, },
        name: { type: String, required: true },
        phone: { type: String, required: true, },
        email: { type: String, required: true, },
        address: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
)

// 🕵🏼 Cascade delete when a borrower is deleted
borrowerSchema.pre('findOneAndDelete', async function (next) {
    const borrower = await this.model.findOne(this.getFilter())
    if (borrower) {
        await LoanModel.deleteMany({ borrower: borrower._id })
    }
    next();
})

const BorrowerModel = model('Borrower', borrowerSchema)

export default BorrowerModel;