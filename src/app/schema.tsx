import { BookOpen, BriefcaseBusiness, Bus, DollarSign, Fuel, GiftIcon, HeartPulse, Home, MoreHorizontal, Popcorn, Receipt, ReceiptText, ShoppingBag, TrendingUp, Utensils } from "lucide-react";

export const incomeCategories = [
  { label: "Salario", key: "Salary", icon: DollarSign },
  { label: "Ventas", key: "Sales", icon: ReceiptText },
  { label: "Freelance", key: "Freelance", icon: BriefcaseBusiness },
  { label: "Inversiones", key: "Investments", icon: TrendingUp },
  { label: "Regalos", key: "Gifts", icon: GiftIcon },
  { label: "Otros", key: "Other", icon: MoreHorizontal },
];

export const expenseCategories = [
  { label: "Comida", key: "Food", icon: Utensils },
  { label: "Transporte", key: "Transport", icon: Bus },
  { label: "Gasolina", key: "Gasoline", icon: Fuel },
  { label: "Vivienda", key: "Housing", icon: Home },
  { label: "Salud", key: "Health", icon: HeartPulse },
  { label: "Entretenimiento", key: "Entertainment", icon: Popcorn },
  { label: "Educación", key: "Education", icon: BookOpen },
  { label: "Facturas", key: "Bills", icon: Receipt },
  { label: "Compras", key: "Shopping", icon: ShoppingBag },
  { label: "Otros", key: "Other", icon: MoreHorizontal },
];

type IncomeCategory = (typeof incomeCategories)[number]["key"];
type ExpenseCategory = (typeof expenseCategories)[number]["key"];

export interface Transaction {
  id?: string;
  type: "income" | "expense";
  amount: number;
  category: IncomeCategory | ExpenseCategory;
  date: string;
  note?: string;
  // isRecurring?: boolean
}

// export interface Category {
//   id
//   name
//   type: 'income' | 'expense'
//   color
//   icon?
// }

// export interface Recurring {
//   id
//   type
//   amount
//   categoryId
//   frequency: 'monthly'
//   startDate
//   active
// }
