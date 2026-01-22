import { QueryProvider } from "./providers/query-provider";
import { RouterProvider } from "./router/router";
import { HeroUIProvider } from "@heroui/react";

export const App = () => {
  return (
    <QueryProvider>
      <HeroUIProvider>
        <RouterProvider />
      </HeroUIProvider>
    </QueryProvider>
  );
};
