# 🍔 FoodieExpress - Complete Food Delivery Platform

A comprehensive food delivery application with **React Native Frontend** and **Django REST Backend**.

## 🏗️ Project Architecture

This project consists of two main components:

### 📱 **Frontend** (`/frontend/` - React Native Mobile App)
- Cross-platform mobile application built with React Native + Expo
- TypeScript for type safety and better development experience
- Modern UI/UX following Human-Computer Interaction principles
- Multi-role support (Customer, Restaurant, Delivery, Admin)

### 🔧 **Backend** (`/backend/` - Django REST API)
- Django REST Framework for robust API development
- JWT authentication matching frontend interfaces
- PostgreSQL database (SQLite for development)
- Real-time features with WebSockets
- Comprehensive admin panel

## 🚀 Features

### Core Features
- **Welcome Screen**: Beautiful onboarding with app introduction
- **Home Screen**: Restaurant discovery with categories and promotions  
- **Search & Filter**: Advanced search with real-time results and filters
- **Restaurant Details**: Detailed menu, ratings, and customization options
- **Shopping Cart**: Item management with quantity controls and promo codes
- **Checkout**: Secure payment processing with multiple payment methods
- **Order Tracking**: Real-time delivery tracking with driver information
- **Order History**: Complete order management and reorder functionality
- **User Profile**: Account management and preferences

### User Experience Enhancements
- **Intuitive Navigation**: Tab-based navigation with clear visual hierarchy
- **Visual Appeal**: Modern design with high-quality images and smooth animations
- **Interactive Elements**: Animated progress bars, live tracking indicators
- **Personalization**: Customizable delivery addresses and payment methods
- **Promo System**: Discount codes and special offers integration
- **Rating System**: Restaurant and driver ratings for quality assurance

### Technical Features
- **Responsive Design**: Works seamlessly on all device sizes
- **Performance Optimized**: Fast loading with efficient data handling
- **Error Handling**: Graceful error states and user feedback
- **TypeScript Support**: Type-safe development with better code quality
- **Expo Router**: Modern file-based navigation system

## 📱 App Screens

### 1. Welcome Screen (`app/index.tsx`)
- Attractive onboarding with app branding
- Feature highlights (Fast Delivery, Top Restaurants, Easy Payment)
- Smooth transition to main app

### 2. Home Screen (`app/(tabs)/home.tsx`)
- **Header**: Personalized greeting with location display
- **Search Bar**: Quick restaurant/food search functionality
- **Promo Banner**: Special offers and promotions
- **Categories**: Food type filters (Pizza, Burger, Sushi, etc.)
- **Restaurant Grid**: Featured restaurants with ratings and delivery info
- **Cart Badge**: Real-time cart item count

### 3. Search Screen (`app/(tabs)/search.tsx`)
- **Smart Search**: Real-time filtering of restaurants and food items
- **Popular Searches**: Quick access to trending searches
- **Recent Searches**: User search history
- **Quick Filters**: Top Rated, Fast Delivery, Offers filters
- **Search Results**: Mixed results showing both restaurants and food items

### 4. Restaurant Detail (`app/restaurant/[id].tsx`)
- **Restaurant Info**: Name, cuisine, ratings, delivery time
- **Menu Categories**: Organized food categories with filtering
- **Item Cards**: Food items with images, descriptions, and prices
- **Quantity Controls**: Add/remove items with visual feedback
- **Cart Integration**: Persistent cart with item count and total
- **Contact Options**: Call restaurant and get directions

### 5. Shopping Cart (`app/cart.tsx`)
- **Item Management**: Quantity adjustment and item removal
- **Customizations**: Display item customizations and preferences
- **Promo Codes**: Apply discount codes with validation
- **Bill Breakdown**: Detailed pricing with taxes and delivery fees
- **Delivery Info**: Address display with change option
- **Checkout Flow**: Seamless transition to payment

### 6. Checkout (`app/checkout.tsx`)
- **Address Management**: Delivery address selection and editing
- **Contact Info**: Phone number verification
- **Delivery Instructions**: Special delivery notes
- **Payment Methods**: Multiple payment options (Card, PayPal, Apple Pay, Cash)
- **Order Summary**: Final cost breakdown
- **Terms & Conditions**: Legal compliance

### 7. Order Tracking (`app/tracking/[orderId].tsx`)
- **Live Progress**: Real-time order status updates
- **Progress Bar**: Visual delivery progress indicator
- **Status Steps**: Detailed tracking with timestamps
- **Driver Info**: Driver details with contact options
- **Estimated Time**: Dynamic delivery time updates
- **Support Options**: Help and customer service access

### 8. Orders History (`app/(tabs)/orders.tsx`)
- **Ongoing Orders**: Active orders with tracking links
- **Order History**: Past orders with reorder functionality
- **Order Details**: Complete order information and status
- **Rating System**: Rate completed orders
- **Support Actions**: Help and issue reporting

### 9. Profile (`app/(tabs)/profile.tsx`)
- **User Information**: Profile management with edit options
- **Statistics**: Order count, rating, and spending stats
- **Account Settings**: Payment methods, addresses, preferences
- **Notifications**: Push notification controls
- **Support**: Help center and contact support
- **App Settings**: Location services and other preferences

## 🎨 Design System

### Color Palette
- **Primary Orange**: `#FF6B35` - Main brand color for CTAs and highlights
- **Secondary Colors**: Various complementary colors for categories
- **Neutral Grays**: `#333`, `#666`, `#999` for text hierarchy
- **Success Green**: `#32CD32` for positive states
- **Warning Red**: `#FF4444` for errors and cancellations

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable font sizes with proper contrast
- **Interactive Elements**: Distinct styling for buttons and links

### Icons
- Consistent icon usage from Expo Vector Icons
- Contextual icons for better user understanding
- Interactive states for better feedback

## 📦 Project Structure

```
app/
├── index.tsx                 # Welcome/Onboarding screen
├── (tabs)/                   # Tab navigation
│   ├── _layout.tsx          # Tab layout configuration
│   ├── home.tsx             # Home screen with restaurants
│   ├── search.tsx           # Search and discovery
│   ├── orders.tsx           # Order history and tracking
│   └── profile.tsx          # User profile and settings
├── restaurant/
│   └── [id].tsx             # Restaurant detail and menu
├── cart.tsx                 # Shopping cart management
├── checkout.tsx             # Payment and order finalization
└── tracking/
    └── [orderId].tsx        # Live order tracking

assets/
├── images/                  # App icons and images
└── ...
```

## 🛠 Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **TypeScript**: Type-safe JavaScript development
- **Expo Router**: File-based navigation system
- **Expo Vector Icons**: Comprehensive icon library
- **React Native Safe Area Context**: Handle device safe areas
- **Expo Linear Gradient**: Beautiful gradient effects

## � Quick Start

### Frontend Setup (React Native)

1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd delivery-app/frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the Expo development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

### Backend Setup (Django API)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run the setup script**
   ```powershell
   .\setup.ps1
   ```

3. **Start the Django development server**
   ```bash
   # Activate virtual environment
   .\venv\Scripts\Activate.ps1
   
   # Run server
   python manage.py runserver
   ```

4. **Access the API**
   - API Root: http://127.0.0.1:8000/api/v1/
   - Admin Panel: http://127.0.0.1:8000/admin/
   - API Docs: http://127.0.0.1:8000/api/docs/

### Integration

To connect the frontend with the backend:

1. **Update API Base URL** in frontend services:
   ```typescript
   // In frontend/services/index.ts
   const API_BASE_URL = 'http://192.168.1.100:8000/api/v1';
   ```

2. **Replace mock authentication** with real JWT tokens from the Django backend

## 🎯 User-Centered Design Decisions

### Maximum User Satisfaction Features

1. **Intuitive Onboarding**: Clear app introduction with feature highlights
2. **Visual Discovery**: High-quality food images and restaurant photos
3. **Quick Actions**: Fast access to search, cart, and reorder
4. **Real-time Updates**: Live order tracking and delivery estimates
5. **Personalization**: Saved addresses, payment methods, and preferences
6. **Transparent Pricing**: Clear cost breakdowns with no hidden fees
7. **Multiple Payment Options**: Flexibility in payment methods
8. **Immediate Feedback**: Loading states, success messages, and error handling
9. **Customer Support**: Easy access to help and support options
10. **Social Proof**: Ratings, reviews, and delivery time displays

### Performance Optimizations

- **Lazy Loading**: Images and components load as needed
- **Efficient Navigation**: Fast transitions between screens
- **Optimized Images**: Properly sized images for mobile devices
- **Minimal Bundle Size**: Only essential dependencies included
- **Smooth Animations**: 60fps animations for better user experience

## 🚀 Future Enhancements

- **Push Notifications**: Real-time order updates and promotions
- **GPS Integration**: Live map tracking of delivery drivers
- **Social Features**: Share orders, rate and review system
- **Loyalty Program**: Points and rewards system
- **Voice Search**: Voice-activated search functionality
- **AR Menu**: Augmented reality food visualization
- **Group Ordering**: Collaborative ordering for teams/families
- **Subscription Service**: Meal plans and recurring orders

---

**FoodieExpress** - Delivering delicious food with exceptional user experience! 🚀