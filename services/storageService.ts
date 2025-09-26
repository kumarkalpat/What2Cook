import type { Recipe } from '../types';

const RECIPES_STORAGE_KEY = 'what2cook_saved_recipes';
const INGREDIENTS_STORAGE_KEY = 'what2cook_saved_ingredients';

export const getSavedRecipes = (): Recipe[] => {
  try {
    const saved = localStorage.getItem(RECIPES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to parse saved recipes from localStorage", error);
    return [];
  }
};

export const saveRecipe = (recipeToSave: Recipe): void => {
  const recipes = getSavedRecipes();
  const isAlreadySaved = recipes.some(r => r.recipeName === recipeToSave.recipeName);
  if (!isAlreadySaved) {
    const updatedRecipes = [...recipes, recipeToSave];
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
  }
};

export const removeRecipe = (recipeName: string): void => {
  const recipes = getSavedRecipes();
  const updatedRecipes = recipes.filter(r => r.recipeName !== recipeName);
  localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
};

export const getSavedIngredients = (): string[] | null => {
  try {
    const saved = localStorage.getItem(INGREDIENTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to parse saved ingredients from localStorage", error);
    return null;
  }
}

export const saveIngredients = (ingredients: string[]): void => {
  try {
    localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(ingredients));
  } catch (error) {
    console.error("Failed to save ingredients to localStorage", error);
  }
}