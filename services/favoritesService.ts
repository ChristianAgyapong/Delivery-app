/**
 * Favorites Service - Handles all favorites-related operations
 */

export interface FavoriteRestaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: number;
  dateAdded: string;
}

export interface FavoriteItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  itemName: string;
  price: number;
  image?: string;
  dateAdded: string;
}

class FavoritesService {
  private favoriteRestaurants: FavoriteRestaurant[] = [];
  private favoriteItems: FavoriteItem[] = [];
  private listeners: ((favorites: { restaurants: FavoriteRestaurant[]; items: FavoriteItem[] }) => void)[] = [];

  constructor() {
    // Initialize with some demo favorites
    this.favoriteRestaurants = [
      {
        id: '1',
        name: 'Tony\'s Pizza Palace',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&w=400',
        rating: 4.5,
        cuisine: 'Italian',
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        dateAdded: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: '3',
        name: 'Sakura Sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&w=400',
        rating: 4.7,
        cuisine: 'Japanese',
        deliveryTime: '30-40 min',
        deliveryFee: 3.99,
        dateAdded: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ];
  }

  // Subscribe to favorites changes
  subscribe(callback: (favorites: { restaurants: FavoriteRestaurant[]; items: FavoriteItem[] }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener({
      restaurants: this.favoriteRestaurants,
      items: this.favoriteItems,
    }));
  }

  // Add restaurant to favorites
  addRestaurant(restaurant: Omit<FavoriteRestaurant, 'dateAdded'>): boolean {
    try {
      const exists = this.favoriteRestaurants.find(fav => fav.id === restaurant.id);
      if (exists) {
        return false; // Already in favorites
      }

      const favoriteRestaurant: FavoriteRestaurant = {
        ...restaurant,
        dateAdded: new Date().toISOString(),
      };

      this.favoriteRestaurants.push(favoriteRestaurant);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error adding restaurant to favorites:', error);
      return false;
    }
  }

  // Remove restaurant from favorites
  removeRestaurant(restaurantId: string): boolean {
    try {
      const initialLength = this.favoriteRestaurants.length;
      this.favoriteRestaurants = this.favoriteRestaurants.filter(fav => fav.id !== restaurantId);
      
      if (this.favoriteRestaurants.length < initialLength) {
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing restaurant from favorites:', error);
      return false;
    }
  }

  // Toggle restaurant favorite status
  toggleRestaurant(restaurant: Omit<FavoriteRestaurant, 'dateAdded'>): boolean {
    const isCurrentlyFavorited = this.isRestaurantFavorited(restaurant.id);
    
    if (isCurrentlyFavorited) {
      return this.removeRestaurant(restaurant.id);
    } else {
      return this.addRestaurant(restaurant);
    }
  }

  // Check if restaurant is favorited
  isRestaurantFavorited(restaurantId: string): boolean {
    return this.favoriteRestaurants.some(fav => fav.id === restaurantId);
  }

  // Add item to favorites
  addItem(item: Omit<FavoriteItem, 'dateAdded'>): boolean {
    try {
      const exists = this.favoriteItems.find(fav => fav.id === item.id);
      if (exists) {
        return false; // Already in favorites
      }

      const favoriteItem: FavoriteItem = {
        ...item,
        dateAdded: new Date().toISOString(),
      };

      this.favoriteItems.push(favoriteItem);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error adding item to favorites:', error);
      return false;
    }
  }

  // Remove item from favorites
  removeItem(itemId: string): boolean {
    try {
      const initialLength = this.favoriteItems.length;
      this.favoriteItems = this.favoriteItems.filter(fav => fav.id !== itemId);
      
      if (this.favoriteItems.length < initialLength) {
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing item from favorites:', error);
      return false;
    }
  }

  // Toggle item favorite status
  toggleItem(item: Omit<FavoriteItem, 'dateAdded'>): boolean {
    const isCurrentlyFavorited = this.isItemFavorited(item.id);
    
    if (isCurrentlyFavorited) {
      return this.removeItem(item.id);
    } else {
      return this.addItem(item);
    }
  }

  // Check if item is favorited
  isItemFavorited(itemId: string): boolean {
    return this.favoriteItems.some(fav => fav.id === itemId);
  }

  // Get all favorite restaurants
  getFavoriteRestaurants(): FavoriteRestaurant[] {
    return [...this.favoriteRestaurants].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }

  // Get all favorite items
  getFavoriteItems(): FavoriteItem[] {
    return [...this.favoriteItems].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }

  // Get favorite restaurant IDs (for quick lookup)
  getFavoriteRestaurantIds(): string[] {
    return this.favoriteRestaurants.map(fav => fav.id);
  }

  // Get favorite item IDs (for quick lookup)
  getFavoriteItemIds(): string[] {
    return this.favoriteItems.map(fav => fav.id);
  }

  // Get favorites count
  getCount(): { restaurants: number; items: number; total: number } {
    return {
      restaurants: this.favoriteRestaurants.length,
      items: this.favoriteItems.length,
      total: this.favoriteRestaurants.length + this.favoriteItems.length,
    };
  }

  // Search favorites
  searchFavorites(query: string): { restaurants: FavoriteRestaurant[]; items: FavoriteItem[] } {
    const lowerQuery = query.toLowerCase();
    
    const restaurants = this.favoriteRestaurants.filter(
      restaurant => 
        restaurant.name.toLowerCase().includes(lowerQuery) ||
        restaurant.cuisine.toLowerCase().includes(lowerQuery)
    );

    const items = this.favoriteItems.filter(
      item => 
        item.itemName.toLowerCase().includes(lowerQuery) ||
        item.restaurantName.toLowerCase().includes(lowerQuery)
    );

    return { restaurants, items };
  }

  // Clear all favorites
  clearAll(): void {
    this.favoriteRestaurants = [];
    this.favoriteItems = [];
    this.notifyListeners();
  }

  // Import favorites from backup
  importFavorites(data: { restaurants: FavoriteRestaurant[]; items: FavoriteItem[] }): boolean {
    try {
      this.favoriteRestaurants = data.restaurants || [];
      this.favoriteItems = data.items || [];
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error importing favorites:', error);
      return false;
    }
  }

  // Export favorites for backup
  exportFavorites(): { restaurants: FavoriteRestaurant[]; items: FavoriteItem[] } {
    return {
      restaurants: this.favoriteRestaurants,
      items: this.favoriteItems,
    };
  }
}

// Export singleton instance
export const favoritesService = new FavoritesService();