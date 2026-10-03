"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

const preloadImages = [
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85",
];

const kitchenNotes = ["something delicious", "a seat at the table", "your next favorite"];

const subscribeToIntro = () => () => undefined;
const hasSeenIntro = () => window.sessionStorage.getItem("tasty-intro-seen") === "true";
const hasNotSeenIntro = () => false;

function preloadImage(source: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = source;
    if (image.complete) resolve();
  });
}

export function IntroLoader() {
  const hasSeen = useSyncExternalStore(subscribeToIntro, hasSeenIntro, hasNotSeenIntro);
  const [progress, setProgress] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (hasSeen) return;
    let isActive = true;
    let finishTimer: number | undefined;
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(current + (reducedMotion ? 8 : 2), 92));
    }, reducedMotion ? 90 : 55);
    const noteTimer = window.setInterval(() => {
      setNoteIndex((current) => (current + 1) % kitchenNotes.length);
    }, 620);
    let preloadTimeout: number | undefined;
    const boundedPreload = new Promise<void>((resolve) => {
      preloadTimeout = window.setTimeout(resolve, reducedMotion ? 900 : 3400);
    });
    const pageAssets = Promise.all([
      ...preloadImages.map(preloadImage),
      document.fonts.ready.then(() => undefined),
    ]).then(() => undefined);

    // Image failures or a slow connection must not leave the loader on screen indefinitely.
    void Promise.race([pageAssets, boundedPreload]).then(() => {
      if (!isActive) return;
      if (preloadTimeout) window.clearTimeout(preloadTimeout);
      setProgress(100);
      finishTimer = window.setTimeout(() => {
        window.sessionStorage.setItem("tasty-intro-seen", "true");
        setFinished(true);
      }, reducedMotion ? 80 : 480);
    });

    return () => {
      isActive = false;
      window.clearInterval(progressTimer);
      window.clearInterval(noteTimer);
      if (preloadTimeout) window.clearTimeout(preloadTimeout);
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, [hasSeen, reducedMotion]);

  return (
    <AnimatePresence>
      {!hasSeen && !finished && (
        <motion.div
          key="intro-loader"
          className="fixed inset-0 z-[60] flex flex-col justify-between bg-[#211d18] px-6 py-7 text-[#f7f0e5] sm:px-10 sm:py-9"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          exit={
            hasSeen
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  clipPath: "inset(0 0 100% 0)",
                  transition: { duration: reducedMotion ? 0 : 0.9, ease: "easeInOut" },
                }
          }
          role="status"
          aria-label={`Loading Tasty, ${progress}%`}
        >
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">
            <span>Recipes worth sharing</span>
            <span>Est. around the table</span>
          </div>

          <div className="mx-auto flex w-full max-w-[420px] flex-col items-center text-center">
            <svg viewBox="0 0 72 72" className="mb-7 size-[68px] text-primary" aria-hidden="true">
              <motion.path
                d="M23 13v19m8-19v19m8-19v19c0 8-4 12-9 14v13m19-46v46m0-46c8 8 9 17 0 25"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reducedMotion ? 0 : 1.3, ease: "easeInOut" }}
              />
              <motion.circle
                cx="36"
                cy="36"
                r="32"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".25"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1, rotate: -90 }}
                transition={{ duration: reducedMotion ? 0 : 1.1, delay: 0.2 }}
              />
            </svg>
            <p className="font-heading text-5xl leading-none sm:text-6xl">Tasty</p>
            <div className="mt-8 h-7 overflow-hidden text-sm text-white/60" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={noteIndex}
                  className="block"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: reducedMotion ? 0 : 0.28 }}
                >
                  {kitchenNotes[noteIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[420px]">
            <div className="mb-3 flex items-end justify-between text-xs text-white/55">
              <span>Setting the table</span>
              <span className="font-mono tabular-nums text-white">{progress}%</span>
            </div>
            <div
              className="h-px w-full overflow-hidden bg-white/15"
              role="progressbar"
              aria-label="Loading experience"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}