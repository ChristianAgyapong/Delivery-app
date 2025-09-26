/**
 * Real-time Notifications Service - Push notifications and real-time updates
 * Handles push notifications, in-app notifications, and real-time event broadcasting
 */

export type NotificationType = 
  | 'order_update'
  | 'delivery_update'
  | 'payment_update'
  | 'promotion'
  | 'system_alert'
  | 'chat_message'
  | 'rating_reminder'
  | 'schedule_reminder'
  | 'restaurant_new'
  | 'system'
  | 'payment'
  | 'delivery';

export interface PushNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  icon?: string;
  color?: string;
  actionButton?: {
    text: string;
    action: string;
    params?: Record<string, any>;
  };
  isRead: boolean;
  isPriority: boolean;
  isPinned: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  imageUrl?: string;
}

export interface NotificationPreferences {
  userId: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  deliveryUpdates: boolean;
  promotions: boolean;
  systemAlerts: boolean;
  chatMessages: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  updatedAt: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newRestaurants: boolean;
  systemAlerts: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
}

export interface RealTimeEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  recipients: string[];
}

class NotificationService {
  private notifications: AppNotification[] = [];
  private settings: NotificationSettings;
  private listeners: ((event: string, data: any) => void)[] = [];
  private unreadCount: number = 0;

  constructor() {
    this.settings = {
      pushEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      badgeEnabled: true,
      orderUpdates: true,
      promotions: true,
      newRestaurants: false,
      systemAlerts: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
    };

    this.initializeMockNotifications();
  }

  // Subscribe to notification service events
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

  // Initialize mock notifications
  private initializeMockNotifications(): void {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const userId = 'customer_123';

    this.notifications = [
      {
        id: 'notif1',
        userId,
        type: 'order_update',
        title: 'Order Delivered!',
        message: 'Your order from Pizza Palace has been delivered. Enjoy your meal!',
        data: { orderId: 'ord123', status: 'delivered' },
        isRead: false,
        isPriority: true,
        isPinned: false,
        createdAt: oneHourAgo.toISOString(),
        actionUrl: '/orders/ord123',
      },
      {
        id: 'notif2',
        userId,
        type: 'promotion',
        title: '20% Off Your Next Order',
        message: 'Use code SAVE20 for 20% off orders over $25. Valid until tomorrow!',
        data: { promoCode: 'SAVE20', discount: 20, minOrder: 25 },
        isRead: false,
        isPriority: false,
        isPinned: true,
        createdAt: twoHoursAgo.toISOString(),
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://example.com/promo-20off.jpg',
      },
      {
        id: 'notif3',
        userId,
        type: 'restaurant_new',
        title: 'New Restaurant: Sushi Zen',
        message: 'Fresh sushi just arrived in your area! Check out their grand opening menu.',
        data: { restaurantId: 'rest3' },
        isRead: true,
        isPriority: false,
        isPinned: false,
        createdAt: oneDayAgo.toISOString(),
        actionUrl: '/restaurant/rest3',
        imageUrl: 'https://example.com/sushi-zen.jpg',
      },
      {
        id: 'notif4',
        userId,
        type: 'system',
        title: 'App Update Available',
        message: 'Version 2.1.0 is now available with new features and improvements.',
        data: { version: '2.1.0' },
        isRead: true,
        isPriority: false,
        isPinned: false,
        createdAt: oneDayAgo.toISOString(),
      },
    ];

    this.updateUnreadCount();
  }

  // Get all notifications
  getAllNotifications(): AppNotification[] {
    return [...this.notifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Get unread notifications
  getUnreadNotifications(): AppNotification[] {
    return this.notifications.filter(notif => !notif.isRead);
  }

  // Get notifications by type
  getNotificationsByType(type: AppNotification['type']): AppNotification[] {
    return this.notifications.filter(notif => notif.type === type);
  }

  // Get unread count
  getUnreadCount(): number {
    return this.unreadCount;
  }

  // Mark notification as read
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification || notification.isRead) return false;

    notification.isRead = true;
    this.updateUnreadCount();
    this.notify('notification_read', { notificationId });
    return true;
  }

  // Mark all notifications as read
  markAllAsRead(): number {
    const unreadNotifications = this.notifications.filter(n => !n.isRead);
    unreadNotifications.forEach(n => n.isRead = true);
    
    this.updateUnreadCount();
    this.notify('all_notifications_read', { count: unreadNotifications.length });
    
    return unreadNotifications.length;
  }

  // Delete notification
  deleteNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index === -1) return false;

    const notification = this.notifications[index];
    this.notifications.splice(index, 1);
    
    this.updateUnreadCount();
    this.notify('notification_deleted', { notificationId, notification });
    
    return true;
  }

  // Clear all notifications
  clearAllNotifications(): number {
    const count = this.notifications.length;
    this.notifications = [];
    this.unreadCount = 0;
    
    this.notify('all_notifications_cleared', { count });
    return count;
  }

  // Add new notification
  addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): string {
    const newNotification: AppNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    this.notifications.unshift(newNotification);
    this.updateUnreadCount();
    
    // Check if notification should be shown based on settings
    if (this.shouldShowNotification(newNotification)) {
      this.notify('new_notification', newNotification);
      
      // Trigger push notification if enabled
      if (this.settings.pushEnabled) {
        this.triggerPushNotification(newNotification);
      }
    }

    return newNotification.id;
  }

  // Update unread count
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    this.notify('unread_count_changed', { count: this.unreadCount });
  }

  // Check if notification should be shown based on settings
  private shouldShowNotification(notification: AppNotification): boolean {
    // Check if notification type is enabled
    switch (notification.type) {
      case 'order_update':
        return this.settings.orderUpdates;
      case 'promotion':
        return this.settings.promotions;
      case 'restaurant_new':
        return this.settings.newRestaurants;
      case 'system':
      case 'payment':
      case 'delivery':
        return this.settings.systemAlerts;
      default:
        return true;
    }
  }

  // Check if in quiet hours
  private isInQuietHours(): boolean {
    if (!this.settings.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const start = this.settings.quietHoursStart;
    const end = this.settings.quietHoursEnd;
    
    // Handle case where quiet hours span midnight
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  }

  // Trigger push notification
  private triggerPushNotification(notification: AppNotification): void {
    // Skip if in quiet hours (unless priority)
    if (this.isInQuietHours() && !notification.isPriority) {
      return;
    }

    // In a real app, this would use actual push notification service
    console.log('Push notification triggered:', {
      title: notification.title,
      message: notification.message,
      sound: this.settings.soundEnabled,
      vibration: this.settings.vibrationEnabled,
      badge: this.settings.badgeEnabled ? this.unreadCount : undefined,
    });

    this.notify('push_notification_triggered', notification);
  }

  // Get notification settings
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Update notification settings
  updateSettings(updates: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.notify('settings_updated', this.settings);
  }

  // Request push notification permission
  async requestPushPermission(): Promise<{
    granted: boolean;
    message: string;
  }> {
    try {
      // In a real app, this would request actual permission
      // For now, simulate permission request
      await new Promise(resolve => setTimeout(resolve, 1000));

      const granted = Math.random() > 0.1; // 90% chance of granting permission
      
      if (granted) {
        this.settings.pushEnabled = true;
        this.notify('push_permission_granted');
      } else {
        this.settings.pushEnabled = false;
        this.notify('push_permission_denied');
      }

      return {
        granted,
        message: granted 
          ? 'Push notifications enabled successfully' 
          : 'Push notification permission denied',
      };
    } catch (error) {
      console.error('Error requesting push permission:', error);
      return {
        granted: false,
        message: 'Failed to request permission',
      };
    }
  }

  // Simulate order update notifications
  simulateOrderUpdate(orderId: string, status: string, userId: string = 'customer_123'): void {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      preparing: 'The restaurant is preparing your order.',
      ready: 'Your order is ready for pickup/delivery.',
      picked_up: 'Your order has been picked up by the delivery driver.',
      out_for_delivery: 'Your order is out for delivery.',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'Your order has been cancelled.',
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 
                   `Your order status has been updated to: ${status}`;

    this.addNotification({
      userId,
      type: 'order_update',
      title: 'Order Update',
      message,
      data: { orderId, status },
      isPriority: status === 'delivered' || status === 'cancelled',
      isPinned: false,
      actionUrl: `/orders/${orderId}`,
    });
  }

  // Simulate promotional notifications
  simulatePromotion(promoCode: string, discount: number, minOrder?: number, userId: string = 'customer_123'): void {
    const message = minOrder 
      ? `Use code ${promoCode} for ${discount}% off orders over $${minOrder}!`
      : `Use code ${promoCode} for ${discount}% off your next order!`;

    this.addNotification({
      userId,
      type: 'promotion',
      title: `${discount}% Off Your Next Order`,
      message,
      data: { promoCode, discount, minOrder },
      isPriority: false,
      isPinned: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });
  }

  // Clean up expired notifications
  cleanupExpiredNotifications(): number {
    const now = new Date();
    const initialCount = this.notifications.length;
    
    this.notifications = this.notifications.filter(notification => {
      if (!notification.expiresAt) return true;
      return new Date(notification.expiresAt) > now;
    });

    const removedCount = initialCount - this.notifications.length;
    
    if (removedCount > 0) {
      this.updateUnreadCount();
      this.notify('expired_notifications_cleaned', { count: removedCount });
    }

    return removedCount;
  }

  // Get notification statistics
  getStatistics(): {
    total: number;
    unread: number;
    byType: Record<AppNotification['type'], number>;
    thisWeek: number;
    thisMonth: number;
  } {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const byType: Record<NotificationType, number> = {
      order_update: 0,
      delivery_update: 0,
      payment_update: 0,
      promotion: 0,
      system_alert: 0,
      chat_message: 0,
      rating_reminder: 0,
      schedule_reminder: 0,
      restaurant_new: 0,
      system: 0,
      payment: 0,
      delivery: 0,
    };

    let thisWeek = 0;
    let thisMonth = 0;

    this.notifications.forEach(notification => {
      byType[notification.type]++;
      
      const createdAt = new Date(notification.createdAt);
      if (createdAt >= oneWeekAgo) thisWeek++;
      if (createdAt >= oneMonthAgo) thisMonth++;
    });

    return {
      total: this.notifications.length,
      unread: this.unreadCount,
      byType,
      thisWeek,
      thisMonth,
    };
  }
}

// Export singleton instance
// Real-time connection management
export class RealTimeNotificationService {
  private pushNotifications: PushNotification[] = [];
  private preferences: Map<string, NotificationPreferences> = new Map();
  private listeners: Map<string, ((event: RealTimeEvent) => void)[]> = new Map();
  private connectionStatus: Map<string, boolean> = new Map();

  constructor() {
    this.initializeRealTimeData();
    this.startRealTimeSimulation();
  }

  // Initialize real-time notification data
  private initializeRealTimeData(): void {
    const userId = 'customer_123';

    // Mock notification preferences
    this.preferences.set(userId, {
      userId,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      deliveryUpdates: true,
      promotions: true,
      systemAlerts: true,
      chatMessages: true,
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
      },
      updatedAt: new Date().toISOString(),
    });
  }

  // Start real-time event simulation
  private startRealTimeSimulation(): void {
    setInterval(() => {
      this.simulateRealTimeEvent();
    }, 30000);
  }

  // Simulate random real-time events
  private simulateRealTimeEvent(): void {
    const events = [
      {
        type: 'order_status_changed',
        data: {
          orderId: 'ord_001',
          status: 'preparing',
          restaurantName: 'Pizza Palace',
        },
      },
      {
        type: 'delivery_location_updated',
        data: {
          orderId: 'ord_001',
          riderLocation: {
            latitude: 5.6037 + (Math.random() - 0.5) * 0.01,
            longitude: -0.1870 + (Math.random() - 0.5) * 0.01,
          },
          estimatedTime: Math.floor(Math.random() * 20) + 10,
        },
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const event: RealTimeEvent = {
      id: `event_${Date.now()}`,
      type: randomEvent.type,
      data: randomEvent.data,
      timestamp: new Date().toISOString(),
      recipients: Array.from(this.connectionStatus.keys()),
    };

    this.broadcastEvent(event);
  }

  // Connect user to real-time updates
  connectUser(userId: string, callback: (event: RealTimeEvent) => void): () => void {
    this.connectionStatus.set(userId, true);
    
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, []);
    }
    
    this.listeners.get(userId)!.push(callback);

    // Send connection confirmation
    const connectionEvent: RealTimeEvent = {
      id: `connection_${Date.now()}`,
      type: 'connection_established',
      data: { userId, connectedAt: new Date().toISOString() },
      timestamp: new Date().toISOString(),
      recipients: [userId],
    };
    
    setTimeout(() => callback(connectionEvent), 100);

    // Return disconnect function
    return () => {
      this.disconnectUser(userId, callback);
    };
  }

  // Disconnect user from real-time updates
  disconnectUser(userId: string, callback?: (event: RealTimeEvent) => void): void {
    if (callback && this.listeners.has(userId)) {
      const callbacks = this.listeners.get(userId)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.listeners.delete(userId);
        this.connectionStatus.set(userId, false);
      }
    } else {
      this.listeners.delete(userId);
      this.connectionStatus.set(userId, false);
    }
  }

  // Broadcast event to connected users
  private broadcastEvent(event: RealTimeEvent): void {
    event.recipients.forEach(userId => {
      if (this.connectionStatus.get(userId) && this.listeners.has(userId)) {
        this.listeners.get(userId)!.forEach(callback => {
          try {
            callback(event);
          } catch (error) {
            console.error('Error broadcasting event:', error);
          }
        });
      }
    });
  }

  // Send push notification
  async sendPushNotification(notification: Omit<PushNotification, 'id' | 'status' | 'sentAt'>): Promise<{
    success: boolean;
    message: string;
    notificationId?: string;
  }> {
    try {
      const preferences = this.preferences.get(notification.userId);
      
      if (!preferences?.pushNotifications) {
        return { success: false, message: 'Push notifications are disabled for this user' };
      }

      const pushNotification: PushNotification = {
        ...notification,
        id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
      };

      // Simulate push notification sending
      setTimeout(() => {
        pushNotification.status = 'sent';
        pushNotification.sentAt = new Date().toISOString();
        
        setTimeout(() => {
          pushNotification.status = 'delivered';
          pushNotification.deliveredAt = new Date().toISOString();
        }, 1000);
      }, 500);

      this.pushNotifications.unshift(pushNotification);

      return {
        success: true,
        message: 'Push notification sent successfully',
        notificationId: pushNotification.id,
      };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return {
        success: false,
        message: 'Failed to send push notification',
      };
    }
  }

  // Get notification preferences
  getNotificationPreferences(userId: string): NotificationPreferences | null {
    return this.preferences.get(userId) || null;
  }

  // Update notification preferences
  async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const current = this.preferences.get(userId) || {
        userId,
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        deliveryUpdates: true,
        promotions: true,
        systemAlerts: true,
        chatMessages: true,
        quietHours: {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00',
        },
        updatedAt: new Date().toISOString(),
      };

      const updated: NotificationPreferences = {
        ...current,
        ...preferences,
        userId,
        updatedAt: new Date().toISOString(),
      };

      this.preferences.set(userId, updated);

      return {
        success: true,
        message: 'Notification preferences updated successfully',
      };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return {
        success: false,
        message: 'Failed to update notification preferences',
      };
    }
  }
}

export const notificationService = new NotificationService();
export const realTimeNotificationService = new RealTimeNotificationService();