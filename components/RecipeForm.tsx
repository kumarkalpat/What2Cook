import React, { useState, useEffect } from 'react';
import type { FormData } from '../types';
import { IngredientInput } from './IngredientInput';
import { Spinner } from './Spinner';
import * as storageService from '../services/storageService';

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

const FormSelect: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ id, label, value, onChange, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-dark/90 dark:text-light/90 mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-secondary/50 dark:border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-transparent dark:bg-primary/20 text-dark dark:text-light"
    >
      {children}
    </select>
  </div>
);

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
  
  useEffect(() => {
    storageService.saveIngredients(ingredients);
  }, [ingredients]);

  useEffect(() => {
    if (cuisine !== 'Indian') {
      setIndianCuisineRegion('Any');
    }
  }, [cuisine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }
    onSubmit({ ingredients, mealType, cuisine, diet, indianCuisineRegion });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormSelect id="mealType" label="Meal Type" value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Dessert</option>
          <option>Snack</option>
        </FormSelect>

        <FormSelect id="cuisine" label="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
          <option value="any">Any</option>
          <option>Italian</option>
          <option>Mexican</option>
          <option>Indian</option>
          <option>Chinese</option>
          <option>Japanese</option>
          <option>Thai</option>
          <option>American</option>
        </FormSelect>

        {cuisine === 'Indian' && (
          <FormSelect id="indianCuisine" label="Indian Cuisine Region" value={indianCuisineRegion} onChange={(e) => setIndianCuisineRegion(e.target.value)}>
            <option>Any</option>
            <option>North</option>
            <option>South</option>
          </FormSelect>
        )}

        <FormSelect id="diet" label="Dietary Preference" value={diet} onChange={(e) => setDiet(e.target.value)}>
          <option value="none">None</option>
          <option>Vegetarian</option>
          <option>Vegan</option>
          <option>Gluten-Free</option>
          <option>Keto</option>
        </FormSelect>
      </div>
      
      <Button isLoading={isLoading}>Generate Recipes</Button>
    </form>
  );
};