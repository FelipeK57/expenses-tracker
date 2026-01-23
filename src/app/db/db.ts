import Dexie from "dexie";
import type { Transaction } from "../schema";

class ExpensesTrackerDB extends Dexie {
  transactions: Dexie.Table<Transaction, number>;

  constructor() {
    super("finances-tracker_db");
    this.version(2).stores({
      transactions: "++id, type, note, amount, date, category",
    });
    this.transactions = this.table("transactions");
  }
}

const expensesTrackerDB = new ExpensesTrackerDB();

export default expensesTrackerDB;
