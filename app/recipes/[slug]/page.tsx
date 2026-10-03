import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeDetail } from "@/components/recipes/recipe-detail";
import { uzbekRecipes } from "@/lib/data/uzbek-recipes";
import { getTheMealDbRecipeBySlug } from "@/lib/api/themealdb";

export async function generateStaticParams() {
  return uzbekRecipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: PageProps<"/recipes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const localRecipe = uzbekRecipes.find((recipe) => recipe.slug === slug);
  const recipe = localRecipe ?? await getTheMealDbRecipeBySlug(slug);
  return recipe
    ? { title: recipe.title, description: recipe.description }
    : { title: "Retsept topilmadi" };
}

export default async function RecipeDetailPage({ params }: PageProps<"/recipes/[slug]">) {
  const { slug } = await params;
  const localRecipe = uzbekRecipes.find((recipe) => recipe.slug === slug);
  const recipe = localRecipe ?? await getTheMealDbRecipeBySlug(slug);
  if (!recipe) notFound();

  const relatedRecipes = (recipe.source === "uzbek" ? uzbekRecipes : [])
    .filter((candidate) => candidate.slug !== recipe.slug && candidate.category === recipe.category)
    .slice(0, 3);

  return <RecipeDetail recipe={recipe} relatedRecipes={relatedRecipes} />;
}