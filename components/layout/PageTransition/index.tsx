"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  // scroll to top on route change
  useEffect(() => {
    if (prevPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      prevPath.current = pathname;
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
