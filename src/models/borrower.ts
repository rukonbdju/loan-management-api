import { model, Schema } from "mongoose";

const borrowerSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        nid: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
)

const BorrowerModel = model('Borrower', borrowerSchema)

export default BorrowerModel;