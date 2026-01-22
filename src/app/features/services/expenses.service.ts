import db from "@/app/db/db";

export const newExpense = async (
  reason: string,
  amount: number,
  date: string,
  category: string,
) => {
  return await db.expenses.add({ reason, amount, date, category });
};

export const getAllExpenses = async () => {
  return await db.expenses.toArray();
};

export const deleteExpense = async (id: number) => {
  return await db.expenses.delete(id);
};

export const updateExpense = async (
  id: number,
  reason: string,
  amount: number,
  date: string,
  category: string,
) => {
  return await db.expenses.update(id, { reason, amount, date, category });
};
