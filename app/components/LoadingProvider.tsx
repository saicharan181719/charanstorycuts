"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import GlobalLoader from "./GlobalLoader";

type LoadingContextType = {
  show: () => void;
  hide: () => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // 🔥 AUTO loader on route change
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // smooth delay (tweak if needed)

    return () => clearTimeout(timer);
  }, [pathname]);

  const show = () => setLoading(true);
  const hide = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ show, hide }}>
      {loading && <GlobalLoader />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be inside LoadingProvider");
  return ctx;
}
