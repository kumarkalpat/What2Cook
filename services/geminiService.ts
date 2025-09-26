import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, FormData } from './types';

// NOTE: I am assuming your types are defined in a file named 'types.ts' in the same directory.
// You will need to make sure the Recipe and FormData types are available for this file to compile.

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


export const generateRecipes = async (formData: FormData): Promise<Recipe[] | null> => {
  // === FIX APPLIED HERE ===
  // Vercel best practice and the Gemini SDK standard recommend GEMINI_API_KEY.
  // Ensure the Vercel environment variable is set to this name.
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    // Throw an explicit error if the key is missing to help with debugging
    throw new Error("GEMINI_API_KEY environment variable is not set.");
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

    // Generate images sequentially with a delay to avoid rate-limiting errors.
    const recipesWithImages: Recipe[] = [];
    for (const [index, recipe] of recipesData.entries()) {
        try {
            const imagePrompt = `A delicious, professional food photograph of "${recipe.recipeName}". ${recipe.description}. The image should be vibrant, appetizing, and well-lit with a clean background.`;
            // Updated to use imagen-3.0-generate-002 for optimal quality
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: imagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9',
                },
            });

            const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            recipesWithImages.push({ ...recipe, imageUrl });

        } catch (imageError) {
            console.error(`Failed to generate image for recipe "${recipe.recipeName}":`, imageError);
            // Proceed without an image if generation fails for any reason (e.g., rate limit, safety).
            recipesWithImages.push({ ...recipe, imageUrl: undefined }); 
        }

        // If it's not the last recipe, wait 1 second before the next API call to avoid rate limits.
        if (index < recipesData.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return recipesWithImages;

  } catch (error) {
    console.error("Error generating recipes:", error);
    if (error instanceof Error) {
        // Re-throw the original error to show the specific message in the UI
        throw error;
    }
    throw new Error("An unexpected error occurred while generating recipes.");
  }
};
