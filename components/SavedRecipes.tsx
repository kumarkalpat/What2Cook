import React, { useState, useEffect } from 'react';
import { getSavedRecipes } from '../services/storageService';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface SavedRecipesProps {
    onBack: () => void;
    onRemove: (recipeName: string) => void;
}

export const SavedRecipes: React.FC<SavedRecipesProps> = ({ onBack, onRemove }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        setRecipes(getSavedRecipes());
    }, []);

    const handleRemove = (recipeName: string) => {
        onRemove(recipeName);
        setRecipes(prev => prev.filter(r => r.recipeName !== recipeName));
    };
    
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <h2 className="text-3xl font-bold text-dark dark:text-light pl-2 mb-4 sm:mb-0">My Saved Recipes</h2>
                <button
                    onClick={onBack}
                    className="flex items-center justify-center bg-primary text-light font-bold py-2 px-6 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300"
                >
                    &larr; Back to Generator
                </button>
            </div>
            
            {recipes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {recipes.map((recipe, index) => (
                        <RecipeCard 
                            key={index} 
                            recipe={recipe} 
                            isSaved={true} 
                            onRemove={handleRemove} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-secondary/10 dark:bg-primary/10 rounded-2xl shadow-lg border border-secondary/20 dark:border-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-muted/30 dark:text-secondary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-dark dark:text-light">No recipes saved yet.</h3>
                    <p className="mt-1 text-muted">Generate some recipes and save your favorites to see them here.</p>
                </div>
            )}
        </div>
    );
};