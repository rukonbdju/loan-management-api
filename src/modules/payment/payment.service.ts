import PaymentModel from "../../models/payment";
import { CreatePaymentDTO, UpdatePaymentDTO } from "./payment.types";

const PaymentService = {
    async create(data: CreatePaymentDTO) {
        const newPayment = new PaymentModel(data)
        return await newPayment.save()
    },
    async update(id: string, data: UpdatePaymentDTO) {
        return await PaymentModel.findByIdAndUpdate(id, data, { new: true })
    },
    async delete(id: string,) {
        return await PaymentModel.findByIdAndDelete(id)
    },
    async filterByUserId(userId: string) {
        return await PaymentModel.find({ createdBy: userId }).populate('borrower')
    },
    async filterByBorrowerId(borrowerId: string) {
        return await PaymentModel.find({ borrower: borrowerId }).populate('loan')
    }
}

export default PaymentService;