"use client";

import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Printer,
  RefreshCw,
  X,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/ui/recipe-image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ShareButton } from "@/components/ui/share-button";
import { InstallButton } from "@/components/ui/install-button";
import type { Recipe, RecipeIngredient } from "@/types/recipe";

function parseQuantity(amount: string) {
  const quantityMatch = amount.trim().match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)(.*)$/);
  if (!quantityMatch) return null;

  const quantityText = quantityMatch[1].replace(",", ".");
  const quantityParts = quantityText.split(/\s+/);
  const quantity = quantityParts.length === 2
    ? Number(quantityParts[0]) + fractionValue(quantityParts[1])
    : fractionValue(quantityParts[0]);
  if (!Number.isFinite(quantity)) return null;

  return { quantity, remainder: quantityMatch[2].trim() };
}

function fractionValue(value: string) {
  if (!value.includes("/")) return Number(value);
  const [numerator, denominator] = value.split("/").map(Number);
  return denominator ? numerator / denominator : Number.NaN;
}

function formatIngredient(ingredient: RecipeIngredient, baseServings: number, servings: number) {
  const parsed = parseQuantity(ingredient.amount);
  if (!parsed) return [ingredient.amount, ingredient.unit].filter(Boolean).join(" ");

  const scaledAmount = parsed.quantity * (servings / baseServings);
  const roundedAmount = Number(scaledAmount.toFixed(1)).toString();
  const unit = [parsed.remainder, ingredient.unit].filter(Boolean).join(" ");
  return [roundedAmount, unit].filter(Boolean).join(" ");
}

function RecipeActions({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-3 text-xs text-foreground/70 transition-colors hover:border-primary hover:text-primary"
      >
        <Printer className="size-4" aria-hidden="true" />
        Chop etish
      </button>
      <ShareButton
        title={recipe.title}
        text={recipe.description}
        path={`/recipes/${recipe.slug}`}
      />
    </div>
  );
}

function CookingMode({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const reducedMotion = useReducedMotion();
  const currentStep = recipe.steps[activeStep];
  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
  const seconds = (timerSeconds % 60).toString().padStart(2, "0");

  useEffect(() => {
    if (!timerRunning || timerSeconds === 0) return;
    const timer = window.setInterval(() => {
      setTimerSeconds((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning, timerSeconds]);

  function startOrPauseTimer() {
    if (timerSeconds === 0) setTimerSeconds(timerMinutes * 60);
    setTimerRunning((running) => !running || timerSeconds === 0);
  }

  function resetTimer() {
    setTimerRunning(false);
    setTimerSeconds(timerMinutes * 60);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col bg-background px-5 py-5 text-foreground sm:px-10 sm:py-8"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.2 } }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cooking-mode-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
        if (event.key === "ArrowLeft") setActiveStep((step) => Math.max(0, step - 1));
        if (event.key === "ArrowRight") setActiveStep((step) => Math.min(recipe.steps.length - 1, step + 1));
      }}
    >
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Pishirish rejimi</p>
          <h2 id="cooking-mode-title" className="mt-1 font-heading text-xl sm:text-2xl">{recipe.title}</h2>
        </div>
        <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border border-border hover:border-primary" aria-label="Pishirish rejimini yopish">
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-[880px] flex-1 flex-col justify-center py-10">
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Qadam {activeStep + 1} / {recipe.steps.length}</span>
          <span>{recipe.cookingTime} daqiqa</span>
        </div>
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${((activeStep + 1) / recipe.steps.length) * 100}%` }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeStep}
            className="font-heading text-3xl leading-snug sm:text-5xl sm:leading-[1.2]"
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
          >
            {currentStep}
          </motion.p>
        </AnimatePresence>

        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-md border border-border bg-card/70 p-4 sm:p-5">
          <div className="min-w-[118px] flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Taymer</p>
            <p className="mt-1 font-mono text-2xl tabular-nums" role="timer" aria-live="off">{minutes}:{seconds}</p>
          </div>
          <label className="sr-only" htmlFor="cooking-timer-length">Taymer davomiyligi</label>
          <select
            id="cooking-timer-length"
            value={timerMinutes}
            disabled={timerRunning}
            onChange={(event) => {
              const nextMinutes = Number(event.target.value);
              setTimerMinutes(nextMinutes);
              setTimerSeconds(nextMinutes * 60);
            }}
            className="h-11 rounded-md border border-border bg-background px-3 text-xs"
          >
            {[1, 3, 5, 10, 15, 20].map((duration) => <option key={duration} value={duration}>{duration} daq.</option>)}
          </select>
          <button type="button" onClick={startOrPauseTimer} className="h-11 min-w-24 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground">
            {timerSeconds === 0 ? "Qayta boshlash" : timerRunning ? "Pauza" : "Boshlash"}
          </button>
          <button type="button" onClick={resetTimer} className="grid size-11 place-items-center rounded-md border border-border" aria-label="Taymerni tiklash">
            <RefreshCw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-[880px] items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm disabled:opacity-35"
        >
          <ChevronLeft className="size-4" aria-hidden="true" /> Oldingi
        </button>
        <button
          type="button"
          onClick={() => activeStep === recipe.steps.length - 1 ? onClose() : setActiveStep((step) => step + 1)}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          {activeStep === recipe.steps.length - 1 ? "Tugatish" : "Keyingi qadam"}
          {activeStep < recipe.steps.length - 1 && <ChevronRight className="size-4" aria-hidden="true" />}
          {activeStep === recipe.steps.length - 1 && <Check className="size-4" aria-hidden="true" />}
        </button>
      </footer>
    </motion.div>
  );
}

export function RecipeDetail({ recipe, relatedRecipes }: { recipe: Recipe; relatedRecipes: Recipe[] }) {
  const [servings, setServings] = useState(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isCookingMode, setIsCookingMode] = useState(false);

  function toggleIngredient(index: number) {
    setCheckedIngredients((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <>
      <main className="mx-auto min-h-screen max-w-[1480px] px-5 pb-24 sm:px-9 md:px-14">
        <header className="flex h-[76px] items-center justify-between border-b border-border/70 print:hidden">
          <Link href="/recipes" className="inline-flex items-center gap-2 text-xs text-foreground/65 transition-colors hover:text-primary">
            <ArrowLeft className="size-4" aria-hidden="true" /> Retseptlarga qaytish
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[12px] font-semibold uppercase tracking-[0.2em]">Tasty</Link>
            <InstallButton compactOnMobile />
            <ThemeToggle />
          </div>
        </header>

        <article>
          <section className="grid gap-8 py-9 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:py-14">
            <div className="relative aspect-[1.13] overflow-hidden rounded-md border border-border bg-card">
              <RecipeImage src={recipe.image} title={recipe.title} className="h-full w-full" priority sizes="(max-width: 768px) 100vw, 55vw" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{recipe.category}</p>
              <h1 className="mt-4 font-heading text-5xl leading-[1.03] text-foreground sm:text-6xl">{recipe.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{recipe.titleEn}</p>
              <p className="mt-6 max-w-[580px] text-sm leading-7 text-foreground/65">{recipe.description}</p>

              <dl className="mt-8 grid grid-cols-3 border-y border-border/80 py-5">
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Vaqt</dt>
                  <dd className="mt-2 text-sm font-medium">{recipe.cookingTime} daq.</dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Qiyinlik</dt>
                  <dd className="mt-2 text-sm font-medium">{recipe.difficulty}</dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Porsiya</dt>
                  <dd className="mt-2 text-sm font-medium">{servings} kishi</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
                <div className="inline-flex items-center gap-3">
                  <span className="text-xs text-foreground/55">Porsiyani sozlash</span>
                  <button type="button" onClick={() => setServings((current) => Math.max(1, current - 1))} disabled={servings <= 1} className="grid size-11 place-items-center rounded-full border border-border disabled:opacity-40" aria-label="Porsiyani kamaytirish">
                    <Minus className="size-3.5" aria-hidden="true" />
                  </button>
                  <span className="min-w-5 text-center text-sm tabular-nums">{servings}</span>
                  <button type="button" onClick={() => setServings((current) => Math.min(24, current + 1))} disabled={servings >= 24} className="grid size-11 place-items-center rounded-full border border-border disabled:opacity-40" aria-label="Porsiyani ko'paytirish">
                    <Plus className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <RecipeActions recipe={recipe} />
              </div>
              <button type="button" onClick={() => setIsCookingMode(true)} className="mt-7 inline-flex h-12 items-center gap-3 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 print:hidden">
                Pishirish rejimini boshlash <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section className="grid gap-12 border-t border-border/80 py-12 md:grid-cols-[0.75fr_1.25fr] md:gap-20 md:py-16">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Tayyorlov</p>
              <h2 className="mt-3 font-heading text-4xl">Masalliqlar</h2>
              <p className="mt-3 text-sm text-muted-foreground">{servings} kishilik taom uchun</p>
              <ul className="mt-8 divide-y divide-border/70">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={`${ingredient.name}-${index}`} className="py-3">
                    <label className={`flex cursor-pointer items-start gap-3 text-sm ${checkedIngredients.has(index) ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      <input
                        type="checkbox"
                        checked={checkedIngredients.has(index)}
                        onChange={() => toggleIngredient(index)}
                        className="mt-0.5 size-4 accent-primary"
                      />
                      <span className="flex-1">{ingredient.name}</span>
                      <span className="shrink-0 text-right text-foreground/55">{formatIngredient(ingredient, recipe.servings, servings)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Oshxona daftaridan</p>
                  <h2 className="mt-3 font-heading text-4xl">Tayyorlash</h2>
                </div>
                <button type="button" onClick={() => setIsCookingMode(true)} className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-3 text-xs text-foreground/70 transition-colors hover:border-primary hover:text-primary print:hidden">
                  Pishirish rejimi <ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>
              <ol className="mt-8 space-y-7">
                {recipe.steps.map((step, index) => (
                  <li key={`${index}-${step.slice(0, 24)}`} className="grid grid-cols-[36px_1fr] gap-4">
                    <span className="grid size-9 place-items-center rounded-full border border-primary/40 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <p className="pt-1 text-sm leading-7 text-foreground/75">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {recipe.tips.length > 0 && (
            <aside className="border-y border-primary/20 bg-primary/[0.06] px-5 py-7 sm:px-8 sm:py-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Oshpaz maslahati</p>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {recipe.tips.map((tip) => <li key={tip} className="text-sm leading-6 text-foreground/75">{tip}</li>)}
              </ul>
            </aside>
          )}

          {relatedRecipes.length > 0 && (
            <section className="pt-14">
              <div className="mb-7 flex items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Keyingi ilhom</p>
                  <h2 className="mt-3 font-heading text-4xl">Yana tatib ko&apos;ring</h2>
                </div>
                <Link href="/recipes" className="text-xs text-foreground/55 transition-colors hover:text-primary">Barcha retseptlar</Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedRecipes.map((relatedRecipe) => <RecipeCard key={relatedRecipe.id} recipe={relatedRecipe} />)}
              </div>
            </section>
          )}
        </article>
      </main>

      <AnimatePresence>
        {isCookingMode && <CookingMode recipe={recipe} onClose={() => setIsCookingMode(false)} />}
      </AnimatePresence>
    </>
  );
}