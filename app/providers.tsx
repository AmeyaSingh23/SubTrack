"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}