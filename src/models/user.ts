import { model, Schema, } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true, },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true, select: false },
        address: { type: String },
    },
    { timestamps: true }
);

const UserModel = model("User", UserSchema);

export default UserModel;
