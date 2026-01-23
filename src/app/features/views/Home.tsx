import { Button, Card, CardBody, Skeleton } from "@heroui/react";
import {
  ChevronRight,
  TrendingDown,
  TrendingUp,
  History,
  Settings,
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
import { Link } from "react-router";

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
  const [loading, setLoading] = useState<boolean>(true);

  // Refrescar datos
  const [refreshData, setRefreshData] = useState<boolean>(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          recentTransactionsData,
          currentBalanceData,
          incomesData,
          expensesData,
        ] = await Promise.all([
          getRecentTransactions(5),
          getCurrentBalance(),
          getTotalIncomesByMonth(month, year),
          getTotalExpensesByMonth(month, year),
        ]);

        setRecentTransactions(recentTransactionsData);
        setCurrentBalance(currentBalanceData);

        const totalIncomesAmount = incomesData.reduce(
          (acc, transaction) => acc + transaction.amount,
          0,
        );
        setTotalIncomes(totalIncomesAmount);

        const totalExpensesAmount = expensesData.reduce(
          (acc, transaction) => acc + transaction.amount,
          0,
        );
        setTotalExpenses(totalExpensesAmount);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshData]);

  return (
    <main className="relative flex flex-col gap-2 p-4 h-full">
      <article className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text font-semibold">
            Resumen de{" "}
            {new Date(year, month).toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <Button
            as={Link}
            to="/settings"
            variant="light"
            size="sm"
            isIconOnly
            aria-label="Ajustes"
          >
            <Settings className="size-5" />
          </Button>
        </div>
        <div className="py-4">
          <p className="text-sm text-center">Balance actual</p>
          <div className="text-center first-letter:g font-bold text-4xl">
            {!loading ? (
              `$${currentBalance.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
              })}`
            ) : (
              <Skeleton className="w-32 h-10 mx-auto rounded-xl" />
            )}
          </div>
        </div>

        <article className="grid grid-cols-2 gap-2">
          <Card className="w-full shadow-none border-1 border-divider dark:border-content2">
            <CardBody>
              <div className="grid place-content-center size-10 bg-success-400/20 rounded-xl">
                <TrendingUp className="size-5 text-success" />
              </div>
              <p className="mt-2 font-semibold text-default-500">Ingresos</p>
              <div className="font-semibold text-xl mt-2">
                {!loading ? (
                  `$${totalIncomes.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}`
                ) : (
                  <Skeleton className="w-24 h-6 rounded-xl" />
                )}
              </div>
            </CardBody>
          </Card>
          <Card className="w-full shadow-none border-1 border-divider dark:border-content2">
            <CardBody>
              <div className="grid place-content-center size-10 bg-danger-400/20 rounded-xl">
                <TrendingDown className="size-5 text-danger" />
              </div>
              <p className="mt-2 font-semibold text-default-500">Gastos</p>
              <div className="font-semibold text-xl mt-2">
                {!loading ? (
                  `$${totalExpenses.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}`
                ) : (
                  <Skeleton className="w-24 h-6 rounded-xl" />
                )}
              </div>
            </CardBody>
          </Card>
        </article>
      </article>
      <article className="flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Últimos movimientos</h2>
          <Button
            as={Link}
            to="/transactions"
            variant="light"
            endContent={<ChevronRight className="size-5" />}
          >
            Ver todos
          </Button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
          {!loading && recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <Card
                key={index}
                className="shadow-none border-1 border-divider dark:border-content2"
              >
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
                    <p className="text-sm text-default-500">
                      {transaction.date}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 mt-4">
              <History className="size-12 text-default" />
              <p className="text-center text-sm text-default-500">
                No hay movimientos recientes.
              </p>
            </div>
          ) : (
            <>
              {[...Array(3)].map((_, index) => (
                <Card
                  key={index}
                  className="shadow-none border-1 border-divider dark:border-content2"
                >
                  <CardBody className="flex flex-row gap-4 items-center">
                    <Skeleton className="size-12 rounded-xl shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="w-32 h-4 rounded-lg" />
                      <Skeleton className="w-24 h-6 rounded-lg" />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </>
          )}
        </div>
      </article>
      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        <NewIncome refreshData={refreshData} setRefreshData={setRefreshData} />
        <NewExpense refreshData={refreshData} setRefreshData={setRefreshData} />
      </div>
    </main>
  );
};
