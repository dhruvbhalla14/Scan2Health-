export type HealthScore = 'healthy' | 'moderate' | 'unhealthy';

export interface Product {
  id: string;
  name: string;
  image: string;
  barcode: string;
  healthScore: HealthScore;
  scannedAt: Date;
  goodIngredients: string[];
  harmfulIngredients: string[];
  nutrition: {
    calories: number;
    sugar: number;
    fat: number;
    protein: number;
    fiber: number;
  };
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Whole Grain Cereal',
    image: 'https://images.unsplash.com/photo-1699723521107-bb297f2642ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwY2VyZWFsJTIwYm94JTIwcGFja2FnaW5nfGVufDF8fHx8MTc3MjY1NTU3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    barcode: '0123456789012',
    healthScore: 'healthy',
    scannedAt: new Date('2026-03-04T10:30:00'),
    goodIngredients: ['Whole Grain Oats', 'Almonds', 'Natural Honey', 'Flax Seeds', 'Chia Seeds'],
    harmfulIngredients: [],
    nutrition: {
      calories: 150,
      sugar: 5,
      fat: 3,
      protein: 6,
      fiber: 5
    }
  },
  {
    id: '2',
    name: 'Fresh Orange Juice',
    image: 'https://images.unsplash.com/photo-1640213505284-21352ee0d76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdWljZSUyMGJvdHRsZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzcyNjU1NTc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    barcode: '0123456789013',
    healthScore: 'moderate',
    scannedAt: new Date('2026-03-03T15:20:00'),
    goodIngredients: ['Vitamin C', 'Natural Orange Extract', 'Potassium'],
    harmfulIngredients: ['High Sugar Content', 'Citric Acid (preservative)'],
    nutrition: {
      calories: 110,
      sugar: 21,
      fat: 0,
      protein: 2,
      fiber: 0
    }
  },
  {
    id: '3',
    name: 'Chocolate Bar',
    image: 'https://images.unsplash.com/photo-1696487773702-051c3d1d4b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBiYXIlMjB3cmFwcGVyfGVufDF8fHx8MTc3MjYxMzQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    barcode: '0123456789014',
    healthScore: 'unhealthy',
    scannedAt: new Date('2026-03-02T09:15:00'),
    goodIngredients: ['Cocoa'],
    harmfulIngredients: ['High Sugar', 'Saturated Fat', 'Palm Oil', 'Artificial Flavors', 'High Calories'],
    nutrition: {
      calories: 250,
      sugar: 28,
      fat: 14,
      protein: 3,
      fiber: 1
    }
  },
  {
    id: '4',
    name: 'Greek Yogurt Cup',
    image: 'https://images.unsplash.com/photo-1709620044505-d7dc01c665d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBjdXAlMjBwYWNrYWdlfGVufDF8fHx8MTc3MjY1NTU3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    barcode: '0123456789015',
    healthScore: 'healthy',
    scannedAt: new Date('2026-03-01T14:45:00'),
    goodIngredients: ['Live Active Cultures', 'High Protein', 'Calcium', 'Probiotics'],
    harmfulIngredients: [],
    nutrition: {
      calories: 100,
      sugar: 6,
      fat: 0,
      protein: 17,
      fiber: 0
    }
  },
  {
    id: '5',
    name: 'Protein Energy Bar',
    image: 'https://images.unsplash.com/photo-1742860866012-fc167d8366bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwYmFyJTIwcGFja2FnZXxlbnwxfHx8fDE3NzI1NDE2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    barcode: '0123456789016',
    healthScore: 'moderate',
    scannedAt: new Date('2026-02-28T11:00:00'),
    goodIngredients: ['Whey Protein', 'Oats', 'Peanuts', 'Fiber'],
    harmfulIngredients: ['Added Sugar', 'Soy Lecithin'],
    nutrition: {
      calories: 200,
      sugar: 12,
      fat: 7,
      protein: 20,
      fiber: 3
    }
  },
  {
    id: '6',
    name: 'Potato Chips',
    image: 'https://images.unsplash.com/photo-1641693148759-843d17ceac24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFjayUyMGNoaXBzJTIwYmFnfGVufDF8fHx8MTc3MjY1NTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    barcode: '0123456789017',
    healthScore: 'unhealthy',
    scannedAt: new Date('2026-02-27T16:30:00'),
    goodIngredients: ['Potatoes'],
    harmfulIngredients: ['High Sodium', 'Trans Fat', 'Saturated Fat', 'Artificial Flavors', 'MSG'],
    nutrition: {
      calories: 160,
      sugar: 1,
      fat: 10,
      protein: 2,
      fiber: 1
    }
  }
];
