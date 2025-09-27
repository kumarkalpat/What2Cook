import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, FormData, ShoppingList } from './types';

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "The name of the recipe."
      },
      description: {
        type: Type.STRING,
        description: "A short, enticing description of the dish."
      },
      prepTime: {
        type: Type.STRING,
        description: "Estimated preparation time (e.g., '15 minutes')."
      },
      cookTime: {
        type: Type.STRING,
        description: "Estimated cooking time (e.g., '30 minutes')."
      },
      servings: {
        type: Type.STRING,
        description: "Number of servings the recipe makes (e.g., '4 servings')."
      },
      ingredients: {
        type: Type.ARRAY,
        description: "A list of all ingredients required for the recipe, including those provided by the user.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the ingredient."
            },
            quantity: {
              type: Type.STRING,
              description: "The amount of the ingredient (e.g., '2 cups', '1 tbsp')."
            }
          },
          required: ['name', 'quantity']
        }
      },
      instructions: {
        type: Type.ARRAY,
        description: "Step-by-step instructions for preparing the recipe.",
        items: {
          type: Type.STRING
        }
      }
    },
    required: ['recipeName', 'description', 'ingredients', 'instructions', 'prepTime', 'cookTime', 'servings']
  }
};

const shoppingListSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            category: {
                type: Type.STRING,
                description: "The category of the ingredients (e.g., 'Produce', 'Dairy & Eggs', 'Meat & Fish', 'Pantry Staples', 'Spices')."
            },
            items: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: "The name of the ingredient."
                        },
                        quantity: {
                            type: Type.STRING,
                            description: "The consolidated quantity of the ingredient needed for the recipe (e.g., '3 medium', '2 cups', '250g')."
                        },
                        purchaseSize: {
                            type: Type.STRING,
                            description: "The typical minimum quantity or package size this item is sold in at a grocery store (e.g., '1 lb bag', '1 can', '1 bunch', '1 small jar')."
                        }
                    },
                    required: ['name', 'quantity', 'purchaseSize']
                }
            }
        },
        required: ['category', 'items']
    }
};

export const generateRecipes = async (formData: FormData): Promise<Recipe[] | null> => {
  const apiKey = process.env.API_KEY; 

  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const { ingredients, mealType, cuisine, diet, indianCuisineRegion, specialRequests } = formData;

  if (ingredients.length === 0) {
    throw new Error("Please provide at least one ingredient.");
  }
  
  const dietPreference = diet === 'None' ? '' : `that is ${diet}`;
  
  let cuisineInstruction = '';
  if (cuisine !== 'Any') {
    if (cuisine === 'Indian' && indianCuisineRegion && indianCuisineRegion !== 'Any') {
      cuisineInstruction = `The recipes MUST be authentic ${indianCuisineRegion} Indian cuisine. Do not suggest recipes from other regions of India.`;
    } else {
      cuisineInstruction = `The recipes should be in the style of ${cuisine} cuisine.`;
    }
  }

  const specialRequestInstruction = specialRequests ? `\nIMPORTANT: The user has a special request: "${specialRequests}". Please adhere to it.` : ''

  const prompt = `
    Generate 2 creative and delicious recipes for a ${mealType} ${dietPreference}.
    ${cuisineInstruction}
    The user has the following ingredients available: ${ingredients.join(', ')}.
    ${specialRequestInstruction}
    The recipes should primarily use these ingredients, but you can include a few common pantry staples if necessary (like oil, salt, pepper, spices).
    For each recipe, provide a name, a short description, prep time, cook time, servings, a list of ingredients with quantities, and step-by-step instructions.
    Ensure the final output strictly adheres to the provided JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const recipesData = JSON.parse(jsonText) as Omit<Recipe, 'imageUrl'>[];

    if (!recipesData || recipesData.length === 0) {
        return null;
    }

    const recipesWithImages: Recipe[] = [];
    for (const [index, recipe] of recipesData.entries()) {
        try {
            const imagePrompt = `A delicious, professional food photograph of "${recipe.recipeName}". ${recipe.description}. The image should be vibrant, appetizing, and well-lit with a clean background.`;
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9',
                },
            });
            const generatedImage = imageResponse.generatedImages?.[0];

            if (!generatedImage || !generatedImage.image || !generatedImage.image.imageBytes) {
                throw new Error("Image generation failed or returned no image data.");
            }

            const base64ImageBytes: string = generatedImage.image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            recipesWithImages.push({ ...recipe, imageUrl });

        } catch (imageError) {
            console.error(`Failed to generate image for recipe "${recipe.recipeName}":`, imageError);
            recipesWithImages.push({ ...recipe, imageUrl: undefined }); 
        }

        if (index < recipesData.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return recipesWithImages;

  } catch (error) {
    console.error("Error generating recipes:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unexpected error occurred while generating recipes.");
  }
};


export const generateShoppingList = async (recipes: Recipe[]): Promise<ShoppingList | null> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        Based on the following list of recipes, generate a consolidated and categorized shopping list.
        Combine the quantities of identical ingredients. For example, if one recipe needs '1 onion' and another needs '1/2 onion', the list should show '1 1/2 onions'.
        Group the items into logical shopping categories like 'Produce', 'Dairy & Eggs', 'Meat & Fish', 'Pantry Staples', 'Spices', etc.
        For each item, you must provide three things: the item name, the consolidated quantity needed for the recipes, and the typical purchase size for that item in a grocery store.
        For example, if you need '1 tbsp of paprika', the purchase size might be '1 small jar'. If you need '1/2 cup cilantro', the purchase size would be '1 bunch'.
        Do not include basic items that are almost always on hand like salt, pepper, and water unless specified with a unique characteristic (e.g., 'coarse sea salt').
        
        Recipes:
        ${JSON.stringify(recipes.map(({ recipeName, ingredients }) => ({ recipeName, ingredients })))}

        Ensure the final output strictly adheres to the provided JSON schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: shoppingListSchema,
            },
        });

        const jsonText = response.text.trim();
        const shoppingListData = JSON.parse(jsonText) as ShoppingList;

        if (!shoppingListData || shoppingListData.length === 0) {
            return null;
        }

        return shoppingListData;

    } catch (error) {
        console.error("Error generating shopping list:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unexpected error occurred while generating the shopping list.");
    }
};