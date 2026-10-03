"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribeToMount = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const isMounted = useSyncExternalStore(subscribeToMount, getClientSnapshot, getServerSnapshot);
  const { resolvedTheme, setTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {isMounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={reducedMotion ? false : { opacity: 0, rotate: -70, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, rotate: 70, scale: 0.7 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="grid place-items-center"
            aria-hidden="true"
          >
            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </motion.span>
        </AnimatePresence>
      ) : (
        <Sun className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}