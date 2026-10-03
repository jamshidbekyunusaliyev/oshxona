"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { uzbekDesserts, uzbekRecipes } from "@/lib/data/uzbek-recipes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { InstallButton } from "@/components/ui/install-button";
import { recipeCategories, type Recipe } from "@/types/recipe";

type RecipeCollection = "uzbek" | "desserts" | "world";

const pageSize = 8;

export function RecipeBrowser({ worldRecipes }: { worldRecipes: Recipe[] }) {
  const [collection, setCollection] = useState<RecipeCollection>("uzbek");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Barchasi");
  const [area, setArea] = useState("Barchasi");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const recipes = collection === "uzbek"
    ? uzbekRecipes
    : collection === "desserts"
      ? uzbekDesserts
      : worldRecipes;
  const areas = useMemo(
    () => [...new Set(recipes.map((recipe) => recipe.area).filter((value): value is string => Boolean(value)))].sort(),
    [recipes],
  );
  const filteredRecipes = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const filtered = recipes.filter((recipe) => {
      const matchesSearch =
        !normalizedSearch ||
        [recipe.title, recipe.titleEn, recipe.description].some((value) =>
          value.toLocaleLowerCase().includes(normalizedSearch),
        );
      const matchesCategory = category === "Barchasi" || recipe.category === category;
      const matchesArea = area === "Barchasi" || recipe.area === area;
      return matchesSearch && matchesCategory && matchesArea;
    });

    if (sort === "quickest") filtered.sort((first, second) => first.cookingTime - second.cookingTime);
    if (sort === "alphabetical") filtered.sort((first, second) => first.title.localeCompare(second.title, "uz"));
    return filtered;
  }, [area, category, recipes, search, sort]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || visibleCount >= filteredRecipes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => Math.min(current + pageSize, filteredRecipes.length));
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredRecipes.length, visibleCount]);

  function chooseCollection(nextCollection: RecipeCollection) {
    setCollection(nextCollection);
    setCategory("Barchasi");
    setArea("Barchasi");
    setVisibleCount(pageSize);
  }

  return (
    <main id="top" className="min-h-screen pb-24">
      <header className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-9 lg:px-14">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Tasty bosh sahifa">
          <span className="grid size-8 place-items-center rounded-full border border-primary/60 font-heading text-lg text-primary">t</span>
          <span className="text-[13px] font-semibold uppercase tracking-[0.2em]">Tasty</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-muted-foreground sm:inline">Yaxshi taomlar, birga yaxshiroq</span>
          <InstallButton compactOnMobile />
          <ThemeToggle />
        </div>
      </header>

      <section className="mx-auto max-w-[1480px] px-5 pb-10 pt-10 sm:px-9 sm:pt-14 md:px-14">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
          Tasty retseptlar kutubxonasi
        </p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="max-w-[760px] font-heading text-5xl leading-[1.02] text-foreground sm:text-6xl">
              Bugun dasturxonga nima tortamiz?
            </h1>
            <p className="mt-4 max-w-[540px] text-sm leading-6 text-foreground/60">
              O&apos;zbek oshxonasining tanish ta&apos;mlaridan yoki dunyo oshxonalaridan yangi g&apos;oya toping.
            </p>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">{filteredRecipes.length} ta retsept</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-b border-border/80">
          <div className="flex flex-wrap gap-x-4 sm:gap-x-6" role="tablist" aria-label="Retseptlar to'plami">
            <button
              id="tab-uzbek"
              type="button"
              role="tab"
              aria-selected={collection === "uzbek"}
              aria-controls="recipe-grid"
              onClick={() => chooseCollection("uzbek")}
              className={`relative py-3 text-sm transition-colors ${collection === "uzbek" ? "font-semibold text-primary" : "text-foreground/55 hover:text-foreground"}`}
            >
              O&apos;zbek taomlari
              {collection === "uzbek" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
            </button>
            <button
              id="tab-desserts"
              type="button"
              role="tab"
              aria-selected={collection === "desserts"}
              aria-controls="recipe-grid"
              onClick={() => chooseCollection("desserts")}
              className={`relative py-3 text-sm transition-colors ${collection === "desserts" ? "font-semibold text-primary" : "text-foreground/55 hover:text-foreground"}`}
            >
              Shirinliklar
              {collection === "desserts" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
            </button>
            <button
              id="tab-world"
              type="button"
              role="tab"
              aria-selected={collection === "world"}
              aria-controls="recipe-grid"
              onClick={() => chooseCollection("world")}
              className={`relative py-3 text-sm transition-colors ${collection === "world" ? "font-semibold text-primary" : "text-foreground/55 hover:text-foreground"}`}
            >
              Jahon taomlari
              {collection === "world" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
            </button>
          </div>
          <label className="relative mb-3 block w-full sm:mb-0 sm:w-[270px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Retsept qidirish</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Taom nomini qidiring"
              className="h-11 w-full rounded-md border border-border bg-card/70 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 py-5">
          <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
          <label className="sr-only" htmlFor="recipe-category">Taom turini tanlang</label>
          <select
            id="recipe-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-md border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value="Barchasi">Barcha toifalar</option>
            {recipeCategories.map((recipeCategory) => (
              <option key={recipeCategory} value={recipeCategory}>{recipeCategory}</option>
            ))}
          </select>
          {collection === "world" && (
            <>
              <label className="sr-only" htmlFor="recipe-area">Hududni tanlang</label>
              <select
                id="recipe-area"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="h-11 rounded-md border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="Barchasi">Barcha hududlar</option>
                {areas.map((recipeArea) => <option key={recipeArea}>{recipeArea}</option>)}
              </select>
            </>
          )}
          <label className="sr-only" htmlFor="recipe-sort">Saralash tartibi</label>
          <select
            id="recipe-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 rounded-md border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value="featured">Tavsiya etilgan</option>
            <option value="quickest">Eng tez tayyorlanadi</option>
            <option value="alphabetical">Alifbo bo&apos;yicha</option>
          </select>
        </div>

        {filteredRecipes.length > 0 ? (
          <div id="recipe-grid" role="tabpanel" aria-labelledby={`tab-${collection}`}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecipes.slice(0, visibleCount).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            <div ref={loadMoreRef} className="h-12" aria-hidden="true" />
          </div>
        ) : (
          <div className="border-y border-border py-20 text-center">
            <p className="font-heading text-3xl text-foreground">
              {collection === "world" ? "Jahon retseptlari hozircha topilmadi" : "Bu qidiruvga mos taom topilmadi"}
            </p>
            <p className="mt-3 text-sm text-foreground/55">Qidiruv yoki filterni o&apos;zgartirib ko&apos;ring.</p>
          </div>
        )}
      </section>
    </main>
  );
}