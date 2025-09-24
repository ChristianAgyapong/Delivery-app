# Food Delivery App - Service Layer Documentation

## Overview

This food delivery app features a comprehensive service layer architecture designed to handle all real-world operations with production-ready functionality. Each service follows consistent patterns and provides a complete foundation for a modern food delivery application.

## Service Architecture

### 🛡️ Design Patterns

- **Singleton Pattern**: Each service maintains a single instance for consistent state management
- **Observer Pattern**: Real-time updates through subscribe/notify system
- **TypeScript First**: Full type safety with comprehensive interfaces
- **Mock Data**: Complete development and testing data sets
- **Error Handling**: Robust validation and error management

### 📦 Service Overview

| Service | Description | Key Features |
|---------|-------------|--------------|
| **Cart Service** | Shopping cart management | Add/remove items, promos, totals calculation |
| **Favorites Service** | User favorites system | Restaurant/item favorites, real-time sync |
| **Orders Service** | Order lifecycle management | Place orders, tracking, scheduling, history |
| **Quick Actions Service** | App quick actions handler | Reorder, schedule, modals, badges |
| **Restaurant Service** | Restaurant data management | Menu items, search, filtering, categories |
| **Location Service** | Location & address management | GPS, delivery addresses, distance calc |
| **User Service** | Authentication & profiles | Login, preferences, payments, stats |
| **Notification Service** | In-app notifications | Push notifications, settings, types |

## 🚀 Quick Start

### Installation & Setup

```typescript
// Import all services
import { 
  cartService, 
  userService, 
  restaurantService,
  initializeServices 
} from './services';

// Initialize services (optional - auto-initialized on import)
initializeServices();
```

### Basic Usage Examples

```typescript
// Cart Operations
cartService.addItem({
  id: 'item1',
  restaurantId: 'rest1', 
  restaurantName: 'Pizza Palace',
  itemName: 'Margherita Pizza',
  price: 16.99
}, 2);

const cart = cartService.getCart();
console.log(`Total: $${cart.total}`);

// User Authentication
const loginResult = await userService.login('user@example.com', 'password');
if (loginResult.success) {
  console.log('User logged in:', loginResult.user);
}

// Restaurant Search
const restaurants = restaurantService.searchRestaurants('pizza', {
  category: 'Italian',
  priceRange: ['$', '$$'],
  sortBy: 'rating'
});

// Real-time Updates
cartService.subscribe((event, data) => {
  if (event === 'item_added') {
    console.log('Item added to cart:', data);
  }
});
```

## 📋 Service Details

### 🛒 Cart Service (`cartService`)

**Purpose**: Complete shopping cart management with real-time updates

**Key Methods**:
- `addItem(item, quantity)` - Add item to cart
- `removeItem(itemId)` - Remove item from cart  
- `updateQuantity(itemId, quantity)` - Update item quantity
- `applyPromoCode(code)` - Apply promotional discount
- `getCart()` - Get current cart state
- `clearCart()` - Empty the cart
- `subscribe(callback)` - Listen for cart updates

**Features**:
- Automatic totals calculation (subtotal, tax, delivery, total)
- Promotional code system (SAVE10, NEWUSER, FREESHIP, WEEKEND20)
- Real-time listener system for UI updates
- Cart persistence and validation

**Data Structures**:
```typescript
interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  itemName: string;
  price: number;
  quantity: number;
  customizations?: any;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  promoCode?: string;
}
```

### ❤️ Favorites Service (`favoritesService`)

**Purpose**: User favorites management for restaurants and menu items

**Key Methods**:
- `toggleRestaurantFavorite(restaurantId)` - Toggle restaurant favorite
- `toggleItemFavorite(item)` - Toggle menu item favorite  
- `isFavoriteRestaurant(restaurantId)` - Check if restaurant is favorite
- `isFavoriteItem(itemId)` - Check if item is favorite
- `getFavoriteRestaurants()` - Get all favorite restaurants
- `getFavoriteItems()` - Get all favorite menu items
- `getCount()` - Get favorites count by type
- `subscribe(callback)` - Listen for favorites updates

**Features**:
- Separate restaurant and menu item favorites
- Real-time synchronization across app
- Search functionality within favorites
- Import/export capabilities for data backup
- Statistics and counts

### 📦 Orders Service (`ordersService`)

**Purpose**: Complete order lifecycle management from placement to delivery

**Key Methods**:
- `placeOrder(orderData)` - Place new order
- `scheduleOrder(orderData)` - Schedule future order
- `cancelOrder(orderId)` - Cancel existing order
- `getOrderById(orderId)` - Get specific order details
- `getAllOrders()` - Get all user orders
- `getRecentOrders(limit)` - Get recent orders for reordering
- `reorder(orderId)` - Reorder previous order
- `updateOrderStatus(orderId, status)` - Update order status
- `subscribe(callback)` - Listen for order updates

**Features**:
- Order status progression simulation
- Scheduled orders with future delivery
- Order cancellation and refunds
- Reorder functionality
- Order history and statistics
- Real-time status updates

**Order Statuses**:
`pending` → `confirmed` → `preparing` → `ready` → `picked_up` → `out_for_delivery` → `delivered`

### ⚡ Quick Actions Service (`quickActionsService`)

**Purpose**: Handler for all app quick actions with modal management

**Key Methods**:
- `handleReorder()` - Show reorder options
- `executeReorder(orderId)` - Execute specific reorder
- `handleSchedule()` - Manage scheduled orders
- `handleFavorites()` - Navigate to favorites
- `handleGroupOrder()` - Group ordering feature
- `getQuickActionsData()` - Get badge data for actions
- `subscribe(callback)` - Listen for action events

**Features**:
- Modal management system
- Badge counts for quick actions
- Integration with all other services
- Real-time data updates
- Action result handling

### 🏪 Restaurant Service (`restaurantService`)

**Purpose**: Restaurant and menu data management with search capabilities

**Key Methods**:
- `getAllRestaurants()` - Get all restaurants
- `getRestaurantById(id)` - Get specific restaurant
- `getFeaturedRestaurants()` - Get featured restaurants
- `searchRestaurants(query, filters)` - Search with filters
- `getMenuItems(restaurantId)` - Get restaurant menu
- `getCategories()` - Get all restaurant categories
- `getCuisines()` - Get all cuisine types
- `getNearbyRestaurants(lat, lng)` - Get nearby restaurants

**Features**:
- Advanced search and filtering system
- Restaurant categories and cuisines
- Menu item management
- Restaurant statistics
- Distance-based queries
- Featured restaurant promotions

**Filter Options**:
- Category, cuisine, price range
- Rating threshold, delivery time
- Dietary restrictions
- Sort by relevance, rating, delivery time, fee

### 📍 Location Service (`locationService`)

**Purpose**: User location and delivery address management

**Key Methods**:
- `getCurrentLocation()` - Get current GPS position
- `requestLocationPermission()` - Request location access
- `getSavedAddresses()` - Get all saved addresses
- `addAddress(address)` - Add new delivery address
- `setSelectedAddress(id)` - Set active delivery address
- `calculateDistance(lat1, lng1, lat2, lng2)` - Calculate distances
- `isInDeliveryArea(coords)` - Check delivery coverage

**Features**:
- GPS location with permission handling
- Multiple saved delivery addresses
- Address types (home, work, other)
- Distance calculations (Haversine formula)
- Delivery area validation
- Address geocoding simulation

### 👤 User Service (`userService`)

**Purpose**: User authentication, profile management, and preferences

**Key Methods**:
- `login(email, password)` - User authentication
- `register(userData)` - New user registration
- `logout()` - Sign out user
- `updateProfile(updates)` - Update user profile
- `getPreferences()` - Get user preferences
- `updatePreferences(updates)` - Update preferences
- `getPaymentMethods()` - Get saved payment methods
- `addPaymentMethod(method)` - Add new payment method

**Features**:
- Complete authentication system
- User profile management
- Comprehensive preferences system
- Payment methods management
- User statistics and analytics
- Email/phone verification system

**Preference Categories**:
- Notifications (push, email, SMS settings)
- Dietary restrictions and preferences
- Ordering preferences (tips, confirmations)
- Privacy settings (data sharing, analytics)

### 🔔 Notification Service (`notificationService`)

**Purpose**: In-app and push notification management

**Key Methods**:
- `getAllNotifications()` - Get all notifications
- `getUnreadNotifications()` - Get unread notifications
- `markAsRead(id)` - Mark notification as read
- `addNotification(notification)` - Add new notification
- `getSettings()` - Get notification settings
- `updateSettings(settings)` - Update notification preferences
- `requestPushPermission()` - Request push permission

**Features**:
- Multiple notification types
- Push notification simulation
- Quiet hours management  
- Notification settings and preferences
- Automatic cleanup of expired notifications
- Statistics and analytics

**Notification Types**:
- Order updates (status changes)
- Promotions and offers
- New restaurant announcements
- System alerts and updates
- Payment notifications
- Delivery notifications

## 🔗 Service Integration

### Real-time Updates

All services implement an observer pattern for real-time updates:

```typescript
// Subscribe to multiple services
const unsubscribeCart = cartService.subscribe((event, data) => {
  console.log('Cart event:', event, data);
});

const unsubscribeOrders = ordersService.subscribe((event, data) => {
  if (event === 'order_status_updated') {
    // Update UI with new status
    notificationService.simulateOrderUpdate(data.orderId, data.status);
  }
});

// Cleanup subscriptions
unsubscribeCart();
unsubscribeOrders();
```

### Cross-service Integration

Services work together seamlessly:

```typescript
// Complete order flow
const cart = cartService.getCart();
const user = userService.getCurrentUser();
const address = locationService.getSelectedAddress();

if (cart.items.length > 0 && user && address) {
  const orderResult = await ordersService.placeOrder({
    userId: user.id,
    items: cart.items,
    deliveryAddress: address,
    paymentMethod: userService.getDefaultPaymentMethod()
  });
  
  if (orderResult.success) {
    cartService.clearCart();
    notificationService.simulateOrderUpdate(orderResult.orderId!, 'confirmed');
  }
}
```

## 🛠️ Development Tools

### Health Check

Monitor service status:

```typescript
import { checkServiceHealth } from './services';

const health = checkServiceHealth();
console.log('Service Status:', health);
```

### Mock Data

All services include comprehensive mock data for development:

- 5+ restaurants with complete menu items
- User account with preferences and payment methods  
- Order history with various statuses
- Notifications across all types
- Saved addresses and favorites
- Cart with promotional codes

## 🚀 Production Readiness

### Features for Real-world Use

- **Error Handling**: Comprehensive try/catch with user-friendly messages
- **Data Validation**: Input validation and sanitization
- **Type Safety**: Full TypeScript coverage with interfaces
- **Performance**: Efficient algorithms and data structures
- **Scalability**: Singleton pattern with subscription management
- **Security**: Mock authentication with proper patterns
- **Testing**: Mock data and methods for easy testing

### Integration Points

Ready for integration with:
- **Backend APIs**: Replace mock functions with HTTP calls
- **Payment Systems**: Stripe, PayPal, Apple Pay, Google Pay
- **Push Notifications**: Firebase Cloud Messaging, OneSignal
- **Maps & Location**: Google Maps, Apple Maps, MapBox
- **Analytics**: Firebase Analytics, Mixpanel, Amplitude
- **Authentication**: Firebase Auth, Auth0, AWS Cognito

## 📱 React Native Integration

### Component Integration Example

```typescript
import React, { useEffect, useState } from 'react';
import { cartService, restaurantService } from '../services';

export const RestaurantScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load restaurants
    setRestaurants(restaurantService.getFeaturedRestaurants());
    
    // Subscribe to cart updates
    const unsubscribe = cartService.subscribe((event) => {
      if (event === 'cart_updated') {
        setCartCount(cartService.getCart().items.length);
      }
    });

    return unsubscribe;
  }, []);

  const addToCart = (item) => {
    cartService.addItem(item, 1);
  };

  // Component JSX...
};
```

## 🎯 Next Steps

1. **Component Integration**: Connect services to existing React components
2. **State Management**: Implement service subscriptions in UI components  
3. **API Integration**: Replace mock functions with real backend calls
4. **Push Notifications**: Set up actual push notification service
5. **Payment Integration**: Implement real payment processing
6. **Testing**: Add unit tests for all services
7. **Performance**: Optimize for production load

---

## 📚 API Reference

For detailed method documentation and examples, see individual service files:

- [Cart Service](./cartService.ts) - Shopping cart operations
- [Favorites Service](./favoritesService.ts) - Favorites management  
- [Orders Service](./ordersService.ts) - Order lifecycle
- [Quick Actions Service](./quickActionsService.ts) - Quick action handlers
- [Restaurant Service](./restaurantService.ts) - Restaurant & menu data
- [Location Service](./locationService.ts) - Location & addresses
- [User Service](./userService.ts) - Authentication & profiles
- [Notification Service](./notificationService.ts) - Notifications

## 🤝 Contributing

When adding new services or modifying existing ones:

1. Follow the singleton pattern
2. Implement subscribe/notify for real-time updates
3. Add comprehensive TypeScript interfaces
4. Include mock data for development
5. Add proper error handling
6. Update this documentation

---

**Built with ❤️ for maximum user satisfaction and real-world functionality**