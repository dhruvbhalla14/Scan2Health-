// Gemini AI API integration for product suggestions

// ⚠️ DEVELOPER: Replace this with your actual Gemini API key
// Get your free API key from: https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = 'AIzaSyDtspjoOH_xVaK8LroXV6bbMgf7kvOXmAU';

export interface AIProductSuggestion {
  betterProducts: string[];
  reasoning: string;
  healthTips: string[];
}

export async function getProductSuggestions(
  productName: string,
  harmfulIngredients: string[]
): Promise<AIProductSuggestion | null> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyDtspjoOH_xVaK8LroXV6bbMgf7kvOXmAU') {
    // Return mock data if no API key is provided
    return {
      betterProducts: [
        `Organic ${productName.split(' ')[0]} by Nature's Path`,
        `${productName.split(' ')[0]} Plus by Amy's Kitchen`,
        `Healthy Choice ${productName.split(' ')[0]}`
      ],
      reasoning: 'These alternatives use natural ingredients without artificial additives and have lower sugar and sodium content.',
      healthTips: [
        'Look for products with fewer than 5 ingredients',
        'Choose items with natural sweeteners like honey or maple syrup',
        'Avoid products with artificial preservatives and colors'
      ]
    };
  }

  try {
    const prompt = `You are a health and nutrition expert. A user scanned "${productName}" which contains these harmful ingredients: ${harmfulIngredients.join(', ')}.

Please suggest 3 better alternative products from well-known brands that are healthier versions of this product. Also provide:
1. Brief reasoning why these alternatives are better
2. 3 practical health tips for choosing similar products

Format your response as JSON:
{
  "betterProducts": ["Product 1", "Product 2", "Product 3"],
  "reasoning": "Brief explanation",
  "healthTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get AI suggestions');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Invalid response from AI');
    }

    // Extract JSON from the response (it might be wrapped in markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const suggestions: AIProductSuggestion = JSON.parse(jsonMatch[0]);
      return suggestions;
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return null;
  }
}