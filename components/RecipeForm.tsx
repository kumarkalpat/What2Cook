
import React, { useState, useEffect } from 'react';
import type { FormData } from '../types';
import { IngredientInput } from './IngredientInput';
import { Spinner } from './Spinner';
import * as storageService from '../services/storageService';
import { OptionSelector } from './OptionSelector';

interface RecipeFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

const Button: React.FC<{ isLoading: boolean; children: React.ReactNode }> = ({ isLoading, children }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full flex justify-center items-center bg-primary text-light font-bold py-3 px-6 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300 disabled:bg-primary/50 disabled:cursor-not-allowed"
  >
    {isLoading ? <Spinner /> : children}
  </button>
);

const mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'] as const;
const cuisineOptions = ['Any', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai', 'American'] as const;
const indianRegionOptions = ['Any', 'North', 'South'] as const;
const dietOptions = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto'] as const;

export const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, isLoading }) => {
  const [ingredients, setIngredients] = useState<string[]>(() => {
    const savedIngredients = storageService.getSavedIngredients();
    return savedIngredients && savedIngredients.length > 0
      ? savedIngredients
      : ['paneer', 'spinach', 'onion', 'garlic'];
  });
  const [mealType, setMealType] = useState('Dinner');
  const [cuisine, setCuisine] = useState('Indian');
  const [diet, setDiet] = useState('Vegetarian');
  const [indianCuisineRegion, setIndianCuisineRegion] = useState('Any');
  const [specialRequests, setSpecialRequests] = useState('');
  
  useEffect(() => {
    storageService.saveIngredients(ingredients);
  }, [ingredients]);
  
  const handleCuisineChange = (value: string) => {
    setCuisine(value);
    if (value !== 'Indian') {
      setIndianCuisineRegion('Any');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }
    onSubmit({ ingredients, mealType, cuisine, diet, indianCuisineRegion, specialRequests });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
      
      <div>
        <label className="block text-sm font-medium text-primary dark:text-secondary mb-2">
            Recipe Preferences
        </label>
        <div className="p-4 space-y-4 border border-secondary/50 dark:border-primary rounded-lg bg-transparent dark:bg-primary/20">
            <OptionSelector 
              id="mealType"
              label="Meal Type"
              options={mealTypeOptions}
              selectedValue={mealType}
              onSelect={setMealType}
            />
            <OptionSelector 
              id="cuisine"
              label="Cuisine"
              options={cuisineOptions}
              selectedValue={cuisine}
              onSelect={handleCuisineChange}
            />
            {cuisine === 'Indian' && (
              <div className="pl-4 ml-2 border-l-2 border-secondary/30 dark:border-primary/50">
                <OptionSelector 
                  id="indianCuisine"
                  label="Indian Cuisine Region"
                  options={indianRegionOptions}
                  selectedValue={indianCuisineRegion}
                  onSelect={setIndianCuisineRegion}
                />
              </div>
            )}
            <OptionSelector
              id="diet"
              label="Dietary Preference"
              options={dietOptions}
              selectedValue={diet}
              onSelect={setDiet}
            />
        </div>
      </div>
      
      <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-primary dark:text-secondary mb-2">
              Special Requests <span className="text-muted">(Optional)</span>
          </label>
          <textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              placeholder="e.g., make it extra spicy, low-carb, kid-friendly, use an air fryer..."
              className="w-full p-2 border border-secondary/50 dark:border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-transparent dark:bg-primary/20 text-dark dark:text-light placeholder-muted"
          />
      </div>
      
      <Button isLoading={isLoading}>Generate Recipes</Button>
    </form>
  );
};
