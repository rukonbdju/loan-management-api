import { model, Schema } from "mongoose";
import LoanModel from "./loan";
import PaymentModel from "./payment";

const contactSchema = new Schema(
    {
        contactId: { type: String, required: true, },
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: false },
        address: { type: String, required: false },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
)

// 🛡️ Ensure Contact ID is unique PER USER
contactSchema.index({ contactId: 1, createdBy: 1 }, { unique: true });

// 🕵🏼 Cascade delete when a contact is deleted
contactSchema.pre('findOneAndDelete', async function (next) {
    const contact = await this.model.findOne(this.getFilter())
    if (contact) {
        await LoanModel.deleteMany({ contact: contact._id })
        await PaymentModel.deleteMany({ contact: contact._id })
    }
    next();
})

const ContactModel = model('Contact', contactSchema)

export default ContactModel;