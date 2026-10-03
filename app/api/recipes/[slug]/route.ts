import { getTheMealDbRecipeBySlug } from "@/lib/api/themealdb";

export const revalidate = 3600;

export async function GET(_request: Request, { params }: RouteContext<"/api/recipes/[slug]">) {
  const { slug } = await params;
  const recipe = await getTheMealDbRecipeBySlug(slug);

  if (!recipe) return Response.json({ error: "Recipe not found" }, { status: 404 });
  return Response.json({ recipe });
}