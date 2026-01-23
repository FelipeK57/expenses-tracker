import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  History,
  TrendingDown,
  TrendingUp,
  Filter,
} from "lucide-react";
import {
  expenseCategories,
  incomeCategories,
  type Transaction,
} from "@/app/schema";
import { getTransactionsByMonth } from "../services/transactions.service";

const PAGE_SIZE = 5;

export const Transactions = () => {
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tempTypeFilter, setTempTypeFilter] = useState<
    "all" | "income" | "expense"
  >("all");
  const [tempCategoryFilter, setTempCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  //   const [refreshData, setRefreshData] = useState<boolean>(false);
  const {
    isOpen: isFiltersOpen,
    onOpen: onOpenFiltersBase,
    onOpenChange: onFiltersChange,
  } = useDisclosure();

  const onOpenFilters = () => {
    setTempTypeFilter(typeFilter);
    setTempCategoryFilter(categoryFilter);
    onOpenFiltersBase();
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const monthlyTransactions = await getTransactionsByMonth(month, year);
        setTransactions(monthlyTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [month, year]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, categoryFilter, month, year]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "all" ? true : transaction.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all"
          ? true
          : transaction.category === categoryFilter;
      return matchesType && matchesCategory;
    });
  }, [transactions, typeFilter, categoryFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE),
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, page]);

  const monthLabel = useMemo(
    () =>
      new Date(year, month).toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      }),
    [month, year],
  );

  const categoriesForFilter = useMemo(() => {
    const categories =
      typeFilter === "income"
        ? incomeCategories
        : typeFilter === "expense"
          ? expenseCategories
          : [...incomeCategories, ...expenseCategories];

    const uniqueByKey = new Map(
      categories.map((category) => [category.key, category]),
    );
    return Array.from(uniqueByKey.values());
  }, [typeFilter]);

  const totals = useMemo(() => {
    const incomes = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    return {
      incomes,
      expenses,
      balance: incomes - expenses,
    };
  }, [transactions]);

  const findIconByCategory = (
    type: "income" | "expense",
    categoryKey: string,
  ) => {
    const categories = type === "income" ? incomeCategories : expenseCategories;
    const category = categories.find((cat) => cat.key === categoryKey);
    return category ? category.icon : null;
  };

  const findCategoryLabel = (categoryKey: string) => {
    const category = [...incomeCategories, ...expenseCategories].find(
      (cat) => cat.key === categoryKey,
    );
    return category ? category.label : categoryKey;
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const resetFilters = () => {
    setTempTypeFilter("all");
    setTempCategoryFilter("all");
  };

  const applyFilters = () => {
    setTypeFilter(tempTypeFilter);
    setCategoryFilter(tempCategoryFilter);
    onFiltersChange();
  };

  return (
    <main className="relative flex flex-col gap-4 p-4 h-full">
      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <p className="text font-semibold">Análisis de {monthLabel}</p>
          <div className="flex items-center justify-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="lg"
              onPress={handlePrevMonth}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="lg"
              onPress={handleNextMonth}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </header>

        <div className="py-2">
          <p className="text-sm text-center">Balance del mes</p>
          <div className="text-center font-bold text-4xl">
            {!loading ? (
              `$${totals.balance.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
              })}`
            ) : (
              <Skeleton className="w-32 h-10 mx-auto rounded-xl" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Card className="w-full shadow-none border-1 border-divider dark:border-content2">
            <CardBody>
              <div className="grid place-content-center size-10 bg-success-400/20 rounded-xl">
                <TrendingUp className="size-5 text-success" />
              </div>
              <p className="mt-2 font-semibold text-default-500">Ingresos</p>
              <div className="font-semibold text-xl mt-2">
                {!loading ? (
                  `$${totals.incomes.toLocaleString("es-ES", {
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
                  `$${totals.expenses.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}`
                ) : (
                  <Skeleton className="w-24 h-6 rounded-xl" />
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex items-center gap-2 text-sm text-default-500">
          <span>
            {typeFilter === "all"
              ? "Todos"
              : typeFilter === "income"
                ? "Ingresos"
                : "Gastos"}
          </span>
          <span className="text-default-400">·</span>
          <span>
            {categoryFilter === "all"
              ? "Todas las categorías"
              : findCategoryLabel(categoryFilter)}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Listado</h2>
          <p className="text-sm text-default-500">
            {filteredTransactions.length} registros · Pagina {page} de{" "}
            {totalPages}
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
          {!loading && paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
              <Card
                key={`${transaction.id}-${transaction.date}-${transaction.amount}`}
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
                      {new Date(transaction.date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : !loading && paginatedTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 mt-4">
              <History className="size-12 text-default" />
              <p className="text-center text-sm text-default-500">
                No hay transacciones para este mes con los filtros actuales.
              </p>
            </div>
          ) : (
            [...Array(4)].map((_, index) => (
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
            ))
          )}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="flat"
            isDisabled={page === 1}
            onPress={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Anterior
          </Button>
          <Button
            variant="flat"
            isDisabled={
              page === totalPages || filteredTransactions.length === 0
            }
            onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Siguiente
          </Button>
        </div>

        <Modal
          backdrop="blur"
          disableAnimation={true}
          isOpen={isFiltersOpen}
          onOpenChange={onFiltersChange}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Filtros</ModalHeader>
            <ModalBody className="gap-3">
              <Select
                label="Tipo"
                selectedKeys={[tempTypeFilter]}
                size="lg"
                onChange={(event) =>
                  setTempTypeFilter(event.target.value as typeof tempTypeFilter)
                }
              >
                <SelectItem key="all">Todos</SelectItem>
                <SelectItem key="income">Ingresos</SelectItem>
                <SelectItem key="expense">Gastos</SelectItem>
              </Select>
              <Select
                label="Categoria"
                selectedKeys={[tempCategoryFilter]}
                size="lg"
                onChange={(event) => setTempCategoryFilter(event.target.value)}
              >
                {[{ key: "all", label: "Todas" }, ...categoriesForFilter].map(
                  (category) => (
                    <SelectItem key={category.key}>{category.label}</SelectItem>
                  ),
                )}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button size="lg" variant="light" onPress={resetFilters}>
                Limpiar
              </Button>
              <Button size="lg" color="primary" onPress={applyFilters}>
                Aplicar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </section>
      <div className="absolute bottom-4 right-4">
        <Button
          isIconOnly
          className="size-16"
          color="primary"
          size="lg"
          onPress={onOpenFilters}
        >
          <Filter className="size-8" />
        </Button>
      </div>
    </main>
  );
};
