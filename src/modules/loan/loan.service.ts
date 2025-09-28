
import { Types } from "mongoose";
import LoanModel from "../../models/loan";
import InstallmentModel from "../../models/installment";
import RepaymentModel from "../../models/repayment";

interface LoanInput {
    createdBy: Types.ObjectId;
    borrowerId: Types.ObjectId;
    totalAmount: number;
    currency: string;
    disbursementDate: Date;
    disbursementMethod: string;
    repaymentPlan: "one_time" | "installments";
    oneTimePlan?: { dueDate: Date };
    installmentPlan?: { numberOfInstallments: number; cycle: string; firstDueDate: Date };
}

export const LoanService = {
    createLoan: async (loanData: LoanInput) => {
        // 1. Create loan
        const loan = new LoanModel(loanData);
        await loan.save();

        // 2. If installments plan, auto-generate installments
        if (loan.repaymentPlan === "installments" && loan.installmentPlan) {
            const { numberOfInstallments, cycle, firstDueDate } = loan.installmentPlan;
            const installmentAmount = loan.totalAmount / numberOfInstallments!;

            const installments = [];
            let dueDate = new Date(firstDueDate!);

            for (let i = 0; i < numberOfInstallments!; i++) {
                installments.push({
                    loanId: loan._id,
                    borrowerId: loan.borrowerId,
                    createdBy: loan.createdBy,
                    amount: installmentAmount,
                    dueDate: new Date(dueDate),
                });

                // add cycle days
                if (cycle === "30days") dueDate.setDate(dueDate.getDate() + 30);
                if (cycle === "60days") dueDate.setDate(dueDate.getDate() + 60);
                if (cycle === "90days") dueDate.setDate(dueDate.getDate() + 90);
            }

            await InstallmentModel.insertMany(installments);
        }

        return loan;
    },
    getLoansForTable: async (userId: string) => {
        // 1️⃣ Fetch all loans for this user
        const loans = await LoanModel.find({ createdBy: userId })
            .populate("borrowerId", "name")
            .lean();

        const loanIds = loans.map(loan => loan._id);

        // 2️⃣ Fetch all installments for these loans
        const installments = await InstallmentModel.find({ loanId: { $in: loanIds } }).lean();

        // 3️⃣ Fetch all repayments for these loans
        const repayments = await RepaymentModel.find({ loanId: { $in: loanIds } }).lean();

        // 4️⃣ Map loans to table data
        const loanTableData = loans.map(loan => {
            const loanInstallments = installments.filter(i => i.loanId.toString() === loan._id.toString());
            const loanRepayments = repayments.filter(r => r.loanId.toString() === loan._id.toString());

            const totalPaid = loanRepayments.reduce((sum, r) => sum + r.amount, 0);
            const outstanding = loan.totalAmount - totalPaid;

            // Determine next due date
            let nextDueDate: string | null = null;
            if (loan.repaymentPlan === "one_time") {
                nextDueDate = loan.oneTimePlan?.dueDate?.toISOString().split("T")[0] || null;
            } else if (loanInstallments.length) {
                const unpaidInstallments = loanInstallments.filter(inst => {
                    const paidAmount = loanRepayments
                        .filter(r => r.installmentId?.toString() === inst._id.toString())
                        .reduce((sum, r) => sum + r.amount, 0);
                    return paidAmount < inst.amount;
                });
                nextDueDate = unpaidInstallments.length
                    ? new Date(unpaidInstallments[0].dueDate).toISOString().split("T")[0]
                    : null;
            }

            // Determine status dynamically
            let status: "Pending" | "Active" | "Overdue" | "Paid" = "Pending";
            const now = new Date();
            if (outstanding <= 0) status = "Paid";
            else if (nextDueDate && new Date(nextDueDate) < now) status = "Overdue";
            else status = "Active";

            return {
                loanId: loan._id,
                //borrowerName: loan.borrowerId?.name || "",
                totalAmount: loan.totalAmount,
                currency: loan.currency,
                disbursementDate: loan.disbursementDate?.toISOString().split("T")[0] || "",
                repaymentPlan: loan.repaymentPlan,
                nextDueDate,
                totalPaid,
                outstanding,
                status,
                numberOfInstallments: loan.repaymentPlan === "installments"
                    ? loan.installmentPlan?.numberOfInstallments
                    : undefined,
            };
        });

        return loanTableData;
    },

    getLoansByUser: async (userId: string) => {
        return LoanModel.find({ createdBy: userId }).populate("borrowerId", "name");
    },

    getLoanById: async (loanId: string, userId: string) => {
        return LoanModel.findOne({ _id: loanId, createdBy: userId }).populate("borrowerId", "name");
    },

    updateLoan: async (loanId: string, userId: string, updateData: Partial<LoanInput>) => {
        return LoanModel.findOneAndUpdate({ _id: loanId, createdBy: userId }, updateData, { new: true });
    },

    deleteLoan: async (loanId: string, userId: string) => {
        return LoanModel.findOneAndDelete({ _id: loanId, createdBy: userId });
    },
};
