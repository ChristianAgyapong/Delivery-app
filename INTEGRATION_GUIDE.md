# 🔗 Frontend-Backend Integration Guide

This guide explains how to connect the React Native frontend with the Django backend.

## 🎯 Overview

The FoodieExpress app is designed with a clear separation between frontend and backend:

- **Frontend**: React Native mobile app with mock services
- **Backend**: Django REST API with real database and authentication

## 🔧 Setup Both Services

### 1. Start Backend Server

```powershell
# In the backend directory
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver

# Backend will be available at: http://127.0.0.1:8000/api/v1/
```

### 2. Start Frontend App

```bash
# In the root directory
npx expo start

# Frontend will connect to backend via network IP
```

## 🔄 Integration Steps

### Step 1: Update API Base URL

Replace the mock API URL in your frontend services:

```typescript
// frontend/services/index.ts
export const API_BASE_URL = 'http://192.168.1.100:8000/api/v1';

// Make sure to use your actual network IP address
// You can find it in the Expo development server output
```

### Step 2: Replace Authentication Service

Update `frontend/services/authService.ts` to use real API calls:

```typescript
// Replace the mock login function
const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      // Store tokens securely
      await AsyncStorage.setItem('access_token', data.tokens.access);
      await AsyncStorage.setItem('refresh_token', data.tokens.refresh);
      
      return {
        success: true,
        user: data.user,
        token: data.tokens.access,
      };
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
```

### Step 3: Add JWT Token Management

Add token handling for authenticated requests:

```typescript
// frontend/services/apiClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const authHeaders = await getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });
};
```

### Step 4: Update User Profile Service

Replace mock user service with real API calls:

```typescript
// services/userService.ts
const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/auth/profile/update/`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });

  const data = await response.json();
  
  if (data.success) {
    return data.user;
  } else {
    throw new Error(data.message || 'Profile update failed');
  }
};
```

### Step 5: Install AsyncStorage

Install AsyncStorage for token persistence:

```bash
npx expo install @react-native-async-storage/async-storage
```

## 📚 Available API Endpoints

The Django backend provides these endpoints:

### Authentication
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/logout/` - User logout
- `GET /auth/me/` - Get current user
- `PUT /auth/profile/update/` - Update user profile
- `POST /auth/token/refresh/` - Refresh JWT token

### Restaurants (Coming Soon)
- `GET /restaurants/` - List restaurants
- `GET /restaurants/{id}/` - Restaurant details
- `GET /restaurants/{id}/menu/` - Restaurant menu

### Orders (Coming Soon)
- `GET /orders/` - User orders
- `POST /orders/` - Create order
- `GET /orders/{id}/` - Order details

## 🧪 Testing the Integration

### 1. Test Authentication

1. Start both backend and frontend
2. Open the app and go to the signup screen
3. Create a new account
4. Verify the user is created in Django admin at http://127.0.0.1:8000/admin/
5. Test login with the new account

### 2. Test Profile Management

1. Login to the app
2. Go to profile screen
3. Update profile information
4. Verify changes are saved in the backend

### 3. Check API Documentation

Visit http://127.0.0.1:8000/api/docs/ to see all available endpoints and test them directly.

## 🔍 Debugging Tips

### Check Network Connection
```typescript
// Test API connectivity
fetch('http://192.168.1.100:8000/api/v1/')
  .then(response => response.json())
  .then(data => console.log('API Response:', data))
  .catch(error => console.error('API Error:', error));
```

### Enable Debug Mode
```typescript
// Add to your service files for debugging
const DEBUG = __DEV__;

if (DEBUG) {
  console.log('API Request:', url, options);
  console.log('API Response:', data);
}
```

### Common Issues

1. **CORS Errors**: Make sure backend CORS settings allow your frontend URL
2. **Network Issues**: Use your actual network IP, not localhost
3. **Token Expiry**: Implement token refresh logic for expired JWTs

## 🚀 Next Steps

Once integration is complete, you can:

1. Add more API endpoints (restaurants, orders, payments)
2. Implement real-time features with WebSockets
3. Add push notifications
4. Deploy both services to production

The backend is designed to scale and support all the features shown in the frontend mock data!