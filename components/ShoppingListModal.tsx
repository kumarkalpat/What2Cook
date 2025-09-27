import React, { useState } from 'react';
import type { ShoppingList } from '../types';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.42 1.32 4.89L2 22l5.25-1.38c1.41.81 3.02 1.29 4.75 1.29h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.16 14.2c-.28-.14-1.65-.81-1.9-.91-.25-.1-.44-.14-.62.14-.18.28-.72.91-.88 1.1-.16.18-.32.21-.59.07-.28-.14-1.17-.43-2.23-1.37-.83-.73-1.39-1.64-1.55-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.41-.48.14-.16.18-.28.28-.46.1-.18.05-.37-.02-.51s-.62-1.5-.85-2.05c-.22-.55-.45-.48-.62-.48-.16 0-.35-.03-.52-.03-.18 0-.46.07-.7.35-.25.28-.96.93-.96 2.27 0 1.34.99 2.63 1.13 2.81.14.18 1.96 3 4.75 4.19.68.29 1.22.46 1.64.59.71.21 1.36.18 1.86.11.56-.08 1.65-.68 1.88-1.33.24-.65.24-1.21.16-1.34l-.24-.1z" />
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.043m-7.416 0v3.043c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

interface ShoppingListModalProps {
  shoppingList: ShoppingList;
  onClose: () => void;
}

const formatListForSharing = (shoppingList: ShoppingList): string => {
    return shoppingList.map(category => {
        const items = category.items.map(item => `- ${item.name}: ${item.quantity} (buy: ${item.purchaseSize})`).join('\n');
        return `*${category.category}*\n${items}`;
    }).join('\n\n');
};

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ shoppingList, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = formatListForSharing(shoppingList);
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy list to clipboard.");
        });
    };

    const handleShareWhatsApp = () => {
        const shareText = formatListForSharing(shoppingList);
        const encodedText = encodeURIComponent(shareText);
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shopping-list-modal-title"
        >
            <div
                className="bg-light dark:bg-zinc-800 rounded-2xl shadow-xl p-6 m-4 w-full max-w-lg max-h-[85vh] flex flex-col"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'fade-in-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
                <h3 id="shopping-list-modal-title" className="text-xl font-bold text-dark dark:text-light mb-4 text-center">Your Shopping List</h3>
                
                <div className="overflow-y-auto pr-2 flex-grow">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted dark:text-secondary uppercase sticky top-0 bg-light dark:bg-zinc-800">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Item</th>
                                    <th scope="col" className="px-4 py-3">Quantity Needed</th>
                                    <th scope="col" className="px-4 py-3">Purchase Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shoppingList.flatMap(category => [
                                    <tr key={category.category} className="bg-secondary/10 dark:bg-primary/10">
                                        <th scope="colgroup" colSpan={3} className="px-4 py-2 font-bold text-lg text-primary dark:text-secondary">
                                            {category.category}
                                        </th>
                                    </tr>,
                                    ...category.items.map(item => (
                                        <tr key={`${category.category}-${item.name}`} className="border-b border-secondary/20 dark:border-primary/30 last:border-b-0">
                                            <th scope="row" className="px-4 py-2 font-medium text-dark dark:text-light whitespace-nowrap">
                                                {item.name}
                                            </th>
                                            <td className="px-4 py-2 text-primary dark:text-secondary">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-2 text-primary dark:text-secondary">
                                                {item.purchaseSize}
                                            </td>
                                        </tr>
                                    ))
                                ])}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-secondary/20 dark:border-primary/30 flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleShareWhatsApp}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-zinc-800 transition-colors"
                        >
                            <WhatsAppIcon className="w-5 h-5" />
                            Share
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 transition-colors ${
                                isCopied
                                ? 'bg-green-500/20 text-green-700 dark:text-green-300 ring-green-500'
                                : 'bg-secondary/20 hover:bg-secondary/40 text-dark/80 dark:bg-primary/20 dark:hover:bg-primary/40 dark:text-light/80 ring-secondary'
                            }`}
                        >
                            {isCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                            {isCopied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <button onClick={onClose} className="w-full sm:w-auto bg-primary text-light font-bold py-3 px-6 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300">
                        Done
                    </button>
                </div>
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
