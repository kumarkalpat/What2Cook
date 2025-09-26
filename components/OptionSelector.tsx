import React from 'react';

interface OptionSelectorProps {
  label: string;
  options: readonly string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  id: string;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ label, options, selectedValue, onSelect, id }) => {
  return (
    <div>
      <label id={id} className="block text-sm font-medium text-primary dark:text-secondary mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
              selectedValue === option
                ? 'bg-primary text-light shadow-md'
                : 'bg-secondary/20 hover:bg-secondary/40 text-dark/80 dark:bg-primary/20 dark:hover:bg-primary/40 dark:text-light/80'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};