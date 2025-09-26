import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[] | null;
  isLoading: boolean;
  error: string | null;
  savedRecipeNames: Set<string>;
  onSave: (recipe: Recipe) => void;
  onRemove: (recipeName: string) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-light dark:bg-zinc-900 rounded-2xl shadow-lg border border-secondary/20 dark:border-primary/20 overflow-hidden animate-pulse">
                <div className="h-48 bg-secondary/20 dark:bg-primary/20"></div>
                <div className="p-6">
                    <div className="h-8 bg-secondary/20 dark:bg-primary/20 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-secondary/20 dark:bg-primary/20 rounded w-full mb-2"></div>
                    <div className="h-4 bg-secondary/20 dark:bg-primary/20 rounded w-5/6 mb-6"></div>
                    <div className="flex justify-between items-center mb-6 text-sm">
                        <div className="h-5 bg-secondary/20 dark:bg-primary/20 rounded w-20"></div>
                        <div className="h-5 bg-secondary/20 dark:bg-primary/20 rounded w-20"></div>
                        <div className="h-5 bg-secondary/20 dark:bg-primary/20 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-secondary/20 dark:bg-primary/20 rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-secondary/20 dark:bg-primary/20 rounded"></div>
                        <div className="h-4 bg-secondary/20 dark:bg-primary/20 rounded"></div>
                        <div className="h-4 bg-secondary/20 dark:bg-primary/20 rounded"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);


const EmptyState: React.FC = () => (
  <div className="text-center py-16 px-6 bg-secondary/10 dark:bg-primary/10 rounded-2xl shadow-lg border border-secondary/20 dark:border-primary/20">
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-muted/30 dark:text-secondary/30 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a5 5 0 01-4.9-6.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a5 5 0 014.9 6.2" />
    </svg>
    <h3 className="mt-4 text-xl font-medium text-dark dark:text-light">Ready to cook?</h3>
    <p className="mt-1 text-muted">Your delicious, AI-generated recipes will appear here.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-16 px-6 bg-red-500/10 rounded-2xl border border-red-500/20">
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500/70 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="mt-4 text-xl font-medium text-red-800 dark:text-red-300">Oops! Something went wrong.</h3>
    <p className="mt-1 text-red-700 dark:text-red-400">{message}</p>
  </div>
);

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, isLoading, error, savedRecipeNames, onSave, onRemove }) => {
  if (isLoading && !recipes) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!recipes) {
    return <EmptyState />;
  }

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
            <h2 className="text-3xl font-bold text-dark dark:text-light pl-2 mb-4 sm:mb-0">Your Culinary Creations</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recipes.map((recipe, index) => (
                <RecipeCard
                    key={index}
                    recipe={recipe}
                    isSaved={savedRecipeNames.has(recipe.recipeName)}
                    onSave={onSave}
                    onRemove={onRemove}
                />
            ))}
        </div>
    </div>
  );
};