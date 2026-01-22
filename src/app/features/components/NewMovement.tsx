import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Form,
  Textarea,
  NumberInput,
} from "@heroui/react";
import { Plus } from "lucide-react";

export const NewMovement = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));

    const dataFormatted = {
      amount: parseFloat(formData.amount as string),
      reason: formData.reason as string,
    };

    console.log("Datos formateados:", dataFormatted);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        size="lg"
        color="primary"
        variant="shadow"
        className="absolute bottom-4 right-4 size-16 rounded-full"
      >
        <Plus className="size-8" />
      </Button>
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Form onSubmit={handleSubmit}>
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  Nuevo movimiento
                </DrawerHeader>
                <DrawerBody>
                  <NumberInput
                    name="amount"
                    aria-label="Monto"
                    placeholder="Monto"
                    minValue={1}
                    isRequired
                  />
                  <Textarea
                    name="reason"
                    aria-label="Razón"
                    placeholder="Razón (opcional)"
                  />
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" type="submit">
                    Crear
                  </Button>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Form>
      </Drawer>
    </>
  );
};
