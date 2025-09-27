
import React, { useState, useCallback, useEffect } from 'react';
import type { Recipe, FormData } from './types';
import { generateRecipes } from './services/geminiService';
import * as storageService from './services/storageService';
import { Header } from './components/Header';
import { RecipeForm } from './components/RecipeForm';
import { RecipeList } from './components/RecipeList';
import { useTheme } from './hooks/useTheme';
import { SavedRecipes } from './components/SavedRecipes';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, toggleTheme] = useTheme();

  const [view, setView] = useState<'home' | 'saved'>('home');
  const [savedRecipeNames, setSavedRecipeNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = storageService.getSavedRecipes();
    setSavedRecipeNames(new Set(saved.map(r => r.recipeName)));
  }, []);

  const handleSaveRecipe = useCallback((recipe: Recipe) => {
    storageService.saveRecipe(recipe);
    setSavedRecipeNames(prev => new Set(prev).add(recipe.recipeName));
  }, []);

  const handleRemoveRecipe = useCallback((recipeName: string) => {
    storageService.removeRecipe(recipeName);
    setSavedRecipeNames(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipeName);
        return newSet;
    });
  }, []);

  const handleGenerateRecipes = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setRecipes(null);

    try {
      const result = await generateRecipes(formData);
      if (result && result.length > 0) {
        setRecipes(result);
      } else {
        setError("Couldn't find any recipes with those ingredients. Try adding more!");
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showSavedRecipes = () => {
    setView('saved');
    setRecipes(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-light text-dark dark:bg-dark dark:text-light font-sans flex flex-col transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} onShowSaved={showSavedRecipes} />
      <main className="flex-grow container mx-auto p-4 md:p-8 w-full max-w-6xl">
        {view === 'home' ? (
          <>
            <div className="bg-secondary/10 dark:bg-primary/10 rounded-2xl shadow-lg p-6 md:p-10 border border-secondary/20 dark:border-primary/20">
              <p className="font-script text-2xl text-muted dark:text-secondary mb-8 text-center md:text-left">
                Tell me what you have, and <span className="text-primary dark:text-light">a</span>I will give you some ideas for your next meal.
              </p>
              <RecipeForm onSubmit={handleGenerateRecipes} isLoading={isLoading} />
            </div>
            <div className="mt-12">
              <RecipeList
                recipes={recipes}
                isLoading={isLoading}
                error={error}
                savedRecipeNames={savedRecipeNames}
                onSave={handleSaveRecipe}
                onRemove={handleRemoveRecipe}
              />
            </div>
          </>
        ) : (
          <SavedRecipes onBack={() => setView('home')} onRemove={handleRemoveRecipe} />
        )}
      </main>
    </div>
  );
};

export default App;