"use client";

import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { RecipeImage } from "@/components/ui/recipe-image";
import { uzbekRecipes } from "@/lib/data/uzbek-recipes";
import type { Recipe } from "@/types/recipe";

interface RecipeGalleryProps {
  recipes?: Recipe[];
  eyebrow?: string;
  heading?: string;
  regionName?: string;
}

export function RecipeHorizontalGallery({
  recipes = uzbekRecipes,
  eyebrow = "O'zbek dasturxonidan",
  heading = "Har bir taomning o'z hikoyasi bor.",
  regionName = "O'zbek taomlari retseptlari",
}: RecipeGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  function updateProgress(progress: number) {
    if (!progressRef.current || !progressTrackRef.current) return;
    const normalizedProgress = Math.max(0, Math.min(1, progress));
    progressRef.current.style.transform = `scaleX(${normalizedProgress})`;
    progressTrackRef.current.setAttribute("aria-valuenow", `${Math.round(normalizedProgress * 100)}`);
  }

  useEffect(() => {
    if (reducedMotion) return;
    let isCancelled = false;
    let revertMedia: (() => void) | undefined;

    async function addPinnedScroll() {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (isCancelled) return;

      const gsap = gsapModule.gsap;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add("(min-width: 768px)", () => {
        const section = sectionRef.current;
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!section || !viewport || !track) return;

        gsap.to(track, {
          x: () => -Math.max(0, track.scrollWidth - viewport.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(1, track.scrollWidth - viewport.clientWidth)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (trigger) => updateProgress(trigger.progress),
          },
        });
      });

      revertMedia = () => media.revert();
      ScrollTrigger.refresh();
    }

    void addPinnedScroll();
    return () => {
      isCancelled = true;
      revertMedia?.();
    };
  }, [reducedMotion]);

  function updateSwipeProgress() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    updateProgress(maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0);
  }

  return (
    <section ref={sectionRef} className="relative bg-background text-foreground">
      <div className="mx-auto flex min-h-[100svh] max-w-[1480px] flex-col justify-center px-5 py-14 sm:px-9 md:px-14 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
              {eyebrow}
            </p>
            <h2 className="mt-3 max-w-[680px] font-heading text-4xl leading-[1.06] sm:text-5xl">
              {heading}
            </h2>
          </div>
          <span className="hidden items-center gap-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:inline-flex">
            Pastga aylantiring <ArrowDownRight className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div
          ref={viewportRef}
          className="gallery-viewport -mx-5 overflow-x-auto px-5 sm:-mx-9 sm:px-9 md:mx-0 md:overflow-hidden md:px-0"
          onScroll={updateSwipeProgress}
          role="region"
          aria-label={regionName}
          tabIndex={0}
        >
          <div ref={trackRef} className="gallery-track flex w-max gap-3 sm:gap-5">
            {recipes.map((recipe, index) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="group block w-[82vw] max-w-[420px] shrink-0 snap-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:w-[31vw] md:max-w-none lg:w-[25vw] xl:w-[22vw]"
              >
                <div className="relative aspect-[0.88] overflow-hidden rounded-md border border-white/10 bg-card">
                  <RecipeImage
                    src={recipe.image}
                    title={recipe.title}
                    className="h-full w-full"
                    sizes="(max-width: 767px) 82vw, (max-width: 1023px) 31vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 font-mono text-[10px] text-white/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute inset-0 grid place-items-center bg-[#17130f]/65 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    Retseptni ko&apos;rish
                    <ArrowUpRight className="absolute right-4 top-4 size-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4 pt-4">
                  <div>
                    <h3 className="font-heading text-xl leading-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                      {recipe.title}
                    </h3>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{recipe.difficulty}</p>
                  </div>
                  <span className="mb-0.5 inline-flex shrink-0 items-center gap-1.5 text-xs text-foreground/55">
                    <Clock3 className="size-3.5" aria-hidden="true" /> {recipe.cookingTime} daq.
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4" aria-label="Retseptlar bo'ylab siljish holati">
          <span className="font-mono text-[10px] text-muted-foreground">01</span>
          <div ref={progressTrackRef} className="h-px flex-1 overflow-hidden bg-white/15" role="progressbar" aria-label="Retseptlar galereyasi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <div ref={progressRef} className="h-full origin-left scale-x-0 bg-primary" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">{String(recipes.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}