import { Button, Card, CardBody } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { NewIncome } from "../components/NewIncome";
import { NewExpense } from "../components/NewExpense";
import {
  type Transaction,
  expenseCategories,
  incomeCategories,
} from "@/app/schema";
import { useEffect, useState } from "react";
import {
  getCurrentBalance,
  getRecentTransactions,
  getTotalExpensesByMonth,
  getTotalIncomesByMonth,
} from "../services/transactions.service";

export const Home = () => {
  // Obtenemos mes y año actuales
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  // Función para obtener el ícono de una categoría
  const findIconByCategory = (
    type: "income" | "expense",
    categoryKey: string,
  ) => {
    const categories = type === "income" ? incomeCategories : expenseCategories;
    const category = categories.find((cat) => cat.key === categoryKey);
    return category ? category.icon : null;
  };

  // Datos del dashboard
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  // Refrescar datos
  const [refreshData, setRefreshData] = useState<boolean>(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      const recentTransactionsData = await getRecentTransactions(5);
      setRecentTransactions(recentTransactionsData);

      const currentBalanceData = await getCurrentBalance();
      setCurrentBalance(currentBalanceData);

      const incomesData = await getTotalIncomesByMonth(month, year);
      const totalIncomesAmount = incomesData.reduce(
        (acc, transaction) => acc + transaction.amount,
        0,
      );
      setTotalIncomes(totalIncomesAmount);

      const expensesData = await getTotalExpensesByMonth(month, year);
      const totalExpensesAmount = expensesData.reduce(
        (acc, transaction) => acc + transaction.amount,
        0,
      );
      setTotalExpenses(totalExpensesAmount);
    };

    fetchData();
  }, [refreshData]);

  return (
    <main className="relative flex flex-col gap-2 p-4 h-full">
      <article className="flex flex-col gap-2">
        <article className="flex items-center justify-between">
          <p className="text font-semibold">
            Resumen de{" "}
            {new Date(year, month).toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <article className="flex items-center justify-center gap-2">
            <Button isIconOnly variant="light" size="lg">
              <ChevronLeft className="size-5" />
            </Button>
            <Button isIconOnly variant="light" size="lg">
              <ChevronRight className="size-5" />
            </Button>
          </article>
        </article>

        <div className="py-4">
          <p className="text-sm text-center">Balance actual</p>
          <p className="text-center first-letter:g font-bold text-5xl">
            $
            {currentBalance.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <article className="grid grid-cols-2 gap-4">
          <Card className="w-full">
            <CardBody>
              <div className="grid place-content-center size-10 bg-success-400/20 rounded-xl">
                <TrendingUp className="size-5 text-success" />
              </div>
              <p className="mt-4 font-semibold text-default-500">Ingresos</p>
              <p className="font-semibold text-xl mt-2">
                $
                {totalIncomes.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </CardBody>
          </Card>
          <Card className="w-full">
            <CardBody>
              <div className="grid place-content-center size-10 bg-danger-400/20 rounded-xl">
                <TrendingDown className="size-5 text-danger" />
              </div>
              <p className="mt-4 font-semibold text-default-500">Gastos</p>
              <p className="font-semibold text-xl mt-2">
                $
                {totalExpenses.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </CardBody>
          </Card>
        </article>
      </article>
      <article className="flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Últimos movimientos</h2>
          <Button
            variant="light"
            endContent={<ChevronRight className="size-5" />}
          >
            Ver todos
          </Button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
          {recentTransactions.map((transaction, index) => (
            <Card key={index}>
              <CardBody className="flex flex-row gap-4 items-center">
                <div
                  className={`grid place-content-center size-12 ${
                    transaction.type === "income"
                      ? "bg-success-400/20 text-success"
                      : "bg-danger-400/20 text-danger"
                  } rounded-xl`}
                >
                  {(() => {
                    const Icon: any = findIconByCategory(
                      transaction.type,
                      transaction.category,
                    ) as typeof Icon;
                    return Icon ? <Icon className="size-6" /> : null;
                  })()}
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold">
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-default-500">{transaction.date}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </article>
      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        <NewIncome refreshData={refreshData} setRefreshData={setRefreshData} />
        <NewExpense refreshData={refreshData} setRefreshData={setRefreshData} />
      </div>
    </main>
  );
};
