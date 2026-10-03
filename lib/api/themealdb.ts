import type {
  Recipe,
  RecipeCategory,
  TheMealDbMeal,
  TheMealDbSearchResponse,
} from "@/types/recipe";

const mealDbSearchTerms = ["chicken", "pasta", "beef"];

function mapMealCategory(category: string | null | undefined): RecipeCategory {
  const normalized = category?.toLowerCase();
  if (normalized === "dessert") return "Shirinliklar";
  if (normalized === "starter" || normalized === "side") return "Birinchi taom";
  if (normalized === "breakfast" || normalized === "miscellaneous") return "Somsa";
  if (normalized === "vegan" || normalized === "vegetarian") return "Salqin taom";
  return "Ikkinchi taom";
}

function mapMeal(meal: TheMealDbMeal): Recipe {
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const ingredientName = meal[`strIngredient${index + 1}`]?.trim();
    const measurement = meal[`strMeasure${index + 1}`]?.trim() ?? "";
    return ingredientName
      ? { name: ingredientName, amount: measurement || "1", unit: "" }
      : null;
  }).filter((ingredient): ingredient is NonNullable<typeof ingredient> => ingredient !== null);

  const instructions = (meal.strInstructions ?? "")
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter(Boolean);

  return {
    id: `meal-${meal.idMeal}`,
    slug: `meal-${meal.idMeal}`,
    title: meal.strMeal,
    titleEn: meal.strMeal,
    description: `${meal.strMeal} is shared by ${meal.strArea || "home cooks around the world"}. Follow the method below and adjust seasoning to taste.`,
    category: mapMealCategory(meal.strCategory),
    cookingTime: 45,
    difficulty: "O'rta",
    servings: 4,
    ingredients,
    steps: instructions.length ? instructions : ["Prepare the ingredients and cook until tender."],
    tips: ["Adjust salt and seasoning to taste."],
    image: meal.strMealThumb,
    area: meal.strArea || "International",
    source: "themealdb",
  };
}

async function searchMeals(term: string): Promise<TheMealDbMeal[]> {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`,
    { next: { revalidate: 3600 } },
  );
  if (!response.ok) return [];

  const data = (await response.json()) as TheMealDbSearchResponse;
  return data.meals ?? [];
}

export async function getTheMealDbRecipes(): Promise<Recipe[]> {
  try {
    const meals = await Promise.all(mealDbSearchTerms.map(searchMeals));
    const uniqueMeals = new Map<string, TheMealDbMeal>();
    meals.flat().forEach((meal) => uniqueMeals.set(meal.idMeal, meal));
    return [...uniqueMeals.values()].slice(0, 30).map(mapMeal);
  } catch {
    return [];
  }
}

export async function getTheMealDbRecipeBySlug(slug: string): Promise<Recipe | null> {
  const mealId = slug.startsWith("meal-") ? slug.slice("meal-".length) : "";
  if (!/^\d+$/.test(mealId)) return null;

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as TheMealDbSearchResponse;
    const meal = data.meals?.[0];
    return meal ? mapMeal(meal) : null;
  } catch {
    return null;
  }
}