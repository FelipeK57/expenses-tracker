import { Outlet } from "react-router";
// import { Navbar } from "./Navbar";

export const MainLayout = () => {
  return (
    <main className="h-svh flex flex-col">
      <section className="flex-1 overflow-y-auto">
        <Outlet />
      </section>
      {/* <Navbar /> */}
    </main>
  );
};
