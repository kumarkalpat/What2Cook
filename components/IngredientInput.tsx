import React, { useState } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddIngredient = () => {
    const newIngredient = inputValue.trim().toLowerCase();
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim() !== '') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  return (
    <div>
      <label htmlFor="ingredients" className="block text-sm font-medium text-dark/90 dark:text-light/90 mb-1">
        Available Ingredients
      </label>
      <div className="flex flex-wrap items-center gap-2 p-2 border border-secondary/50 dark:border-primary rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors bg-transparent dark:bg-primary/20">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center bg-secondary/30 text-dark dark:bg-secondary/20 dark:text-light text-sm font-medium px-3 py-1 rounded-full">
            <span>{ingredient}</span>
            <button
              type="button"
              onClick={() => removeIngredient(ingredient)}
              className="ml-2 text-dark/70 hover:text-dark dark:text-light/70 dark:hover:text-light"
              aria-label={`Remove ${ingredient}`}
            >
              &times;
            </button>
          </div>
        ))}
        <div className="flex items-center flex-grow min-w-[250px]">
            <input
              id="ingredients"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an ingredient..."
              className="w-full flex-grow bg-transparent p-1 focus:outline-none text-dark dark:text-light placeholder-muted"
            />
            <button
                type="button"
                onClick={handleAddIngredient}
                disabled={inputValue.trim() === ''}
                className="ml-2 flex-shrink-0 bg-primary text-light font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-primary/80 disabled:bg-primary/50 transition-colors"
            >
                Add
            </button>
        </div>
      </div>
      <p className="text-xs text-muted mt-1">Tip: Add ingredients by clicking 'Add' or pressing Enter/comma.</p>
    </div>
  );
};