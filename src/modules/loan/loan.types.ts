import { Types } from "mongoose";

export interface LoanInput {
    loanId: string;
    createdBy: Types.ObjectId;
    borrowerId: Types.ObjectId;
    amount: number;
    currency: string;
    disbursementDate: Date;
    disbursementMethod: string;
    dueDate: Date;
}