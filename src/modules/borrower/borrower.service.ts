
import BorrowerModel from "../../models/borrower";
import { CreateBorrowerType, UpdateBorrowerType } from "./borrower.types";

export const borrowerService = {
    async createBorrower(data: CreateBorrowerType) {
        const borrower = new BorrowerModel(data);
        return await borrower.save();
    },

    async getAllBorrowers() {
        return await BorrowerModel.find();
    },

    async getBorrowersByCreator(creatorId: string) {
        return await BorrowerModel.find({ createdBy: creatorId });
    },

    async getBorrowerById(id: string) {
        return await BorrowerModel.findById(id);
    },

    async updateBorrower(id: string, data: UpdateBorrowerType) {
        return await BorrowerModel.findByIdAndUpdate(id, data, { new: true });
    },

    async deleteBorrower(id: string) {
        return await BorrowerModel.findByIdAndDelete(id);
    },
};
