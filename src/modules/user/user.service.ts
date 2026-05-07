import UserModel from "../../models/user";
import { RegisterUserDTO } from "../auth/auth.types";
import { hashPassword } from "../auth/auth.utils";


export const UserService = {
    async createNewUser(userData: RegisterUserDTO) {
        userData.password = await hashPassword(userData.password);
        const user = new UserModel(userData);
        return await user.save();
    },

    async getUsers() {
        return await UserModel.find({}, { password: 0 })
    },

    async updateUser(id: string, data: any) {
        return await UserModel.findByIdAndUpdate(id,
            { ...data }, { new: true }
        )
    },

    async deleteUserById(id: string) {
        return await UserModel.findByIdAndDelete(id,)
    },

    async findUserById(id: string) {
        return await UserModel.findById(id)
    },

    async findUserByEmail(email: string) {
        return await UserModel.findOne({ email }).select('+password')
    },

    async upsertGoogleUser(googleData: { googleId: string, email: string, name: string }) {
        let user = await UserModel.findOne({ email: googleData.email });
        if (user) {
            user.googleId = googleData.googleId;
            user.name = googleData.name; // Optional: update name from Google
            await user.save();
        } else {
            user = new UserModel({
                email: googleData.email,
                name: googleData.name,
                googleId: googleData.googleId,
            });
            await user.save();
        }
        return user;
    }
};
