import type { Product } from '../data/mockData';

const STORAGE_KEY = 'scan2health_products';
const PREFERENCES_KEY = 'scan2health_preferences';

export interface UserPreferences {
  dietaryRestrictions: string[];
  allergens: string[];
  notifications: boolean;
}

// Product storage functions
export function saveProduct(product: Product): void {
  try {
    const products = getProducts();
    const existingIndex = products.findIndex((p) => p.barcode === product.barcode);

    if (existingIndex >= 0) {
      // Update existing product with new scan date
      products[existingIndex] = { ...product, scannedAt: new Date() };
    } else {
      // Add new product to the beginning
      products.unshift(product);
    }

    // Limit to 50 most recent scans
    const limitedProducts = products.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedProducts));
  } catch (error) {
    console.error('Error saving product:', error);
  }
}

export function getProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const products = JSON.parse(data);
    
    // Convert string dates back to Date objects
    return products.map((p: any) => ({
      ...p,
      scannedAt: new Date(p.scannedAt),
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find((p) => p.id === id);
}

export function deleteProduct(id: string): void {
  try {
    const products = getProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

export function clearAllProducts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing products:', error);
  }
}

// User preferences functions
export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

export function getPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(PREFERENCES_KEY);
    if (!data) {
      return {
        dietaryRestrictions: [],
        allergens: [],
        notifications: true,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting preferences:', error);
    return {
      dietaryRestrictions: [],
      allergens: [],
      notifications: true,
    };
  }
}
