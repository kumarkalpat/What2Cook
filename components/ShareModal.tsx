
import React, { useState } from 'react';
import type { Recipe } from '../types';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.42 1.32 4.89L2 22l5.25-1.38c1.41.81 3.02 1.29 4.75 1.29h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.16 14.2c-.28-.14-1.65-.81-1.9-.91-.25-.1-.44-.14-.62.14-.18.28-.72.91-.88 1.1-.16.18-.32.21-.59.07-.28-.14-1.17-.43-2.23-1.37-.83-.73-1.39-1.64-1.55-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.41-.48.14-.16.18-.28.28-.46.1-.18.05-.37-.02-.51s-.62-1.5-.85-2.05c-.22-.55-.45-.48-.62-.48-.16 0-.35-.03-.52-.03-.18 0-.46.07-.7.35-.25.28-.96.93-.96 2.27 0 1.34.99 2.63 1.13 2.81.14.18 1.96 3 4.75 4.19.68.29 1.22.46 1.64.59.71.21 1.36.18 1.86.11.56-.08 1.65-.68 1.88-1.33.24-.65.24-1.21.16-1.34l-.24-.1z" />
    </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
    </svg>
);

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


interface ShareModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const formatRecipeForSharing = (recipe: Recipe): string => {
    const ingredientsList = recipe.ingredients.map(ing => `- ${ing.quantity} ${ing.name}`).join('\n');
    const instructionsList = recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n');

    return `
*${recipe.recipeName}*

${recipe.description}

*Ingredients:*
${ingredientsList}

*Instructions:*
${instructionsList}

Shared from What2Cook!
    `.trim().replace(/\n\s*\n/g, '\n\n');
};

export const ShareModal: React.FC<ShareModalProps> = ({ recipe, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareWhatsApp = () => {
    const shareText = formatRecipeForSharing(recipe);
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleShareEmail = () => {
    const ingredientsList = recipe.ingredients.map(ing => `• ${ing.quantity} ${ing.name}`).join('\n');
    const instructionsList = recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n');
    const emailBody = `
Hello!

Here is a recipe for ${recipe.recipeName}:

${recipe.description}

--------------------
INGREDIENTS
--------------------
${ingredientsList}

--------------------
INSTRUCTIONS
--------------------
${instructionsList}

Enjoy!
Shared from What2Cook.
    `.trim().replace(/\n\s*\n/g, '\n\n');

    const subject = `Check out this recipe: ${recipe.recipeName}`;
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(emailBody);
    window.location.href = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
    onClose();
  };

  const handleCopy = () => {
    if (isCopied) return;
    const shareText = formatRecipeForSharing(recipe);
    navigator.clipboard.writeText(shareText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy recipe to clipboard.");
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        className="bg-light dark:bg-zinc-800 rounded-2xl shadow-xl p-6 m-4 w-full max-w-sm" 
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fade-in-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        <h3 id="share-modal-title" className="text-xl font-bold text-dark dark:text-light mb-6 text-center">Share "{recipe.recipeName}"</h3>
        <div className="space-y-3">
          <button onClick={handleShareWhatsApp} className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-zinc-800 transition-colors">
            <WhatsAppIcon className="w-6 h-6" />
            Share on WhatsApp
          </button>
          <button onClick={handleShareEmail} className="w-full flex items-center justify-center gap-3 bg-primary text-light font-bold py-3 px-4 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-zinc-800 transition-colors">
            <EmailIcon className="w-6 h-6" />
            Share via Email
          </button>
          <button 
            onClick={handleCopy} 
            className={`w-full flex items-center justify-center gap-3 font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 transition-colors ${
                isCopied 
                ? 'bg-green-500/20 text-green-700 dark:text-green-300 ring-green-500' 
                : 'bg-secondary/20 hover:bg-secondary/40 text-dark/80 dark:bg-primary/20 dark:hover:bg-primary/40 dark:text-light/80 ring-secondary'
            }`}
          >
            {isCopied ? (
                <>
                    <CheckIcon className="w-6 h-6" />
                    Copied to Clipboard!
                </>
            ) : (
                <>
                    <LinkIcon className="w-6 h-6" />
                    Copy as Text
                </>
            )}
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-6 text-center text-sm text-muted hover:text-dark dark:hover:text-light transition-colors py-2">
          Cancel
        </button>
      </div>
      <style>
        {`
          @keyframes fade-in-scale {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
