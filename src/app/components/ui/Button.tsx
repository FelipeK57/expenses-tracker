export const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="px-4 py-2 w-fit mx-auto rounded-2xl bg-neutral-950 text-white hover:bg-neutral-900 transition-colors cursor-pointer">
      {children}
    </button>
  );
};
