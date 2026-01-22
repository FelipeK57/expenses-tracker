import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Form onSubmit={handleSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Nuevo movimiento
                </ModalHeader>
                <ModalBody>
                  <NumberInput
                    name="amount"
                    aria-label="Monto"
                    placeholder="Monto"
                    minValue={1}
                    size="lg"
                    isRequired
                  />
                  <Textarea
                    name="reason"
                    aria-label="Razón"
                    size="lg"
                    placeholder="Razón (opcional)"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    size="lg"
                    variant="light"
                    onPress={onClose}
                  >
                    Cerrar
                  </Button>
                  <Button color="primary" size="lg" type="submit">
                    Crear
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
};
