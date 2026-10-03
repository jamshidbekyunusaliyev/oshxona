"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RecipeHorizontalGallery } from "@/components/sections/uzbek-recipe-gallery";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { InstallButton } from "@/components/ui/install-button";
import { uzbekDesserts } from "@/lib/data/uzbek-recipes";

const heroImage =
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1600&q=85";

const collageImages = [
  {
    source: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    alt: "A bright bowl of greens and seasonal vegetables",
    className: "w-[230px] sm:w-[300px]",
  },
  {
    source: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85",
    alt: "Fresh ingredients arranged across a table",
    className: "w-[190px] sm:w-[240px]",
  },
  {
    source: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    alt: "A colorful homemade salad ready to share",
    className: "w-[230px] sm:w-[300px]",
  },
  {
    source: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
    alt: "A rustic plate of pasta with fresh herbs",
    className: "w-[190px] sm:w-[240px]",
  },
  {
    source: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85",
    alt: "Fresh ingredients and colorful produce ready to cook",
    className: "w-[230px] sm:w-[300px]",
  },
];

const headlines = ["Discover.", "Cook.", "Share."];
const stats = [
  { value: 5280, suffix: "+", label: "recipes to explore" },
  { value: 18400, suffix: "+", label: "curious home cooks" },
  { value: 64, suffix: "", label: "countries at the table" },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(countRef, { once: true, amount: 0.7 });
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    const startTime = performance.now();
    let frameId = 0;
    const updateCount = (time: number) => {
      const progress = Math.min((time - startTime) / 1700, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * easedProgress));
      if (progress < 1) frameId = window.requestAnimationFrame(updateCount);
    };

    frameId = window.requestAnimationFrame(updateCount);
    return () => window.cancelAnimationFrame(frameId);
  }, [isInView, reducedMotion, value]);

  const displayedCount = isInView && reducedMotion ? value : count;

  return (
    <span ref={countRef} className="font-heading text-3xl leading-none tabular-nums sm:text-4xl">
      {displayedCount.toLocaleString("en-US")}{suffix}
    </span>
  );
}

export function IntroTeaser() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 90, damping: 22, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 22, mass: 0.5 });
  // A small spring offset gives the hero image depth without making pointer tracking feel jumpy.
  const imageX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const imageY = useTransform(springY, [-0.5, 0.5], [-8, 8]);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const headlineTimer = window.setInterval(() => {
      setHeadlineIndex((current) => (current + 1) % headlines.length);
    }, 2600);
    return () => window.clearInterval(headlineTimer);
  }, [reducedMotion]);

  function moveHeroArt(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetHeroArt() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <main className="overflow-x-clip">
      <header className="relative z-10 mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-9 lg:px-14">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Tasty home">
          <span className="grid size-8 place-items-center rounded-full border border-primary/60 font-heading text-lg text-primary transition-transform group-hover:rotate-12">
            t
          </span>
          <span className="text-[13px] font-semibold uppercase tracking-[0.2em]">Tasty</span>
        </a>
        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="#teaser"
            className="hidden items-center gap-2 text-xs font-medium text-foreground/70 transition-colors hover:text-primary sm:inline-flex sm:text-sm"
          >
            A table for everyone
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </a>
          <InstallButton compactOnMobile />
          <ThemeToggle />
        </div>
      </header>

      <section
        id="top"
        className="relative mx-auto grid min-h-[calc(100svh-76px)] max-w-[1480px] items-center gap-10 px-5 pb-14 pt-6 sm:px-9 md:grid-cols-[1fr_0.9fr] md:gap-8 md:px-14 md:py-12"
        onPointerMove={moveHeroArt}
        onPointerLeave={resetHeroArt}
      >
        <div className="relative z-10 order-1 max-w-[690px] md:py-10">
          <motion.p
            className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs"
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.55, delay: 0.12 }}
          >
            <span className="h-px w-8 bg-primary" />
            Made for the love of good food
          </motion.p>
          <motion.h1
            className="max-w-[680px] font-heading text-[clamp(3.6rem,7.2vw,7rem)] leading-[0.98] text-foreground"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: 0.22, ease: "easeOut" }}
          >
            There&apos;s always room <span className="text-primary">at the table.</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-[430px] text-sm leading-7 text-foreground/65 sm:text-base"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.7, delay: 0.38 }}
          >
            Recipes from real kitchens. Flavors that bring people closer. Find the dish you&apos;ll
            make your own.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.65, delay: 0.52 }}
          >
            <a
              href="#teaser"
              className="group inline-flex min-h-12 items-center gap-3 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Start cooking
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
            <span className="text-xs text-muted-foreground">A little inspiration goes a long way</span>
          </motion.div>
        </div>

        <div className="relative order-2 mx-auto w-full max-w-[590px] md:my-auto md:ml-auto">
          <motion.div
            className="relative aspect-[0.94] overflow-hidden rounded-t-[48%] rounded-b-[8px] border border-white/10 bg-secondary shadow-[0_34px_100px_-44px_rgba(0,0,0,.8)]"
            style={{ x: imageX, y: imageY }}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.05, delay: 0.2, ease: "easeOut" }}
          >
            <Image
              src={heroImage}
              alt="A beautifully plated meal ready to share around the table"
              fill
              priority
              sizes="(max-width: 767px) 92vw, 48vw"
              className="object-cover brightness-[0.83] saturate-[0.82]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130f]/75 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60">From today&apos;s kitchen</p>
                <p className="mt-1 font-heading text-2xl sm:text-3xl">A generous first bite</p>
              </div>
              <span className="mb-1 font-mono text-xs text-white/70">01 / 03</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -left-4 bottom-[17%] hidden w-[140px] overflow-hidden rounded-lg border border-white/20 bg-background p-1.5 shadow-xl sm:block lg:-left-14 lg:w-[164px]"
            animate={reducedMotion ? undefined : { y: [0, -9, 0], rotate: [-3, -1, -3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative aspect-[1.28] overflow-hidden rounded-md">
              <Image src={collageImages[0].source} alt="" fill sizes="164px" className="object-cover" />
            </div>
            <p className="px-1 pb-0.5 pt-2 text-[10px] text-foreground/70">Fresh from the garden</p>
          </motion.div>

          <motion.div
            className="absolute -right-2 top-[15%] hidden size-[82px] overflow-hidden rounded-full border-[5px] border-background shadow-xl sm:block lg:-right-8 lg:size-[104px]"
            animate={reducedMotion ? undefined : { y: [0, 8, 0], rotate: [0, 7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={collageImages[3].source} alt="" fill sizes="104px" className="object-cover" />
          </motion.div>
        </div>

        <a
          href="#teaser"
          className="absolute bottom-5 left-5 hidden items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:flex"
        >
          Scroll for a taste <span className="h-px w-8 bg-foreground/30" />
        </a>
      </section>

      <section id="teaser" className="relative border-t border-border/70 bg-card pb-16 pt-16 sm:pb-20 sm:pt-20">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-5 sm:px-9 md:grid-cols-[1fr_0.7fr] md:items-end md:px-14">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
              A world of recipes, just around the corner
            </p>
            <h2 className="sr-only">Discover. Cook. Share.</h2>
            <div className="h-[clamp(4rem,9vw,7.3rem)] overflow-hidden font-heading text-[clamp(3.3rem,8vw,6.8rem)] leading-none text-foreground" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.span
                  key={headlineIndex}
                  className="block"
                  initial={reducedMotion ? false : { opacity: 0, y: 45, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -38, rotateX: 18 }}
                  transition={{ duration: reducedMotion ? 0 : 0.48, ease: "easeOut" }}
                >
                  {headlines[headlineIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <p className="max-w-[390px] pb-2 text-sm leading-7 text-foreground/60 md:justify-self-end">
            Pull up a chair. There&apos;s always another story, a new flavor, and one more plate to
            pass around.
          </p>
        </div>

        <div className="-mx-5 mt-10 sm:-mx-9 md:-mx-14 sm:mt-14">
          <RecipeHorizontalGallery />
          <RecipeHorizontalGallery
            recipes={uzbekDesserts}
            eyebrow="O'zbek shirinliklari"
            heading="Dasturxonga shirin yakun."
            regionName="O'zbek shirinliklari retseptlari"
          />
        </div>

        <div className="mx-auto grid max-w-[1480px] grid-cols-1 divide-y divide-white/10 px-5 pt-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-9 sm:pt-12 md:px-14">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between py-5 sm:flex-col sm:items-start sm:gap-3 sm:px-7 sm:py-2 first:sm:pl-0 last:sm:pr-0">
              <CountUp value={stat.value} suffix={stat.suffix} />
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[1480px] px-5 text-[10px] text-muted-foreground sm:px-9 md:px-14">
          A growing table, one recipe at a time.
        </p>
      </section>
    </main>
  );
}