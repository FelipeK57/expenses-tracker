import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
  DatePicker,
} from "@heroui/react";
import type { Transaction } from "@/app/schema";
import { expenseCategories, incomeCategories } from "@/app/schema";
import {
  deleteTransaction,
  updateTransaction,
} from "../services/transactions.service";
import { parseDate } from "@internationalized/date";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: () => void;
  onUpdate: () => void;
  findIconByCategory: (type: "income" | "expense", categoryKey: string) => any;
}

export const TransactionCard = ({
  transaction,
  onDelete,
  onUpdate,
  findIconByCategory,
}: TransactionCardProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editAmount, setEditAmount] = useState(transaction.amount.toString());
  const [editDate, setEditDate] = useState(transaction.date);
  const [editCategory, setEditCategory] = useState(transaction.category);
  const [editNote, setEditNote] = useState(transaction.note || "");
  const [loading, setLoading] = useState(false);

  const categories =
    transaction.type === "income" ? incomeCategories : expenseCategories;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateTransaction(
        parseInt(transaction.id as string),
        parseFloat(editAmount),
        editDate,
        editCategory,
        editNote,
      );
      onUpdate();
      onOpenChange();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("¿Eliminar esta transacción?");
    if (!confirm) return;

    setLoading(true);
    try {
      await deleteTransaction(parseInt(transaction.id as string));
      onDelete();
      onOpenChange();
    } finally {
      setLoading(false);
    }
  };

  const Icon = findIconByCategory(transaction.type, transaction.category);

  return (
    <>
      <Card
        isPressable
        onPress={onOpen}
        className="shadow-none border-1 border-divider dark:border-content2 w-full"
      >
        <CardBody className="flex flex-row gap-4 items-center">
          <div
            className={`grid place-content-center size-12 ${
              transaction.type === "income"
                ? "bg-success-400/20 text-success"
                : "bg-danger-400/20 text-danger"
            } rounded-xl`}
          >
            {Icon ? <Icon className="size-6" /> : null}
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

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {transaction.type === "income" ? "Ingreso" : "Gasto"}
          </ModalHeader>
          <ModalBody className="gap-3">
            <NumberInput
              label="Monto"
              minValue={1}
              value={parseFloat(editAmount) || 0}
              onValueChange={(value) => setEditAmount(value.toString())}
              size="lg"
            />
            <DatePicker
              label="Fecha"
              value={parseDate(editDate)}
              size="lg"
              onChange={(date) => date && setEditDate(date.toString())}
            />
            <Select
              label="Categoría"
              selectedKeys={[editCategory]}
              size="lg"
              onChange={(e) => setEditCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.key}>{cat.label}</SelectItem>
              ))}
            </Select>
            <Textarea
              label="Nota (opcional)"
              placeholder="Descripción adicional"
              value={editNote}
              size="lg"
              onValueChange={setEditNote}
              minRows={2}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex gap-2">
              <Button
                variant="light"
                onPress={handleDelete}
                isLoading={loading}
              >
                Eliminar
              </Button>
              <Button
                color="primary"
                onPress={handleUpdate}
                isLoading={loading}
              >
                Guardar
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
