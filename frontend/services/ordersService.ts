/**
 * Orders Service - Handles all order-related operations
 */

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  paymentMethod: string;
  promoCode?: string;
  discount: number;
  driverInfo?: {
    name: string;
    phone: string;
    rating: number;
  };
}

export interface ScheduledOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  scheduledFor: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  items: OrderItem[];
  total: number;
  createdDate: string;
}

class OrdersService {
  private orders: Order[] = [];
  private scheduledOrders: ScheduledOrder[] = [];
  private listeners: ((data: { orders: Order[]; scheduledOrders: ScheduledOrder[] }) => void)[] = [];

  constructor() {
    // Initialize with demo orders
    this.initializeDemoOrders();
  }

  private initializeDemoOrders() {
    const now = new Date();
    
    // Recent completed orders
    this.orders = [
      {
        id: 'order_1',
        restaurantId: '1',
        restaurantName: 'Tony\'s Pizza Palace',
        restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&w=400',
        items: [
          { id: 'item_1', name: 'Margherita Pizza', price: 18.99, quantity: 1 },
          { id: 'item_2', name: 'Garlic Bread', price: 5.99, quantity: 1 }
        ],
        subtotal: 24.98,
        deliveryFee: 2.99,
        tax: 2.12,
        total: 30.09,
        status: 'delivered',
        orderDate: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
        estimatedDelivery: new Date(now.getTime() - 172800000 + 2700000).toISOString(), // 45 min later
        deliveryAddress: '123 Main St, Downtown',
        paymentMethod: 'Credit Card ending in 1234',
        discount: 0,
      },
      {
        id: 'order_2',
        restaurantId: '2',
        restaurantName: 'Burger Junction',
        restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&w=400',
        items: [
          { id: 'item_3', name: 'Classic Burger', price: 12.50, quantity: 1 }
        ],
        subtotal: 12.50,
        deliveryFee: 1.99,
        tax: 1.06,
        total: 15.55,
        status: 'delivered',
        orderDate: new Date(now.getTime() - 432000000).toISOString(), // 5 days ago
        estimatedDelivery: new Date(now.getTime() - 432000000 + 1800000).toISOString(), // 30 min later
        deliveryAddress: '123 Main St, Downtown',
        paymentMethod: 'PayPal',
        discount: 0,
      }
    ];

    // Scheduled orders
    this.scheduledOrders = [
      {
        id: 'scheduled_1',
        restaurantId: '3',
        restaurantName: 'Sakura Sushi',
        scheduledFor: new Date(now.getTime() + 86400000 + 68400000).toISOString(), // Tomorrow 7 PM
        status: 'scheduled',
        items: [
          { id: 'item_4', name: 'Salmon Roll', price: 15.99, quantity: 2 },
          { id: 'item_5', name: 'Miso Soup', price: 4.99, quantity: 1 }
        ],
        total: 36.97,
        createdDate: new Date().toISOString(),
      }
    ];
  }

  // Subscribe to order changes
  subscribe(callback: (data: { orders: Order[]; scheduledOrders: ScheduledOrder[] }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener({
      orders: this.orders,
      scheduledOrders: this.scheduledOrders,
    }));
  }

  // Place a new order
  placeOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): { success: boolean; orderId?: string; message: string } {
    try {
      const orderId = 'order_' + Date.now();
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        orderDate: new Date().toISOString(),
        status: 'pending',
      };

      this.orders.unshift(newOrder); // Add to beginning for recent orders
      this.notifyListeners();

      // Simulate order progression
      this.simulateOrderProgress(orderId);

      return {
        success: true,
        orderId,
        message: 'Order placed successfully!',
      };
    } catch (error) {
      console.error('Error placing order:', error);
      return {
        success: false,
        message: 'Failed to place order. Please try again.',
      };
    }
  }

  // Schedule an order
  scheduleOrder(orderData: Omit<ScheduledOrder, 'id' | 'createdDate' | 'status'>): { success: boolean; orderId?: string; message: string } {
    try {
      const orderId = 'scheduled_' + Date.now();
      const scheduledOrder: ScheduledOrder = {
        ...orderData,
        id: orderId,
        createdDate: new Date().toISOString(),
        status: 'scheduled',
      };

      this.scheduledOrders.push(scheduledOrder);
      this.notifyListeners();

      return {
        success: true,
        orderId,
        message: 'Order scheduled successfully!',
      };
    } catch (error) {
      console.error('Error scheduling order:', error);
      return {
        success: false,
        message: 'Failed to schedule order. Please try again.',
      };
    }
  }

  // Simulate order status progression
  private simulateOrderProgress(orderId: string) {
    const statuses: Order['status'][] = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    let currentIndex = 0;

    const progressInterval = setInterval(() => {
      if (currentIndex < statuses.length) {
        this.updateOrderStatus(orderId, statuses[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(progressInterval);
      }
    }, 5000); // Update every 5 seconds for demo
  }

  // Update order status
  updateOrderStatus(orderId: string, status: Order['status']): boolean {
    try {
      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      if (orderIndex >= 0) {
        this.orders[orderIndex].status = status;
        
        // Add driver info when out for delivery
        if (status === 'out_for_delivery') {
          this.orders[orderIndex].driverInfo = {
            name: 'John Smith',
            phone: '+1 (555) 123-4567',
            rating: 4.8,
          };
        }
        
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Cancel order
  cancelOrder(orderId: string, reason?: string): { success: boolean; message: string } {
    try {
      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      if (orderIndex >= 0) {
        const order = this.orders[orderIndex];
        
        // Check if order can be cancelled
        if (['delivered', 'out_for_delivery'].includes(order.status)) {
          return {
            success: false,
            message: 'Cannot cancel order that is already out for delivery or delivered.',
          };
        }

        order.status = 'cancelled';
        this.notifyListeners();
        
        return {
          success: true,
          message: 'Order cancelled successfully.',
        };
      }

      // Try scheduled orders
      const scheduledIndex = this.scheduledOrders.findIndex(order => order.id === orderId);
      if (scheduledIndex >= 0) {
        this.scheduledOrders[scheduledIndex].status = 'cancelled';
        this.notifyListeners();
        
        return {
          success: true,
          message: 'Scheduled order cancelled successfully.',
        };
      }

      return {
        success: false,
        message: 'Order not found.',
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        message: 'Failed to cancel order. Please try again.',
      };
    }
  }

  // Reorder items
  reorder(orderId: string): { success: boolean; items?: OrderItem[]; message: string } {
    try {
      const order = this.orders.find(order => order.id === orderId);
      if (order) {
        return {
          success: true,
          items: order.items,
          message: 'Items added to cart for reorder.',
        };
      }

      return {
        success: false,
        message: 'Order not found.',
      };
    } catch (error) {
      console.error('Error reordering:', error);
      return {
        success: false,
        message: 'Failed to reorder. Please try again.',
      };
    }
  }

  // Get orders by status
  getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  // Get recent orders
  getRecentOrders(limit: number = 10): Order[] {
    return this.orders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, limit);
  }

  // Get ongoing orders
  getOngoingOrders(): Order[] {
    return this.orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
    );
  }

  // Get order by ID
  getOrderById(orderId: string): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }

  // Get scheduled orders
  getScheduledOrders(): ScheduledOrder[] {
    return this.scheduledOrders
      .filter(order => order.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  }

  // Get all orders
  getAllOrders(): Order[] {
    return [...this.orders].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }

  // Get order statistics
  getOrderStats(): {
    total: number;
    ongoing: number;
    delivered: number;
    cancelled: number;
    scheduled: number;
    totalSpent: number;
  } {
    const deliveredOrders = this.orders.filter(order => order.status === 'delivered');
    const totalSpent = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      total: this.orders.length,
      ongoing: this.getOngoingOrders().length,
      delivered: deliveredOrders.length,
      cancelled: this.orders.filter(order => order.status === 'cancelled').length,
      scheduled: this.scheduledOrders.filter(order => order.status === 'scheduled').length,
      totalSpent,
    };
  }

  // Search orders
  searchOrders(query: string): Order[] {
    const lowerQuery = query.toLowerCase();
    return this.orders.filter(order =>
      order.restaurantName.toLowerCase().includes(lowerQuery) ||
      order.items.some(item => item.name.toLowerCase().includes(lowerQuery)) ||
      order.id.toLowerCase().includes(lowerQuery)
    );
  }
}

// Export singleton instance
export const ordersService = new OrdersService();