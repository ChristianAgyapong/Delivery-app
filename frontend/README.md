# 📱 FoodieExpress Frontend

React Native mobile application for the FoodieExpress food delivery platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 📁 Project Structure

```
frontend/
├── app/                     # Expo Router pages
│   ├── (auth)/             # Authentication screens
│   │   ├── login.tsx       # Login screen
│   │   └── signup.tsx      # Signup screen
│   ├── (tabs)/             # Main app navigation
│   │   ├── _layout.tsx     # Tab layout
│   │   ├── home.tsx        # Home screen
│   │   ├── search.tsx      # Search screen
│   │   ├── orders.tsx      # Orders screen
│   │   └── profile.tsx     # Profile screen
│   ├── restaurant/
│   │   └── [id].tsx        # Restaurant details
│   ├── tracking/
│   │   └── [orderId].tsx   # Order tracking
│   ├── _layout.tsx         # Root layout
│   ├── cart.tsx            # Shopping cart
│   ├── checkout.tsx        # Checkout flow
│   └── index.tsx           # Welcome screen
├── assets/                  # Static assets
├── components/             # Reusable components
├── constants/              # App constants and design system
├── services/               # API services and data management
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based navigation
- **Expo Vector Icons**: Icon library

## 🔄 Backend Integration

This frontend is designed to work with the Django backend in the `../backend/` directory.

### API Configuration

Update the API base URL in `services/index.ts`:

```typescript
export const API_BASE_URL = 'http://192.168.1.100:8000/api/v1';
```

### Authentication Flow

The app uses JWT tokens for authentication:

1. User registers/logs in through the auth screens
2. JWT tokens are stored securely
3. Tokens are included in API requests
4. Profile data syncs with the backend

### Development with Backend

1. **Start the backend server**:
   ```bash
   cd ../backend
   .\venv\Scripts\Activate.ps1
   python manage.py runserver
   ```

2. **Start the frontend**:
   ```bash
   cd ../frontend
   npx expo start
   ```

3. **Test integration**:
   - Use the app's auth screens to register/login
   - Verify user creation in Django admin
   - Test profile updates

## 🎨 Features

### Core Screens
- **Welcome**: App onboarding with feature highlights
- **Home**: Restaurant discovery with search and categories
- **Restaurant Details**: Menu browsing with cart integration
- **Cart & Checkout**: Order management and payment flow
- **Order Tracking**: Real-time delivery tracking
- **Profile**: User account management

### User Experience
- **Mobile-Optimized**: Touch-friendly design with proper spacing
- **Responsive**: Works on all device sizes
- **Accessible**: Following HCI principles
- **Multi-Role Support**: Customer, restaurant, delivery, admin interfaces

## 📱 Development

### Running Tests
```bash
npm test
```

### Code Style
```bash
npm run lint
```

### Building for Production
```bash
# Create production build
expo build:android
expo build:ios
```

## 🔗 Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Integration Guide](../INTEGRATION_GUIDE.md)
- [Project Architecture](../PROJECT_ARCHITECTURE.md)