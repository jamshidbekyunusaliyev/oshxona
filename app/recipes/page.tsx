import type { Metadata } from "next";
import { RecipeBrowser } from "@/components/recipes/recipe-browser";
import { getTheMealDbRecipes } from "@/lib/api/themealdb";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Retseptlar",
  description: "O'zbek milliy taomlari va dunyo oshxonalaridan retseptlar.",
};

export default async function RecipesPage() {
  const worldRecipes = await getTheMealDbRecipes();
  return <RecipeBrowser worldRecipes={worldRecipes} />;
}