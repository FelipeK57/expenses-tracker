import db from "@/app/db/db";

export const newTransaction = async (
  type: "income" | "expense",
  amount: number,
  date: string,
  category: string,
  note?: string,
) => {
  return await db.transactions.add({ type, note, amount, date, category });
};

export const getCurrentBalance = async () => {
  const allTransactions = await db.transactions.toArray();

  const balance = allTransactions.reduce((acc, transaction) => {
    if (transaction.type === "income") {
      return acc + transaction.amount;
    } else {
      return acc - transaction.amount;
    }
  }, 0);

  return balance;
};

export const getTransactionsByMonth = async (month: number, year: number) => {
  const allTransactions = await db.transactions.toArray();

  return allTransactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getTotalIncomesByMonth = async (month: number, year: number) => {
  const allTransactions = await db.transactions
    .where("type")
    .equals("income")
    .toArray();

  return allTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === month &&
      transactionDate.getFullYear() === year
    );
  });
};

export const getTotalExpensesByMonth = async (month: number, year: number) => {
  const allTransactions = await db.transactions
    .where("type")
    .equals("expense")
    .toArray();

  return allTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === month &&
      transactionDate.getFullYear() === year
    );
  });
};

export const getRecentTransactions = async (limit: number) => {
  return await db.transactions.orderBy("date").reverse().limit(limit).toArray();
};

export const deleteTransaction = async (id: number) => {
  return await db.transactions.delete(id);
};

export const updateTransaction = async (
  id: number,
  amount: number,
  date: string,
  category: string,
  note?: string,
) => {
  return await db.transactions.update(id, { note, amount, date, category });
};
