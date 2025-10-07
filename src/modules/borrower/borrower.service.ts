
import BorrowerModel from "../../models/borrower";
import { CreateBorrowerDTO, UpdateBorrowerDTO } from "./borrower.types";

export const BorrowerService = {
    async createBorrower(data: CreateBorrowerDTO) {
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
    async filterBorrowerByCreatorAndBorrowerId(borrowerId: string, creatorId: string) {
        console.log({ creatorId, borrowerId })
        return await BorrowerModel.findOne({
            borrowerId: borrowerId,
            createdBy: creatorId
        })
    },

    async updateBorrower(id: string, data: UpdateBorrowerDTO) {
        return await BorrowerModel.findByIdAndUpdate(id, data, { new: true });
    },

    async deleteBorrower(id: string) {
        return await BorrowerModel.findByIdAndDelete(id);
    },
};
