/**
 * Quick Actions Service - Handles all quick action operations
 */

import { cartService } from './cartService';
import { favoritesService } from './favoritesService';
import { ordersService } from './ordersService';

export interface QuickActionResult {
  success: boolean;
  message: string;
  action?: 'navigate' | 'modal' | 'none';
  route?: string;
  data?: any;
}

class QuickActionsService {
  private listeners: ((event: string, data: any) => void)[] = [];

  // Subscribe to quick action events
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

  // Handle reorder action
  async handleReorder(): Promise<QuickActionResult> {
    try {
      const recentOrders = ordersService.getRecentOrders(5);
      
      if (recentOrders.length === 0) {
        return {
          success: true,
          message: 'No recent orders found',
          action: 'navigate',
          route: '/orders',
        };
      }

      // Show reorder modal with options
      this.notify('show_reorder_modal', { orders: recentOrders });
      
      return {
        success: true,
        message: 'Showing reorder options',
        action: 'modal',
        data: { orders: recentOrders },
      };
    } catch (error) {
      console.error('Error handling reorder:', error);
      return {
        success: false,
        message: 'Failed to load recent orders',
      };
    }
  }

  // Execute specific reorder
  async executeReorder(orderId: string): Promise<QuickActionResult> {
    try {
      const reorderResult = ordersService.reorder(orderId);
      
      if (reorderResult.success && reorderResult.items) {
        // Add items to cart
        for (const item of reorderResult.items) {
          cartService.addItem({
            id: item.id,
            restaurantId: orderId, // Use order ID as placeholder
            restaurantName: 'Previous Order',
            itemName: item.name,
            price: item.price,
          }, item.quantity);
        }

        this.notify('reorder_completed', { orderId, items: reorderResult.items });
        
        return {
          success: true,
          message: reorderResult.message,
          action: 'navigate',
          route: '/cart',
        };
      }

      return {
        success: false,
        message: reorderResult.message,
      };
    } catch (error) {
      console.error('Error executing reorder:', error);
      return {
        success: false,
        message: 'Failed to reorder items',
      };
    }
  }

  // Handle schedule action
  async handleSchedule(): Promise<QuickActionResult> {
    try {
      const scheduledOrders = ordersService.getScheduledOrders();
      
      if (scheduledOrders.length === 0) {
        // No scheduled orders, show create new modal
        this.notify('show_schedule_new_modal');
        
        return {
          success: true,
          message: 'Create your first scheduled order',
          action: 'modal',
        };
      }

      // Show existing scheduled orders
      this.notify('show_schedule_modal', { orders: scheduledOrders });
      
      return {
        success: true,
        message: 'Showing scheduled orders',
        action: 'modal',
        data: { orders: scheduledOrders },
      };
    } catch (error) {
      console.error('Error handling schedule:', error);
      return {
        success: false,
        message: 'Failed to load scheduled orders',
      };
    }
  }

  // Create new scheduled order
  async createScheduledOrder(orderData: any): Promise<QuickActionResult> {
    try {
      const result = ordersService.scheduleOrder(orderData);
      
      if (result.success) {
        this.notify('schedule_created', { orderId: result.orderId });
      }
      
      return {
        success: result.success,
        message: result.message,
        action: result.success ? 'navigate' : 'none',
        route: result.success ? '/orders' : undefined,
      };
    } catch (error) {
      console.error('Error creating scheduled order:', error);
      return {
        success: false,
        message: 'Failed to create scheduled order',
      };
    }
  }

  // Handle group order action
  async handleGroupOrder(): Promise<QuickActionResult> {
    try {
      // For now, show info modal since group ordering is a future feature
      this.notify('show_group_order_modal');
      
      return {
        success: true,
        message: 'Group ordering feature',
        action: 'modal',
      };
    } catch (error) {
      console.error('Error handling group order:', error);
      return {
        success: false,
        message: 'Failed to show group order options',
      };
    }
  }

  // Handle favorites action
  async handleFavorites(): Promise<QuickActionResult> {
    try {
      const favoriteCount = favoritesService.getCount();
      
      if (favoriteCount.total === 0) {
        // No favorites yet, show guidance
        this.notify('show_favorites_empty_modal');
        
        return {
          success: true,
          message: 'No favorites yet',
          action: 'modal',
        };
      }

      // Navigate to favorites screen
      return {
        success: true,
        message: 'Opening favorites',
        action: 'navigate',
        route: '/favorites',
      };
    } catch (error) {
      console.error('Error handling favorites:', error);
      return {
        success: false,
        message: 'Failed to load favorites',
      };
    }
  }

  // Get quick actions data for badges
  getQuickActionsData(): {
    reorder: { count: number; hasData: boolean };
    schedule: { count: number; hasData: boolean };
    groupOrder: { count: number; hasData: boolean };
    favorites: { count: number; hasData: boolean };
  } {
    try {
      const recentOrders = ordersService.getRecentOrders(10);
      const scheduledOrders = ordersService.getScheduledOrders();
      const favoriteCount = favoritesService.getCount();

      return {
        reorder: {
          count: recentOrders.length,
          hasData: recentOrders.length > 0,
        },
        schedule: {
          count: scheduledOrders.length,
          hasData: scheduledOrders.length > 0,
        },
        groupOrder: {
          count: 0, // Future feature
          hasData: false,
        },
        favorites: {
          count: favoriteCount.total,
          hasData: favoriteCount.total > 0,
        },
      };
    } catch (error) {
      console.error('Error getting quick actions data:', error);
      return {
        reorder: { count: 0, hasData: false },
        schedule: { count: 0, hasData: false },
        groupOrder: { count: 0, hasData: false },
        favorites: { count: 0, hasData: false },
      };
    }
  }

  // Handle notification actions
  async handleNotificationTap(): Promise<QuickActionResult> {
    try {
      // Navigate to notifications or orders screen
      return {
        success: true,
        message: 'Opening notifications',
        action: 'navigate',
        route: '/orders', // Or dedicated notifications screen
      };
    } catch (error) {
      console.error('Error handling notification tap:', error);
      return {
        success: false,
        message: 'Failed to open notifications',
      };
    }
  }

  // Handle cart action
  async handleCartTap(): Promise<QuickActionResult> {
    try {
      const cart = cartService.getCart();
      
      if (cart.items.length === 0) {
        return {
          success: true,
          message: 'Cart is empty',
          action: 'none',
        };
      }

      return {
        success: true,
        message: 'Opening cart',
        action: 'navigate',
        route: '/cart',
      };
    } catch (error) {
      console.error('Error handling cart tap:', error);
      return {
        success: false,
        message: 'Failed to open cart',
      };
    }
  }

  // Handle search action
  async handleSearch(query: string = ''): Promise<QuickActionResult> {
    try {
      if (query.trim()) {
        // Navigate to search with query
        return {
          success: true,
          message: 'Searching...',
          action: 'navigate',
          route: `/search?q=${encodeURIComponent(query)}`,
        };
      }

      // Navigate to search screen
      return {
        success: true,
        message: 'Opening search',
        action: 'navigate',
        route: '/search',
      };
    } catch (error) {
      console.error('Error handling search:', error);
      return {
        success: false,
        message: 'Failed to perform search',
      };
    }
  }

  // Handle filter action
  async handleFilter(): Promise<QuickActionResult> {
    try {
      // Navigate to advanced search/filter screen
      return {
        success: true,
        message: 'Opening filters',
        action: 'navigate',
        route: '/search',
      };
    } catch (error) {
      console.error('Error handling filter:', error);
      return {
        success: false,
        message: 'Failed to open filters',
      };
    }
  }

  // Handle location change
  async handleLocationChange(): Promise<QuickActionResult> {
    try {
      // Show location selection modal
      this.notify('show_location_modal');
      
      return {
        success: true,
        message: 'Select delivery location',
        action: 'modal',
      };
    } catch (error) {
      console.error('Error handling location change:', error);
      return {
        success: false,
        message: 'Failed to change location',
      };
    }
  }

  // Clear all modals
  clearModals(): void {
    this.notify('clear_modals');
  }
}

// Export singleton instance
export const quickActionsService = new QuickActionsService();