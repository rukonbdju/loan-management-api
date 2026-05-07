export interface CreateTransactionDTO {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: Date;
    createdBy: string;
}

export interface UpdateTransactionDTO {
    description?: string;
    amount?: number;
    type?: 'income' | 'expense';
    date?: Date;
}
