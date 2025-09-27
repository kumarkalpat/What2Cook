import React, { useState, useEffect } from 'react';
import { getSavedRecipes } from '../services/storageService';
import { generateShoppingList } from '../services/geminiService';
import type { Recipe, ShoppingList } from '../types';
import { RecipeCard } from './RecipeCard';
import { ShoppingListModal } from './ShoppingListModal';
import { Spinner } from './Spinner';

interface SavedRecipesProps {
    onBack: () => void;
    onRemove: (recipeName: string) => void;
}

const ShoppingCartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.836A1.125 1.125 0 0018.022 6H6.22a1.125 1.125 0 00-1.087.835L4.11 8.625M7.5 14.25V5.106M7.5 14.25a3 3 0 100 6 3 3 0 000-6zm11.25 0a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
);

export const SavedRecipes: React.FC<SavedRecipesProps> = ({ onBack, onRemove }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const [isListLoading, setIsListLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setRecipes(getSavedRecipes());
    }, []);

    const handleRemove = (recipeName: string) => {
        onRemove(recipeName);
        setRecipes(prev => prev.filter(r => r.recipeName !== recipeName));
    };

    const handleGenerateList = async () => {
        if (recipes.length === 0) return;

        setIsListLoading(true);
        setError(null);
        setShoppingList(null);

        try {
            const list = await generateShoppingList(recipes);
            if (list) {
                setShoppingList(list);
            } else {
                setError("Could not generate a shopping list from your saved recipes.");
            }
        } catch (e) {
            console.error(e);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsListLoading(false);
        }
    };
    
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-dark dark:text-light pl-2">My Saved Recipes</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleGenerateList}
                        disabled={recipes.length === 0 || isListLoading}
                        className="flex items-center justify-center gap-2 bg-secondary/30 dark:bg-primary/30 text-dark dark:text-light font-bold py-2 px-6 rounded-lg hover:bg-secondary/50 dark:hover:bg-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isListLoading ? <Spinner className="text-dark dark:text-light" /> : <ShoppingCartIcon className="w-5 h-5" />}
                        Generate Shopping List
                    </button>
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center bg-primary text-light font-bold py-2 px-6 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300"
                    >
                        &larr; Back to Generator
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}
            
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

            {shoppingList && (
                <ShoppingListModal shoppingList={shoppingList} onClose={() => setShoppingList(null)} />
            )}
        </div>
    );
};
