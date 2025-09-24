/**
 * Services Index - Central export for all app services
 * 
 * This file provides a centralized way to import all services used throughout the app.
 * Each service is implemented as a singleton to ensure consistent state management.
 */

// Import all services
import { cartService } from './cartService';
import { favoritesService } from './favoritesService';
import { locationService } from './locationService';
import { notificationService, realTimeNotificationService } from './notificationService';
import { ordersService } from './ordersService';
import { quickActionsService } from './quickActionsService';
import { restaurantService } from './restaurantService';
import { userService } from './userService';
import { authService } from './authService';
import { restaurantManagementService } from './restaurantManagementService';
import { deliveryManagementService } from './deliveryManagementService';
import { paymentService } from './paymentService';
import { adminManagementService } from './adminManagementService';

// Export all services
export { 
  cartService, 
  favoritesService, 
  locationService, 
  notificationService, 
  realTimeNotificationService,
  ordersService, 
  quickActionsService, 
  restaurantService, 
  userService,
  authService,
  restaurantManagementService,
  deliveryManagementService,
  paymentService,
  adminManagementService
};

// Export types for use in components
export type { Cart, CartItem } from './cartService';
export type { FavoriteItem, FavoriteRestaurant } from './favoritesService';
export type { DeliveryAddress, LocationPermission } from './locationService';
export type { AppNotification, NotificationSettings, PushNotification, NotificationPreferences, RealTimeEvent } from './notificationService';
export type { Order, ScheduledOrder } from './ordersService';
export type { QuickActionResult } from './quickActionsService';
export type { MenuItem, Restaurant, RestaurantFilters } from './restaurantService';
export type { PaymentMethod, User, UserPreferences, UserStats } from './userService';
export type { UserRole, AuthUser } from './authService';
export type { RestaurantProfile, MenuItemManagement, RestaurantOrder } from './restaurantManagementService';
export type { DeliveryRider, DeliveryRequest } from './deliveryManagementService';
export type { PaymentTransaction, WalletBalance } from './paymentService';
export type { AdminUser, PlatformStats, UserManagement, RestaurantOversight, Dispute } from './adminManagementService';

/**
 * Service Layer Architecture Overview:
 * 
 * 1. cartService - Complete cart management with items, promos, and totals
 * 2. favoritesService - Restaurant and menu item favorites with real-time sync
 * 3. ordersService - Full order lifecycle from placement to delivery tracking
 * 4. quickActionsService - Handler for all quick action operations with modals
 * 5. restaurantService - Restaurant data, menu items, search, and filtering
 * 6. locationService - User location, delivery addresses, and distance calculations
 * 7. userService - Authentication, profile management, preferences, and payments
 * 8. notificationService - In-app notifications, push notifications, and settings
 * 9. authService - Multi-role authentication (Customer, Restaurant, Delivery, Admin)
 * 10. restaurantManagementService - Restaurant operations and business management
 * 11. deliveryManagementService - Delivery rider operations and earnings tracking
 * 12. paymentService - Payment processing, methods, transactions, and wallet management
 * 13. adminManagementService - Platform administration, user oversight, and analytics
 * 14. realTimeNotificationService - Real-time push notifications and event broadcasting
 * 
 * Each service follows these patterns:
 * - Singleton pattern for consistent state
 * - Observer pattern with subscribe/notify for real-time updates
 * - TypeScript interfaces for type safety
 * - Mock data for development and testing
 * - Error handling and validation
 * - Real-world functionality simulation
 */

// Service initialization helper
export const initializeServices = () => {
  console.log('🚀 Initializing Multi-Role Food Delivery Platform Services...');
  
  // Services are automatically initialized when imported due to singleton pattern
  // This function can be used for any additional setup if needed
  
  console.log('✅ All platform services initialized successfully');
  
  return {
    cart: cartService,
    favorites: favoritesService,
    orders: ordersService,
    quickActions: quickActionsService,
    restaurant: restaurantService,
    location: locationService,
    user: userService,
    notification: notificationService,
    realTimeNotification: realTimeNotificationService,
    auth: authService,
    restaurantManagement: restaurantManagementService,
    deliveryManagement: deliveryManagementService,
    payment: paymentService,
    adminManagement: adminManagementService,
  };
};

// Service health check helper
export const checkServiceHealth = () => {
  const services = {
    cart: cartService.getCart(),
    favorites: favoritesService.getCount(),
    orders: ordersService.getAllOrders().length,
    restaurant: restaurantService.getAllRestaurants().length,
    location: locationService.getSavedAddresses().length,
    user: userService.isUserAuthenticated(),
    notification: notificationService.getUnreadCount(),
    auth: authService.getCurrentUser() !== null,
    restaurantManagement: restaurantManagementService.getRestaurantProfile() !== null,
    deliveryManagement: deliveryManagementService.getRiderProfile() !== null,
    payment: paymentService.getPaymentMethods('customer_123').length,
    adminManagement: adminManagementService.getPlatformStats().users.totalCustomers,
  };
  
  console.log('📊 Multi-Role Platform Service Health Check:', services);
  return services;
};