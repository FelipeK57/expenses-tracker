import { expenseCategories } from "@/app/schema";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Form,
  //   Textarea,
  NumberInput,
  //   DatePicker,
} from "@heroui/react";
import { Minus } from "lucide-react";
// import { parseDate } from "@internationalized/date";
import { useEffect, useRef, useState } from "react";

export const NewExpense = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //   const today = new Date();
  const [selectedCategory, setSelectedCategory] = useState("food");
  const amountInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      amountInputRef.current?.focus();
    }
  }, [isOpen]);

  const categories = expenseCategories;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));

    const dataFormatted = {
      amount: parseFloat(formData.amount as string),
      category: formData.category as string,
      date: new Date().toISOString().split("T")[0], // Default to today
      notes: "", // Placeholder for notes
    };

    console.log("New movement data:", dataFormatted);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        size="lg"
        color="danger"
        className="size-16"
      >
        <Minus className="size-8" />
      </Button>
      <Modal
        backdrop="blur"
        disableAnimation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Form onSubmit={handleSubmit}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Nuevo gasto
            </ModalHeader>
            <ModalBody>
              <NumberInput
                ref={amountInputRef}
                name="amount"
                aria-label="Monto"
                placeholder="Monto"
                minValue={1}
                size="lg"
                isRequired
              />
              <input type="hidden" name="category" value={selectedCategory} />
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    size="lg"
                    variant={selectedCategory === key ? "flat" : "flat"}
                    color={selectedCategory === key ? "danger" : "default"}
                    className="min-w-fit justify-start gap-3"
                    onPress={() => setSelectedCategory(key)}
                    aria-pressed={selectedCategory === key}
                    aria-label={`Categoría ${label}`}
                    startContent={<Icon className="size-5" />}
                  >
                    <span className="truncate">{label}</span>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-center text-default">
                La fecha y las notas se pueden agregar después de crear el
                movimiento.
              </p>
              {/* <DatePicker
                    name="date"
                    aria-label="Fecha"
                    size="lg"
                    defaultValue={parseDate(today.toISOString().split("T")[0])}
                  />
                  <Textarea
                    name="notes"
                    aria-label="Notas"
                    size="lg"
                    placeholder="Notas"
                  /> */}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" size="lg" type="submit" className="w-full">
                Crear
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
};
