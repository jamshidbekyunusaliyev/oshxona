import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { RecipeImage } from "@/components/ui/recipe-image";
import { ShareButton } from "@/components/ui/share-button";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="relative min-w-0">
      <Link
        href={`/recipes/${recipe.slug}`}
        className="group block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border/70 bg-card">
          <RecipeImage
            src={recipe.image}
            title={recipe.title}
            className="h-full w-full"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
          />
          <span className="absolute left-3 top-3 rounded-sm border border-white/20 bg-black/45 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-md">
            {recipe.category}
          </span>
          <span className="absolute inset-0 grid place-items-center bg-[#17130f]/55 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            Retseptni ko&apos;rish
            <ArrowUpRight className="absolute right-4 top-4 size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-start justify-between gap-4 pt-4">
          <div className="min-w-0">
            <h2 className="font-heading text-xl leading-snug text-foreground transition-colors group-hover:text-primary sm:text-2xl">
              {recipe.title}
            </h2>
            <p className="mt-1 truncate text-xs text-muted-foreground">{recipe.titleEn}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 pt-1 text-[10px] text-foreground/55">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {recipe.cookingTime} daq.
            </span>
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </Link>
      <ShareButton
        title={recipe.title}
        text={recipe.description}
        path={`/recipes/${recipe.slug}`}
        className="absolute right-3 top-3 z-10"
      />
    </article>
  );
}