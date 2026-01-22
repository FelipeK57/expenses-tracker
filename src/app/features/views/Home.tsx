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

export const Home = () => {
  const recentTransactions: Transaction[] = [
    {
      type: "income",
      note: "Pago de nómina",
      amount: 2000.0,
      date: "2024-06-01",
      category: "Salary",
    },
    {
      type: "expense",
      note: "Compra de comestibles",
      amount: -150.75,
      date: "2024-06-03",
      category: "Food",
    },
    {
      type: "expense",
      note: "Gasolina para el coche",
      amount: -40.0,
      date: "2024-06-05",
      category: "Gasoline",
    },
    {
      type: "expense",
      note: "Cena en restaurante",
      amount: -60.0,
      date: "2024-06-07",
      category: "Food",
    },
    {
      type: "expense",
      note: "Transporte público",
      amount: -20.0,
      date: "2024-06-08",
      category: "Transport",
    },
  ];

  // Obtenemos mes y año actuales
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const findIconByCategory = (
    type: "income" | "expense",
    categoryKey: string,
  ) => {
    const categories = type === "income" ? incomeCategories : expenseCategories;
    const category = categories.find((cat) => cat.key === categoryKey);
    return category ? category.icon : null;
  };

  return (
    <main className="relative flex flex-col gap-2 p-4 h-full">
      <article className="flex flex-col gap-2">
        <article className="flex items-center justify-between">
          <p className="text-lg font-semibold">
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
            $51,889.00
          </p>
        </div>

        <article className="grid grid-cols-2 gap-4">
          <Card className="w-full">
            <CardBody>
              <div className="grid place-content-center size-10 bg-success-400/20 rounded-xl">
                <TrendingUp className="size-5 text-success" />
              </div>
              <p className="mt-4 font-semibold text-default-500">Ingresos</p>
              <p className="font-semibold text-xl mt-2">$102,012</p>
            </CardBody>
          </Card>
          <Card className="w-full">
            <CardBody>
              <div className="grid place-content-center size-10 bg-danger-400/20 rounded-xl">
                <TrendingDown className="size-5 text-danger" />
              </div>
              <p className="mt-4 font-semibold text-default-500">Gastos</p>
              <p className="font-semibold text-xl mt-2">$50,123</p>
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
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-default-500">{transaction.date}</p>
                  {/* <p className="font-semibold">{transaction.note}</p> */}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </article>
      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        <NewIncome />
        <NewExpense />
      </div>
    </main>
  );
};
