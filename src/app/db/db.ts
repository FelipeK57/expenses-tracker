import Dexie from "dexie";

interface Expense {
  id?: number;
  reason: string;
  amount: number;
  date: string;
  category: string;
}

class ExpensesTrackerDB extends Dexie {
  expenses: Dexie.Table<Expense, number>;

  constructor() {
    super("expenses-tracker_db");
    this.expenses = this.table("expenses");
  }
}

const expensesTrackerDB = new ExpensesTrackerDB();

expensesTrackerDB.version(1).stores({
  expenses: "++id, reason, amount, date, category",
});

export default expensesTrackerDB;
