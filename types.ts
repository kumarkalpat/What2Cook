export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl?: string;
}

export interface FormData {
  ingredients: string[];
  mealType: string;
  cuisine: string;
  diet: string;
  indianCuisineRegion?: string;
}
