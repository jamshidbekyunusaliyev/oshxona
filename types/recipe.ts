export const recipeCategories = [
  "Birinchi taom",
  "Ikkinchi taom",
  "Somsa",
  "Salqin taom",
  "Shirinlik",
  "Shirinliklar",
] as const;

export type RecipeCategory = (typeof recipeCategories)[number];
export type RecipeDifficulty = "Oson" | "O'rta" | "Qiyin";
export type RecipeSource = "uzbek" | "themealdb";

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  category: RecipeCategory;
  cookingTime: number;
  difficulty: RecipeDifficulty;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  tips: string[];
  image: string;
  area?: string;
  source: RecipeSource;
}

export interface TheMealDbMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  [key: string]: string | null | undefined;
}

export interface TheMealDbSearchResponse {
  meals: TheMealDbMeal[] | null;
}