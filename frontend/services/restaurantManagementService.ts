/**
 * Restaurant Management Service - Handles restaurant-side operations
 * For restaurant owners/managers to manage their business
 */

export interface RestaurantProfile {
  id: string;
  ownerId: string;
  businessName: string;
  description: string;
  category: string;
  cuisineTypes: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours: {
    [key: string]: { // 'monday', 'tuesday', etc.
      isOpen: boolean;
      openTime: string; // "09:00"
      closeTime: string; // "22:00"
    };
  };
  settings: {
    isActive: boolean;
    acceptsOrders: boolean;
    deliveryRadius: number; // in km
    minimumOrder: number;
    deliveryFee: number;
    estimatedPrepTime: number; // in minutes
    taxRate: number;
  };
  paymentInfo: {
    bankAccount?: string;
    commissionRate: number; // Platform commission %
    payoutSchedule: 'weekly' | 'bi-weekly' | 'monthly';
  };
  documents: {
    businessLicense?: string;
    foodHandlersCertificate?: string;
    taxId?: string;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemManagement {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number; // Cost to make (for profit calculation)
  images: string[];
  isAvailable: boolean;
  isPopular: boolean;
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isSpicy: boolean;
    spiceLevel?: number; // 1-5
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preparationTime: number; // in minutes
  ingredients: string[];
  allergens: string[];
  customizations: MenuCustomization[];
  tags: string[];
  inventory?: {
    trackInventory: boolean;
    currentStock?: number;
    lowStockAlert?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MenuCustomization {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'quantity';
  isRequired: boolean;
  options: {
    id: string;
    name: string;
    priceModifier: number; // Can be negative for discounts
  }[];
}

export interface RestaurantOrder {
  id: string;
  restaurantId: string;
  customerId: string;
  customerInfo: {
    name: string;
    phone: string;
    deliveryAddress: string;
  };
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    customizations?: any;
    specialInstructions?: string;
  }[];
  pricing: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    platformFee: number;
    total: number;
    restaurantEarnings: number; // After commission
  };
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled' | 'rejected';
  timestamps: {
    ordered: string;
    accepted?: string;
    preparing?: string;
    ready?: string;
    pickedUp?: string;
    delivered?: string;
    cancelled?: string;
  };
  estimatedPrepTime: number;
  specialInstructions?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryType: 'delivery' | 'pickup';
  assignedRider?: string;
}

export interface RestaurantAnalytics {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  metrics: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingItems: {
      itemId: string;
      name: string;
      quantity: number;
      revenue: number;
    }[];
    customerStats: {
      newCustomers: number;
      returningCustomers: number;
      customerRetentionRate: number;
    };
    performanceMetrics: {
      averagePrepTime: number;
      onTimeDeliveryRate: number;
      customerSatisfactionScore: number;
    };
    financials: {
      grossRevenue: number;
      platformCommission: number;
      netRevenue: number;
      averageProfitMargin: number;
    };
  };
}

class RestaurantManagementService {
  private restaurantProfile: RestaurantProfile | null = null;
  private menuItems: MenuItemManagement[] = [];
  private orders: RestaurantOrder[] = [];
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Subscribe to restaurant management events
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
    this.restaurantProfile = {
      id: 'rest_001',
      ownerId: 'restaurant_456',
      businessName: 'Pizza Palace',
      description: 'Authentic Italian pizza made with fresh ingredients and traditional recipes.',
      category: 'Italian',
      cuisineTypes: ['Italian', 'Pizza', 'Pasta'],
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
      contactInfo: {
        phone: '+1234567891',
        email: 'contact@pizzapalace.com',
        website: 'https://pizzapalace.com',
      },
      businessHours: {
        monday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        tuesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        wednesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        thursday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        friday: { isOpen: true, openTime: '11:00', closeTime: '00:00' },
        saturday: { isOpen: true, openTime: '11:00', closeTime: '00:00' },
        sunday: { isOpen: true, openTime: '12:00', closeTime: '22:00' },
      },
      settings: {
        isActive: true,
        acceptsOrders: true,
        deliveryRadius: 5,
        minimumOrder: 15,
        deliveryFee: 2.99,
        estimatedPrepTime: 25,
        taxRate: 8.5,
      },
      paymentInfo: {
        bankAccount: '****1234',
        commissionRate: 15,
        payoutSchedule: 'weekly',
      },
      documents: {
        businessLicense: 'BL123456',
        foodHandlersCertificate: 'FHC789012',
        taxId: 'TAX345678',
      },
      rating: {
        average: 4.5,
        totalReviews: 342,
      },
      isVerified: true,
      verificationStatus: 'approved',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    };

    this.menuItems = [
      {
        id: 'item_001',
        restaurantId: 'rest_001',
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with tomato sauce, mozzarella, and fresh basil',
        category: 'Pizza',
        price: 16.99,
        cost: 5.50,
        images: ['https://example.com/margherita.jpg'],
        isAvailable: true,
        isPopular: true,
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false,
        },
        nutritionalInfo: {
          calories: 280,
          protein: 12,
          carbs: 35,
          fat: 10,
        },
        preparationTime: 15,
        ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Fresh basil', 'Olive oil'],
        allergens: ['Gluten', 'Dairy'],
        customizations: [
          {
            id: 'size',
            name: 'Size',
            type: 'radio',
            isRequired: true,
            options: [
              { id: 'small', name: 'Small (10")', priceModifier: -2 },
              { id: 'medium', name: 'Medium (12")', priceModifier: 0 },
              { id: 'large', name: 'Large (14")', priceModifier: 3 },
            ],
          },
          {
            id: 'extra-toppings',
            name: 'Extra Toppings',
            type: 'checkbox',
            isRequired: false,
            options: [
              { id: 'extra-cheese', name: 'Extra Cheese', priceModifier: 1.5 },
              { id: 'pepperoni', name: 'Pepperoni', priceModifier: 2 },
              { id: 'mushrooms', name: 'Mushrooms', priceModifier: 1 },
            ],
          },
        ],
        tags: ['bestseller', 'vegetarian'],
        inventory: {
          trackInventory: false,
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item_002',
        restaurantId: 'rest_001',
        name: 'Pepperoni Pizza',
        description: 'Traditional pepperoni pizza with mozzarella cheese',
        category: 'Pizza',
        price: 19.99,
        cost: 6.20,
        images: ['https://example.com/pepperoni.jpg'],
        isAvailable: true,
        isPopular: true,
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false,
        },
        preparationTime: 15,
        ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Pepperoni'],
        allergens: ['Gluten', 'Dairy'],
        customizations: [
          {
            id: 'size',
            name: 'Size',
            type: 'radio',
            isRequired: true,
            options: [
              { id: 'small', name: 'Small (10")', priceModifier: -2 },
              { id: 'medium', name: 'Medium (12")', priceModifier: 0 },
              { id: 'large', name: 'Large (14")', priceModifier: 3 },
            ],
          },
        ],
        tags: ['bestseller'],
        inventory: {
          trackInventory: false,
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      },
    ];

    this.orders = [
      {
        id: 'ord_001',
        restaurantId: 'rest_001',
        customerId: 'customer_123',
        customerInfo: {
          name: 'John Doe',
          phone: '+1234567890',
          deliveryAddress: '123 Customer St, New York, NY 10001',
        },
        items: [
          {
            menuItemId: 'item_001',
            name: 'Margherita Pizza (Medium)',
            price: 16.99,
            quantity: 2,
            customizations: { size: 'medium' },
          },
        ],
        pricing: {
          subtotal: 33.98,
          tax: 2.89,
          deliveryFee: 2.99,
          platformFee: 1.70,
          total: 41.56,
          restaurantEarnings: 28.88,
        },
        status: 'new',
        timestamps: {
          ordered: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        },
        estimatedPrepTime: 25,
        paymentStatus: 'paid',
        deliveryType: 'delivery',
      },
    ];
  }

  // Get restaurant profile
  getRestaurantProfile(): RestaurantProfile | null {
    return this.restaurantProfile;
  }

  // Update restaurant profile
  async updateRestaurantProfile(updates: Partial<RestaurantProfile>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this.restaurantProfile) {
        return { success: false, message: 'No restaurant profile found' };
      }

      this.restaurantProfile = { 
        ...this.restaurantProfile, 
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.notify('restaurant_profile_updated', this.restaurantProfile);

      return {
        success: true,
        message: 'Restaurant profile updated successfully',
      };
    } catch (error) {
      console.error('Error updating restaurant profile:', error);
      return {
        success: false,
        message: 'Failed to update restaurant profile',
      };
    }
  }

  // Get all menu items
  getMenuItems(): MenuItemManagement[] {
    return [...this.menuItems];
  }

  // Add new menu item
  async addMenuItem(item: Omit<MenuItemManagement, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>): Promise<{
    success: boolean;
    message: string;
    itemId?: string;
  }> {
    try {
      const newItem: MenuItemManagement = {
        ...item,
        id: `item_${Date.now()}`,
        restaurantId: this.restaurantProfile?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.menuItems.push(newItem);
      this.notify('menu_item_added', newItem);

      return {
        success: true,
        message: 'Menu item added successfully',
        itemId: newItem.id,
      };
    } catch (error) {
      console.error('Error adding menu item:', error);
      return {
        success: false,
        message: 'Failed to add menu item',
      };
    }
  }

  // Update menu item
  async updateMenuItem(itemId: string, updates: Partial<MenuItemManagement>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const index = this.menuItems.findIndex(item => item.id === itemId);
      if (index === -1) {
        return { success: false, message: 'Menu item not found' };
      }

      this.menuItems[index] = {
        ...this.menuItems[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.notify('menu_item_updated', { itemId, updates });

      return {
        success: true,
        message: 'Menu item updated successfully',
      };
    } catch (error) {
      console.error('Error updating menu item:', error);
      return {
        success: false,
        message: 'Failed to update menu item',
      };
    }
  }

  // Toggle menu item availability
  async toggleItemAvailability(itemId: string): Promise<{
    success: boolean;
    message: string;
    isAvailable?: boolean;
  }> {
    try {
      const item = this.menuItems.find(item => item.id === itemId);
      if (!item) {
        return { success: false, message: 'Menu item not found' };
      }

      item.isAvailable = !item.isAvailable;
      item.updatedAt = new Date().toISOString();

      this.notify('menu_item_availability_changed', { itemId, isAvailable: item.isAvailable });

      return {
        success: true,
        message: `Menu item ${item.isAvailable ? 'enabled' : 'disabled'} successfully`,
        isAvailable: item.isAvailable,
      };
    } catch (error) {
      console.error('Error toggling item availability:', error);
      return {
        success: false,
        message: 'Failed to update item availability',
      };
    }
  }

  // Delete menu item
  async deleteMenuItem(itemId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const index = this.menuItems.findIndex(item => item.id === itemId);
      if (index === -1) {
        return { success: false, message: 'Menu item not found' };
      }

      const deletedItem = this.menuItems.splice(index, 1)[0];
      this.notify('menu_item_deleted', deletedItem);

      return {
        success: true,
        message: 'Menu item deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return {
        success: false,
        message: 'Failed to delete menu item',
      };
    }
  }

  // Get orders for restaurant
  getOrders(status?: RestaurantOrder['status']): RestaurantOrder[] {
    let orders = [...this.orders];
    
    if (status) {
      orders = orders.filter(order => order.status === status);
    }

    return orders.sort((a, b) => new Date(b.timestamps.ordered).getTime() - new Date(a.timestamps.ordered).getTime());
  }

  // Accept order
  async acceptOrder(orderId: string, estimatedPrepTime?: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const order = this.orders.find(o => o.id === orderId);
      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      if (order.status !== 'new') {
        return { success: false, message: 'Order cannot be accepted in current status' };
      }

      order.status = 'accepted';
      order.timestamps.accepted = new Date().toISOString();
      
      if (estimatedPrepTime) {
        order.estimatedPrepTime = estimatedPrepTime;
      }

      this.notify('order_accepted', { orderId, estimatedPrepTime });

      // Auto-transition to preparing after 2 minutes
      setTimeout(() => {
        this.updateOrderStatus(orderId, 'preparing');
      }, 2 * 60 * 1000);

      return {
        success: true,
        message: 'Order accepted successfully',
      };
    } catch (error) {
      console.error('Error accepting order:', error);
      return {
        success: false,
        message: 'Failed to accept order',
      };
    }
  }

  // Reject order
  async rejectOrder(orderId: string, reason: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const order = this.orders.find(o => o.id === orderId);
      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      if (order.status !== 'new') {
        return { success: false, message: 'Order cannot be rejected in current status' };
      }

      order.status = 'rejected';
      order.timestamps.cancelled = new Date().toISOString();

      this.notify('order_rejected', { orderId, reason });

      return {
        success: true,
        message: 'Order rejected successfully',
      };
    } catch (error) {
      console.error('Error rejecting order:', error);
      return {
        success: false,
        message: 'Failed to reject order',
      };
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: RestaurantOrder['status']): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const order = this.orders.find(o => o.id === orderId);
      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      const previousStatus = order.status;
      order.status = status;

      // Update timestamps
      const now = new Date().toISOString();
      switch (status) {
        case 'preparing':
          order.timestamps.preparing = now;
          break;
        case 'ready':
          order.timestamps.ready = now;
          break;
        case 'picked_up':
          order.timestamps.pickedUp = now;
          break;
        case 'delivered':
          order.timestamps.delivered = now;
          break;
        case 'cancelled':
          order.timestamps.cancelled = now;
          break;
      }

      this.notify('order_status_updated', { orderId, status, previousStatus });

      return {
        success: true,
        message: `Order status updated to ${status}`,
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        message: 'Failed to update order status',
      };
    }
  }

  // Toggle restaurant online status
  async toggleRestaurantStatus(): Promise<{
    success: boolean;
    message: string;
    acceptsOrders?: boolean;
  }> {
    try {
      if (!this.restaurantProfile) {
        return { success: false, message: 'No restaurant profile found' };
      }

      this.restaurantProfile.settings.acceptsOrders = !this.restaurantProfile.settings.acceptsOrders;
      this.restaurantProfile.updatedAt = new Date().toISOString();

      this.notify('restaurant_status_changed', { 
        acceptsOrders: this.restaurantProfile.settings.acceptsOrders 
      });

      return {
        success: true,
        message: `Restaurant is now ${this.restaurantProfile.settings.acceptsOrders ? 'online' : 'offline'}`,
        acceptsOrders: this.restaurantProfile.settings.acceptsOrders,
      };
    } catch (error) {
      console.error('Error toggling restaurant status:', error);
      return {
        success: false,
        message: 'Failed to update restaurant status',
      };
    }
  }

  // Get restaurant analytics
  async getAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<RestaurantAnalytics | null> {
    try {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'daily':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      // Filter orders for the period
      const periodOrders = this.orders.filter(order => 
        new Date(order.timestamps.ordered) >= startDate
      );

      const completedOrders = periodOrders.filter(order => order.status === 'delivered');
      const cancelledOrders = periodOrders.filter(order => order.status === 'cancelled' || order.status === 'rejected');

      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.pricing.restaurantEarnings, 0);
      const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

      // Calculate top selling items
      const itemSales = new Map();
      completedOrders.forEach(order => {
        order.items.forEach(item => {
          const existing = itemSales.get(item.menuItemId) || { 
            itemId: item.menuItemId, 
            name: item.name, 
            quantity: 0, 
            revenue: 0 
          };
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
          itemSales.set(item.menuItemId, existing);
        });
      });

      const topSellingItems = Array.from(itemSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      const analytics: RestaurantAnalytics = {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        metrics: {
          totalOrders: periodOrders.length,
          completedOrders: completedOrders.length,
          cancelledOrders: cancelledOrders.length,
          totalRevenue,
          averageOrderValue,
          topSellingItems,
          customerStats: {
            newCustomers: Math.floor(completedOrders.length * 0.3), // Mock calculation
            returningCustomers: Math.floor(completedOrders.length * 0.7),
            customerRetentionRate: 70,
          },
          performanceMetrics: {
            averagePrepTime: 22,
            onTimeDeliveryRate: 85,
            customerSatisfactionScore: 4.3,
          },
          financials: {
            grossRevenue: completedOrders.reduce((sum, order) => sum + order.pricing.total, 0),
            platformCommission: completedOrders.reduce((sum, order) => sum + order.pricing.platformFee, 0),
            netRevenue: totalRevenue,
            averageProfitMargin: 65,
          },
        },
      };

      return analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }

  // Get order statistics
  getOrderStats(): {
    newOrders: number;
    preparingOrders: number;
    readyOrders: number;
    totalToday: number;
    revenueToday: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = this.orders.filter(order => 
      new Date(order.timestamps.ordered) >= today
    );

    return {
      newOrders: this.orders.filter(o => o.status === 'new').length,
      preparingOrders: this.orders.filter(o => o.status === 'preparing').length,
      readyOrders: this.orders.filter(o => o.status === 'ready').length,
      totalToday: todayOrders.length,
      revenueToday: todayOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.pricing.restaurantEarnings, 0),
    };
  }

  // Simulate new order arrival
  simulateNewOrder(): void {
    const mockOrder: RestaurantOrder = {
      id: `ord_${Date.now()}`,
      restaurantId: this.restaurantProfile?.id || '',
      customerId: `customer_${Math.random().toString(36).substr(2, 9)}`,
      customerInfo: {
        name: 'New Customer',
        phone: '+1234567890',
        deliveryAddress: '456 Customer Ave, New York, NY 10002',
      },
      items: [
        {
          menuItemId: 'item_001',
          name: 'Margherita Pizza (Large)',
          price: 19.99,
          quantity: 1,
        },
      ],
      pricing: {
        subtotal: 19.99,
        tax: 1.70,
        deliveryFee: 2.99,
        platformFee: 1.00,
        total: 25.68,
        restaurantEarnings: 16.99,
      },
      status: 'new',
      timestamps: {
        ordered: new Date().toISOString(),
      },
      estimatedPrepTime: 25,
      paymentStatus: 'paid',
      deliveryType: 'delivery',
    };

    this.orders.unshift(mockOrder);
    this.notify('new_order_received', mockOrder);
  }
}

// Export singleton instance
export const restaurantManagementService = new RestaurantManagementService();