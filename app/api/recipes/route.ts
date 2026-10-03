import { getTheMealDbRecipes } from "@/lib/api/themealdb";

export const revalidate = 3600;

export async function GET() {
  const recipes = await getTheMealDbRecipes();
  return Response.json({ recipes });
}