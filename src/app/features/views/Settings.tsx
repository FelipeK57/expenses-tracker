import { useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { clearAllTransactions } from "../services/transactions.service";
import { useNavigate } from "react-router";

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClearData = async () => {
    const confirm = window.confirm(
      "Esta acción borrará todos los ingresos y gastos guardados en el dispositivo. ¿Continuar?",
    );
    if (!confirm) return;

    setLoading(true);
    try {
      await clearAllTransactions();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 flex flex-col gap-4 h-full">
      <header className="flex items-center justify-between">
        <div>
          <p className="text font-semibold">Preferencias</p>
          <p className="text-sm text-default-500">Controla los datos locales de Balance.</p>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <Card className="shadow-none border-1 border-divider dark:border-content2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="font-semibold">Borrar todos los datos</p>
              <p className="text-sm text-default-500">
                Elimina los registros almacenados en este dispositivo. No se puede deshacer.
              </p>
            </div>
            <Trash2 className="size-5 text-danger" />
          </CardHeader>
          <CardBody>
            <Button
              color="danger"
              variant="flat"
              onPress={handleClearData}
              isLoading={loading}
              className="w-full"
            >
              Borrar ingresos y gastos
            </Button>
          </CardBody>
        </Card>
      </section>
    </main>
  );
};
