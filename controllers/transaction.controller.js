import Transaction from "../models/transaction.model.js";

export const getTransactions = async (req, res) => {
    const transactionType = req.query.transactionType;

    try {
        const currentDate = new Date();
        const twelveMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);

        const monthlyTotals = await Transaction.aggregate([
            {
                $match: {
                    transactionType: transactionType,
                    date: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%m/%Y", date: "$date" } },
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(monthlyTotals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu giao dịch' });
    }
};