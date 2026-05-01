// OpenFoodFacts API integration
import type { Product } from '../data/mockData';

export interface OpenFoodFactsProduct {
  code: string;
  product?: {
    product_name?: string;
    image_url?: string;
    nutriments?: {
      'energy-kcal_100g'?: number;
      'sugars_100g'?: number;
      'fat_100g'?: number;
      'proteins_100g'?: number;
      'fiber_100g'?: number;
    };
    ingredients?: Array<{ text?: string }>;
    nutrient_levels?: {
      sugars?: string;
      salt?: string;
      'saturated-fat'?: string;
    };
    nova_group?: number;
    nutrition_grade_fr?: string;
    additives_tags?: string[];
  };
}

export async function fetchProductByBarcode(barcode: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );

    if (!response.ok) {
      throw new Error('Product not found');
    }

    const data: OpenFoodFactsProduct = await response.json();

    if (!data.product || data.product.product_name === undefined) {
      return null;
    }

    const product = data.product;

    // Calculate health score based on nutrition grade and nova group
    const healthScore = calculateHealthScore(
      product.nutrition_grade_fr,
      product.nova_group,
      product.nutrient_levels
    );

    // Extract good and harmful ingredients
    const { goodIngredients, harmfulIngredients } = analyzeIngredients(
      product.additives_tags,
      product.nutrient_levels
    );

    // Build product object
    const scannedProduct: Product = {
      id: barcode,
      name: product.product_name || 'Unknown Product',
      image: product.image_url || 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=400',
      barcode: barcode,
      healthScore: healthScore,
      scannedAt: new Date(),
      goodIngredients,
      harmfulIngredients,
      nutrition: {
        calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
        sugar: Math.round(product.nutriments?.['sugars_100g'] || 0),
        fat: Math.round(product.nutriments?.['fat_100g'] || 0),
        protein: Math.round(product.nutriments?.['proteins_100g'] || 0),
        fiber: Math.round(product.nutriments?.['fiber_100g'] || 0),
      },
    };

    return scannedProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

function calculateHealthScore(
  nutritionGrade?: string,
  novaGroup?: number,
  nutrientLevels?: { sugars?: string; salt?: string; 'saturated-fat'?: string }
): 'healthy' | 'moderate' | 'unhealthy' {
  // Use Nutri-Score grade (a-e)
  if (nutritionGrade === 'a' || nutritionGrade === 'b') {
    return 'healthy';
  }
  
  if (nutritionGrade === 'c') {
    return 'moderate';
  }

  if (nutritionGrade === 'd' || nutritionGrade === 'e') {
    return 'unhealthy';
  }

  // Fallback to NOVA group (1-4, where 4 is ultra-processed)
  if (novaGroup === 1 || novaGroup === 2) {
    return 'healthy';
  }

  if (novaGroup === 3) {
    return 'moderate';
  }

  if (novaGroup === 4) {
    return 'unhealthy';
  }

  // Fallback to nutrient levels
  if (nutrientLevels) {
    const highLevels = [
      nutrientLevels.sugars === 'high',
      nutrientLevels.salt === 'high',
      nutrientLevels['saturated-fat'] === 'high',
    ].filter(Boolean).length;

    if (highLevels >= 2) return 'unhealthy';
    if (highLevels === 1) return 'moderate';
  }

  return 'moderate';
}

// Common harmful additives and ingredients database
const HARMFUL_ADDITIVES: Record<string, string> = {
  'e621': 'MSG (Monosodium Glutamate)',
  'e951': 'Aspartame (Artificial Sweetener)',
  'e211': 'Sodium Benzoate (Preservative)',
  'e220': 'Sulfur Dioxide (Preservative)',
  'e250': 'Sodium Nitrite (Preservative)',
  'e102': 'Tartrazine (Yellow Dye)',
  'e110': 'Sunset Yellow (Food Dye)',
  'e129': 'Allura Red (Food Dye)',
  'e950': 'Acesulfame K (Artificial Sweetener)',
  'e338': 'Phosphoric Acid',
  'e331': 'Sodium Citrate',
  'e415': 'Xanthan Gum',
  'high-fructose-corn-syrup': 'High Fructose Corn Syrup',
  'palm-oil': 'Palm Oil',
  'hydrogenated': 'Hydrogenated Oils (Trans Fats)',
  'partially-hydrogenated': 'Partially Hydrogenated Oils',
};

// Good ingredients to look for
const GOOD_INGREDIENTS = [
  'whole grain', 'whole wheat', 'oats', 'quinoa', 'brown rice',
  'fiber', 'protein', 'vitamins', 'minerals', 'antioxidants',
  'omega-3', 'probiotics', 'natural', 'organic'
];

function analyzeIngredients(
  additivesTags?: string[],
  nutrientLevels?: { sugars?: string; salt?: string; 'saturated-fat'?: string }
): { goodIngredients: string[]; harmfulIngredients: string[] } {
  const goodIngredients: string[] = [];
  const harmfulIngredients: string[] = [];

  // Analyze harmful additives with proper names
  if (additivesTags && additivesTags.length > 0) {
    additivesTags.forEach((tag) => {
      const cleanTag = tag.replace('en:', '').toLowerCase();
      
      // Check if it's a known harmful additive
      for (const [key, value] of Object.entries(HARMFUL_ADDITIVES)) {
        if (cleanTag.includes(key)) {
          harmfulIngredients.push(value);
          break;
        }
      }
      
      // If not found in our database, add with cleaned name
      if (harmfulIngredients.length < additivesTags.length) {
        const additiveName = cleanTag
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        if (!harmfulIngredients.includes(additiveName)) {
          harmfulIngredients.push(additiveName);
        }
      }
    });
  }

  // Add warnings based on nutrient levels
  if (nutrientLevels) {
    if (nutrientLevels.sugars === 'high') {
      harmfulIngredients.push('High Sugar Content');
    } else if (nutrientLevels.sugars === 'low') {
      goodIngredients.push('Low Sugar');
    }

    if (nutrientLevels.salt === 'high') {
      harmfulIngredients.push('High Sodium/Salt');
    } else if (nutrientLevels.salt === 'low') {
      goodIngredients.push('Low Sodium');
    }

    if (nutrientLevels['saturated-fat'] === 'high') {
      harmfulIngredients.push('High Saturated Fat');
    } else if (nutrientLevels['saturated-fat'] === 'low') {
      goodIngredients.push('Low Saturated Fat');
    }
  }

  // Add good ingredient indicators
  if (goodIngredients.length === 0) {
    // These are assumed if not marked as high
    if (!nutrientLevels?.sugars || nutrientLevels.sugars !== 'high') {
      goodIngredients.push('Moderate Sugar Levels');
    }
    if (!nutrientLevels?.salt || nutrientLevels.salt !== 'high') {
      goodIngredients.push('Balanced Sodium');
    }
    if (!nutrientLevels?.['saturated-fat'] || nutrientLevels['saturated-fat'] !== 'high') {
      goodIngredients.push('Low Saturated Fat');
    }
  }

  // Ensure we always have at least one good ingredient
  if (goodIngredients.length === 0) {
    goodIngredients.push('Natural Base Ingredients');
  }

  // Limit to top 3 for each category
  return {
    goodIngredients: goodIngredients.slice(0, 3),
    harmfulIngredients: harmfulIngredients.slice(0, 3)
  };
}
