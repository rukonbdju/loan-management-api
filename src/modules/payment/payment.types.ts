export interface CreatePaymentDTO {
    borrower: string;
    loan: string;
    paymentAmount: number;
    paymentMethod: string;
    paymentDate: string;
    createdBy: string;
}

export interface UpdatePaymentDTO {
    paymentAmount?: number;
    paymentMethod?: string;
    paymentDate?: string
}