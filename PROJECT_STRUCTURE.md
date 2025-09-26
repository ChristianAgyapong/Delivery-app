# 📁 Project Structure Overview

This document provides a complete overview of the FoodieExpress project structure with proper frontend/backend separation.

## 🏗️ Root Directory Structure

```
delivery-app/
├── frontend/                    # 📱 React Native Mobile App
│   ├── app/                    # Expo Router pages
│   ├── assets/                 # Images, icons, fonts
│   ├── components/             # Reusable UI components
│   ├── constants/              # Design system & constants
│   ├── services/               # API services & data management
│   ├── node_modules/           # Frontend dependencies
│   ├── .expo/                  # Expo development files
│   ├── package.json            # Frontend dependencies
│   ├── app.json               # Expo configuration
│   ├── tsconfig.json          # TypeScript config
│   └── README.md              # Frontend documentation
├── backend/                    # 🔧 Django REST API
│   ├── apps/                  # Django applications
│   │   ├── authentication/    # User management & JWT
│   │   ├── restaurants/       # Restaurant & menu models
│   │   ├── orders/           # Order processing
│   │   ├── payments/         # Payment integration
│   │   ├── delivery/         # Delivery tracking
│   │   ├── notifications/    # Push notifications
│   │   └── admin_panel/      # Admin management
│   ├── foodie_backend/       # Django project settings
│   │   ├── settings.py       # Main configuration
│   │   ├── urls.py          # URL routing
│   │   ├── wsgi.py          # WSGI application
│   │   └── asgi.py          # ASGI for WebSockets
│   ├── media/               # User uploaded files
│   ├── venv/                # Python virtual environment
│   ├── manage.py            # Django management
│   ├── requirements.txt     # Python dependencies
│   ├── setup.ps1           # Setup script
│   └── README.md           # Backend documentation
├── .gitignore              # Git ignore rules
├── README.md               # Main project documentation
├── INTEGRATION_GUIDE.md    # Frontend-Backend integration
└── PROJECT_ARCHITECTURE.md # Architecture documentation
```

## 📱 Frontend Structure (React Native)

### Core Directories

#### `app/` - Expo Router Pages
```
app/
├── (auth)/                 # Authentication flow
│   ├── login.tsx          # User login screen
│   └── signup.tsx         # User registration
├── (tabs)/                # Main app navigation
│   ├── _layout.tsx        # Tab bar configuration
│   ├── home.tsx           # Restaurant discovery
│   ├── search.tsx         # Search & filters
│   ├── orders.tsx         # Order management
│   └── profile.tsx        # User profile
├── restaurant/
│   └── [id].tsx           # Restaurant details & menu
├── tracking/
│   └── [orderId].tsx      # Live order tracking
├── _layout.tsx            # Root layout with navigation
├── index.tsx              # Welcome/onboarding screen
├── cart.tsx               # Shopping cart
└── checkout.tsx           # Payment & checkout
```

#### `services/` - API & Data Management
```
services/
├── index.ts               # API configuration
├── authService.ts         # Authentication logic
├── userService.ts         # User profile management
├── restaurantService.ts   # Restaurant data
├── ordersService.ts       # Order processing
├── cartService.ts         # Shopping cart state
├── paymentService.ts      # Payment processing
└── README.md             # Service documentation
```

#### `components/` - Reusable Components
```
components/
├── AppNotification.tsx    # Notification system
├── AppStates.tsx         # App state management
└── ...                   # More UI components
```

#### `constants/` - Design System
```
constants/
└── design.ts             # Colors, typography, spacing
```

### Key Configuration Files
- `package.json` - React Native dependencies (Expo, React Native, TypeScript)
- `app.json` - Expo configuration (app name, icons, splash screen)
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - Code linting rules

## 🔧 Backend Structure (Django)

### Core Applications

#### `apps/authentication/` - User Management
```
authentication/
├── models.py             # Custom User model
├── views.py              # Auth API endpoints
├── serializers.py        # Data serialization
├── urls.py              # Auth URL routing
├── admin.py             # Django admin config
├── apps.py              # App configuration
└── signals.py           # User profile creation
```

#### `apps/restaurants/` - Restaurant Management
```
restaurants/
├── models.py             # Restaurant, Menu models
├── views.py              # Restaurant API endpoints
├── serializers.py        # Restaurant data serialization
├── urls.py              # Restaurant URL routing
├── admin.py             # Restaurant admin interface
└── apps.py              # App configuration
```

#### Other Apps Structure
- `orders/` - Order processing and management
- `payments/` - Payment integration (Stripe)
- `delivery/` - Delivery tracking and driver management
- `notifications/` - Push notifications (Firebase)
- `admin_panel/` - Administrative dashboard

### Django Project Configuration

#### `foodie_backend/` - Main Settings
```
foodie_backend/
├── settings.py           # Django configuration
│   ├── Database setup (SQLite/PostgreSQL)
│   ├── JWT authentication
│   ├── CORS for React Native
│   ├── API documentation
│   └── Security settings
├── urls.py              # Main URL routing
├── wsgi.py              # Production WSGI
└── asgi.py              # WebSocket ASGI
```

## 🔄 Development Workflow

### Starting Development

1. **Backend First**:
   ```bash
   cd backend
   .\setup.ps1                    # Initial setup
   .\venv\Scripts\Activate.ps1    # Activate environment
   python manage.py runserver     # Start Django
   ```

2. **Frontend Second**:
   ```bash
   cd frontend
   npm install                    # Install dependencies
   npx expo start                 # Start Expo
   ```

### File Organization Benefits

1. **Clear Separation**: Frontend and backend are completely isolated
2. **Independent Development**: Teams can work on each part separately
3. **Easy Deployment**: Each part can be deployed independently
4. **Technology Focus**: Each directory contains only relevant files
5. **Scalability**: Easy to add new features to either side

### Version Control

The `.gitignore` handles both frontend and backend ignore patterns:
```
# Frontend
node_modules/
.expo/
dist/

# Backend  
venv/
__pycache__/
*.pyc
db.sqlite3

# General
.env
.DS_Store
```

## 🚀 Deployment Structure

### Frontend Deployment Options
- **Expo Application Services (EAS)**: Native app builds
- **Web Deployment**: Expo web build
- **App Stores**: iOS App Store, Google Play Store

### Backend Deployment Options
- **Production Server**: Linux server with PostgreSQL
- **Cloud Platforms**: Heroku, AWS, Google Cloud
- **Containerization**: Docker deployment
- **Database**: PostgreSQL with Redis for caching

This structure provides a clean, scalable foundation for both development and production deployment of the FoodieExpress platform.