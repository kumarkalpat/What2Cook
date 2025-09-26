
import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ShareModal } from './ShareModal';

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zM14.25 4.5a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zM14.25 17.25a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.625 6.375l-4.5 3.375m0 3l4.5 3.375" />
    </svg>
);


interface RecipeCardProps {
  recipe: Recipe;
  isSaved?: boolean;
  onSave?: (recipe: Recipe) => void;
  onRemove?: (recipeName: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isSaved, onSave, onRemove }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <div className="bg-light dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-secondary/20 dark:border-primary/20 flex flex-col overflow-hidden">
        {recipe.imageUrl && (
          <img src={recipe.imageUrl} alt={`A generated image of ${recipe.recipeName}`} className="w-full h-48 object-cover" />
        )}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-dark dark:text-light mb-2">{recipe.recipeName}</h3>
          <p className="text-muted dark:text-light mb-4">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-muted dark:text-light border-t border-b border-secondary/20 dark:border-primary/30 py-3">
            <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-1.5 text-primary/80 stroke-2" />
                <strong>Prep:</strong><span className="ml-1">{recipe.prepTime}</span>
            </div>
            <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-1.5 text-primary/80 stroke-2" />
                <strong>Cook:</strong><span className="ml-1">{recipe.cookTime}</span>
            </div>
            <div className="flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-1.5 text-primary/80 stroke-2" />
                <strong>Serves:</strong><span className="ml-1">{recipe.servings}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2 text-dark dark:text-light">Ingredients</h4>
              <ul className="space-y-1.5 text-dark dark:text-light list-disc list-inside">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index}>
                    <span className="font-semibold text-dark dark:text-light mr-2">{ing.quantity}</span>
                    <span className="text-primary dark:text-secondary">{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-2 text-dark dark:text-light">Instructions</h4>
              <ol className="space-y-2 list-decimal list-inside">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="pl-2 text-primary dark:text-secondary">{step}</li>
                ))}
              </ol>
            </div>
          </div>
          
          {(onSave || onRemove) && (
               <div className="mt-auto pt-6 flex items-center gap-3">
               {isSaved ? (
                  <button
                      onClick={() => onRemove?.(recipe.recipeName)}
                      className="w-full flex justify-center items-center gap-2 bg-red-500/10 text-red-700 font-bold py-3 px-4 rounded-lg hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
                  >
                      <TrashIcon className="w-5 h-5" />
                      Remove Recipe
                  </button>
               ) : (
                  <button
                      onClick={() => onSave?.(recipe)}
                      className="w-full flex justify-center items-center gap-2 bg-primary text-light font-bold py-3 px-4 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300"
                  >
                      <BookmarkIcon className="w-5 h-5" />
                      Save Recipe
                  </button>
               )}
               <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex-shrink-0 p-3 bg-secondary/20 hover:bg-secondary/40 text-dark/80 dark:bg-primary/20 dark:hover:bg-primary/40 dark:text-light/80 rounded-lg transition-colors duration-200"
                  aria-label="Share recipe"
               >
                  <ShareIcon className="w-6 h-6" />
               </button>
              </div>
          )}
        </div>
      </div>
      {isShareModalOpen && <ShareModal recipe={recipe} onClose={() => setIsShareModalOpen(false)} />}
    </>
  );
};
