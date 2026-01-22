import { Button, Card, CardBody } from "@heroui/react";
import { Bus, ChevronRight, Popcorn, Utensils } from "lucide-react";
import { NewMovement } from "../components/NewMovement";

export const Home = () => {
  const expensesByCategory = [
    {
      category: "Comida",
      amount: 345.67,
      icon: (
        <div className="grid place-content-center size-10 bg-orange-400/20 rounded-xl">
          <Utensils className="size-5 text-orange-400" />
        </div>
      ),
    },
    {
      category: "Transporte",
      amount: 123.45,
      icon: (
        <div className="grid place-content-center size-10 bg-blue-400/20 rounded-xl">
          <Bus className="size-5 text-blue-400" />
        </div>
      ),
    },
    {
      category: "Entretenimiento",
      amount: 89.99,
      icon: (
        <div className="grid place-content-center size-10 bg-red-400/20 rounded-xl">
          <Popcorn className="size-5 text-red-400" />
        </div>
      ),
    },
  ];

  const recentTransactions = [
    {
      reason: "Almuerzo",
      amount: 15.67,
      date: "2024-06-01",
      category: "Comida",
    },
    {
      reason: "Taxi",
      amount: 23.45,
      date: "2024-06-02",
      category: "Transporte",
    },
    {
      reason: "Cine",
      amount: 12.99,
      date: "2024-06-03",
      category: "Entretenimiento",
    },
    {
      reason: "Cena",
      amount: 30.0,
      date: "2024-06-04",
      category: "Comida",
    },
    {
      reason: "Bus",
      amount: 10.0,
      date: "2024-06-05",
      category: "Transporte",
    },
    {
      reason: "Concierto",
      amount: 45.0,
      date: "2024-06-06",
      category: "Entretenimiento",
    },
  ];

  return (
    <main className="relative flex flex-col gap-4 p-4 h-full">
      <article className="flex flex-col gap-4">
        <h1 className="font-medium text-center">Personal Expenses</h1>

        <h2 className="text-center text-default-500">Total balance</h2>

        <p className="text-center first-letter:g font-semibold text-5xl">
          $12,345.67
        </p>

        <article className="space-y-2">
          <div className="flex items-center justify-between w-full">
            <p>Categorías del mes</p>
            <Button
              endContent={<ChevronRight className="size-5" />}
              variant="light"
            >
              Ver todas
            </Button>
          </div>
          <div className="flex gap-4 w-full overflow-x-auto pb-1">
            {expensesByCategory.map(({ category, amount, icon }) => (
              <Card key={category} className="min-w-1/2">
                <CardBody>
                  {icon}
                  <p className="mt-4 font-semibold text-default-500">
                    {category}
                  </p>
                  <p className="font-semibold text-xl mt-2">
                    ${amount.toFixed(2)}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </article>
      </article>
      <article className="flex flex-col gap-4 flex-1 min-h-0">
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
          {recentTransactions.map(
            ({ reason, amount, date, category }, index) => (
              <Card key={index}>
                <CardBody className="flex justify-between">
                  <div>
                    <p className="font-semibold">{reason}</p>
                    <p className="text-sm text-default-500">
                      {date} · {category}
                    </p>
                  </div>
                  <p className="font-semibold">${amount.toFixed(2)}</p>
                </CardBody>
              </Card>
            ),
          )}
        </div>
      </article>
      <NewMovement />
    </main>
  );
};
