/**
 * Restaurant Service - Handles restaurant data and operations
 */

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  category: string;
  cuisine: string[];
  address: string;
  phone: string;
  isOpen: boolean;
  featured: boolean;
  tags: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  minimumOrder: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  calories?: number;
  allergens?: string[];
  customizations?: MenuCustomization[];
}

export interface MenuCustomization {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'quantity';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface RestaurantFilters {
  category?: string;
  cuisine?: string[];
  priceRange?: string[];
  rating?: number;
  deliveryTime?: number;
  deliveryFee?: number;
  dietaryRestrictions?: string[];
  sortBy?: 'relevance' | 'rating' | 'deliveryTime' | 'deliveryFee' | 'distance';
}

class RestaurantService {
  private restaurants: Restaurant[] = [];
  private menuItems: MenuItem[] = [];
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Subscribe to restaurant service events
  subscribe(callback: (event: string, data: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify listeners of events
  private notify(event: string, data: any = {}) {
    this.listeners.forEach(listener => listener(event, data));
  }

  // Initialize mock restaurant data
  private initializeMockData(): void {
    this.restaurants = [
      {
        id: 'rest1',
        name: 'Pizza Palace',
        image: 'https://example.com/pizza-palace.jpg',
        rating: 4.5,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        category: 'Pizza',
        cuisine: ['Italian'],
        address: '123 Main St, City',
        phone: '+1234567890',
        isOpen: true,
        featured: true,
        tags: ['Popular', 'Fast Delivery'],
        priceRange: '$$',
        minimumOrder: 15,
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
      },
      {
        id: 'rest2',
        name: 'Burger Barn',
        image: 'https://example.com/burger-barn.jpg',
        rating: 4.2,
        deliveryTime: '20-30 min',
        deliveryFee: 1.99,
        category: 'Burgers',
        cuisine: ['American'],
        address: '456 Oak Ave, City',
        phone: '+1234567891',
        isOpen: true,
        featured: false,
        tags: ['Budget Friendly'],
        priceRange: '$',
        minimumOrder: 10,
        coordinates: { latitude: 40.7589, longitude: -73.9851 },
      },
      {
        id: 'rest3',
        name: 'Sushi Zen',
        image: 'https://example.com/sushi-zen.jpg',
        rating: 4.8,
        deliveryTime: '40-50 min',
        deliveryFee: 3.99,
        category: 'Japanese',
        cuisine: ['Japanese', 'Sushi'],
        address: '789 Pine St, City',
        phone: '+1234567892',
        isOpen: true,
        featured: true,
        tags: ['Premium', 'Fresh Fish'],
        priceRange: '$$$',
        minimumOrder: 25,
        coordinates: { latitude: 40.7505, longitude: -73.9934 },
      },
      {
        id: 'rest4',
        name: 'Taco Fiesta',
        image: 'https://example.com/taco-fiesta.jpg',
        rating: 4.3,
        deliveryTime: '15-25 min',
        deliveryFee: 1.49,
        category: 'Mexican',
        cuisine: ['Mexican'],
        address: '321 Elm St, City',
        phone: '+1234567893',
        isOpen: true,
        featured: false,
        tags: ['Spicy', 'Quick Bite'],
        priceRange: '$',
        minimumOrder: 8,
        coordinates: { latitude: 40.7282, longitude: -74.0776 },
      },
      {
        id: 'rest5',
        name: 'Green Garden',
        image: 'https://example.com/green-garden.jpg',
        rating: 4.6,
        deliveryTime: '30-40 min',
        deliveryFee: 2.49,
        category: 'Healthy',
        cuisine: ['Vegetarian', 'Vegan'],
        address: '654 Maple Dr, City',
        phone: '+1234567894',
        isOpen: false,
        featured: false,
        tags: ['Healthy', 'Organic'],
        priceRange: '$$',
        minimumOrder: 12,
        coordinates: { latitude: 40.7614, longitude: -73.9776 },
      },
    ];

    this.menuItems = [
      // Pizza Palace items
      {
        id: 'item1',
        restaurantId: 'rest1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 16.99,
        image: 'https://example.com/margherita.jpg',
        category: 'Pizza',
        isVegetarian: true,
        calories: 280,
      },
      {
        id: 'item2',
        restaurantId: 'rest1',
        name: 'Pepperoni Pizza',
        description: 'Traditional pepperoni pizza with mozzarella cheese',
        price: 19.99,
        image: 'https://example.com/pepperoni.jpg',
        category: 'Pizza',
        calories: 320,
      },
      // Burger Barn items
      {
        id: 'item3',
        restaurantId: 'rest2',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, onion, and special sauce',
        price: 12.99,
        image: 'https://example.com/classic-burger.jpg',
        category: 'Burgers',
        calories: 540,
      },
      {
        id: 'item4',
        restaurantId: 'rest2',
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 11.99,
        image: 'https://example.com/veggie-burger.jpg',
        category: 'Burgers',
        isVegetarian: true,
        isVegan: true,
        calories: 420,
      },
      // Sushi Zen items
      {
        id: 'item5',
        restaurantId: 'rest3',
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber roll',
        price: 8.99,
        image: 'https://example.com/california-roll.jpg',
        category: 'Sushi',
        calories: 200,
      },
      {
        id: 'item6',
        restaurantId: 'rest3',
        name: 'Salmon Sashimi',
        description: 'Fresh salmon slices (6 pieces)',
        price: 14.99,
        image: 'https://example.com/salmon-sashimi.jpg',
        category: 'Sashimi',
        calories: 180,
      },
    ];
  }

  // Get all restaurants
  getAllRestaurants(): Restaurant[] {
    return [...this.restaurants];
  }

  // Get restaurant by ID
  getRestaurantById(id: string): Restaurant | null {
    return this.restaurants.find(restaurant => restaurant.id === id) || null;
  }

  // Get featured restaurants
  getFeaturedRestaurants(): Restaurant[] {
    return this.restaurants.filter(restaurant => restaurant.featured);
  }

  // Get restaurants by category
  getRestaurantsByCategory(category: string): Restaurant[] {
    return this.restaurants.filter(restaurant => 
      restaurant.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search restaurants
  searchRestaurants(query: string, filters?: RestaurantFilters): Restaurant[] {
    let results = [...this.restaurants];

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.category.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine.some(cuisine => cuisine.toLowerCase().includes(searchTerm)) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.category) {
        results = results.filter(restaurant => 
          restaurant.category.toLowerCase() === filters.category!.toLowerCase()
        );
      }

      if (filters.cuisine && filters.cuisine.length > 0) {
        results = results.filter(restaurant =>
          restaurant.cuisine.some(cuisine =>
            filters.cuisine!.includes(cuisine)
          )
        );
      }

      if (filters.priceRange && filters.priceRange.length > 0) {
        results = results.filter(restaurant =>
          filters.priceRange!.includes(restaurant.priceRange)
        );
      }

      if (filters.rating) {
        results = results.filter(restaurant => restaurant.rating >= filters.rating!);
      }

      if (filters.deliveryFee !== undefined) {
        results = results.filter(restaurant => restaurant.deliveryFee <= filters.deliveryFee!);
      }
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'deliveryTime':
          results.sort((a, b) => {
            const aTime = parseInt(a.deliveryTime.split('-')[0]);
            const bTime = parseInt(b.deliveryTime.split('-')[0]);
            return aTime - bTime;
          });
          break;
        case 'deliveryFee':
          results.sort((a, b) => a.deliveryFee - b.deliveryFee);
          break;
        default:
          // Keep original order for relevance
          break;
      }
    }

    return results;
  }

  // Get menu items for restaurant
  getMenuItems(restaurantId: string): MenuItem[] {
    return this.menuItems.filter(item => item.restaurantId === restaurantId);
  }

  // Get menu item by ID
  getMenuItemById(itemId: string): MenuItem | null {
    return this.menuItems.find(item => item.id === itemId) || null;
  }

  // Get menu categories for restaurant
  getMenuCategories(restaurantId: string): string[] {
    const items = this.getMenuItems(restaurantId);
    const categories = Array.from(new Set(items.map(item => item.category)));
    return categories;
  }

  // Get popular items (mock implementation)
  getPopularItems(limit: number = 10): MenuItem[] {
    // Return random selection of items
    const shuffled = [...this.menuItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  // Get nearby restaurants (mock implementation)
  getNearbyRestaurants(latitude: number, longitude: number, radius: number = 5): Restaurant[] {
    // For now, return all open restaurants
    return this.restaurants.filter(restaurant => restaurant.isOpen);
  }

  // Get restaurant categories
  getCategories(): string[] {
    const categories = Array.from(new Set(this.restaurants.map(r => r.category)));
    return categories.sort();
  }

  // Get all cuisines
  getCuisines(): string[] {
    const cuisines = new Set<string>();
    this.restaurants.forEach(restaurant => {
      restaurant.cuisine.forEach(cuisine => cuisines.add(cuisine));
    });
    return Array.from(cuisines).sort();
  }

  // Update restaurant (admin function)
  updateRestaurant(id: string, updates: Partial<Restaurant>): boolean {
    const index = this.restaurants.findIndex(r => r.id === id);
    if (index === -1) return false;

    this.restaurants[index] = { ...this.restaurants[index], ...updates };
    this.notify('restaurant_updated', { id, updates });
    return true;
  }

  // Add menu item (admin function)
  addMenuItem(item: MenuItem): boolean {
    try {
      this.menuItems.push(item);
      this.notify('menu_item_added', item);
      return true;
    } catch (error) {
      console.error('Error adding menu item:', error);
      return false;
    }
  }

  // Update menu item (admin function)
  updateMenuItem(id: string, updates: Partial<MenuItem>): boolean {
    const index = this.menuItems.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.menuItems[index] = { ...this.menuItems[index], ...updates };
    this.notify('menu_item_updated', { id, updates });
    return true;
  }

  // Get restaurant statistics
  getRestaurantStats(restaurantId: string): {
    totalItems: number;
    categories: number;
    avgPrice: number;
    vegetarianCount: number;
    veganCount: number;
  } {
    const items = this.getMenuItems(restaurantId);
    
    return {
      totalItems: items.length,
      categories: this.getMenuCategories(restaurantId).length,
      avgPrice: items.reduce((sum, item) => sum + item.price, 0) / items.length || 0,
      vegetarianCount: items.filter(item => item.isVegetarian).length,
      veganCount: items.filter(item => item.isVegan).length,
    };
  }
}

// Export singleton instance
export const restaurantService = new RestaurantService();