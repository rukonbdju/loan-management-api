import { Types } from "mongoose";

export interface LoanInput {
    loanId?: string;
    createdBy: string | Types.ObjectId;
    contact: string | Types.ObjectId;
    amount: number;
    currency: string;
    loanType: 'one-time' | 'installment';
    installments?: number;
    disbursementDate: Date;
    disbursementMethod: string;
    dueDate: Date;
}