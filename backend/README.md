# 🍔 FoodieExpress Backend

Django REST API backend for the FoodieExpress delivery application.

## 🚀 Quick Start

1. **Setup Environment**
   ```powershell
   cd backend
   .\setup.ps1
   ```

2. **Start Development Server**
   ```powershell
   .\venv\Scripts\Activate.ps1
   python manage.py runserver
   ```

3. **Access API**
   - API Root: http://127.0.0.1:8000/api/v1/
   - Admin Panel: http://127.0.0.1:8000/admin/
   - API Documentation: http://127.0.0.1:8000/api/docs/

## 📱 Integration with React Native Frontend

The backend is designed to work seamlessly with the React Native Expo frontend. 

### API Base URL
Update your frontend services to use:
```typescript
const API_BASE_URL = 'http://192.168.1.100:8000/api/v1';
```

### Available Endpoints

#### Authentication (`/api/v1/auth/`)
- `POST /register/` - User registration
- `POST /login/` - User login  
- `POST /logout/` - User logout
- `GET /me/` - Get current user
- `PUT /profile/update/` - Update user profile
- `POST /token/refresh/` - Refresh JWT token

#### Restaurants (`/api/v1/restaurants/`)
- `GET /` - List restaurants
- `GET /{id}/` - Restaurant details
- `GET /{id}/menu/` - Restaurant menu

#### Orders (`/api/v1/orders/`)
- Coming soon...

#### Other Endpoints
- Payments, Delivery, Notifications, Admin Panel (Coming soon...)

## 🛠️ Development

### Project Structure
```
backend/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (created by setup)
├── foodie_backend/       # Django project settings
│   ├── settings.py       # Main configuration
│   ├── urls.py          # URL routing
│   ├── wsgi.py          # WSGI application
│   └── asgi.py          # ASGI application (for WebSockets)
├── apps/                 # Django applications
│   ├── authentication/   # User management & JWT auth
│   ├── restaurants/     # Restaurant & menu management
│   ├── orders/          # Order processing
│   ├── payments/        # Payment integration
│   ├── delivery/        # Delivery tracking
│   ├── notifications/   # Push notifications
│   └── admin_panel/     # Admin management
└── media/               # User uploaded files
    ├── restaurant_images/
    ├── menu_images/
    └── user_avatars/
```

### Key Features

✅ **Implemented:**
- Custom User model matching frontend TypeScript interfaces
- JWT authentication with access/refresh tokens
- User registration, login, logout, profile management
- CORS configuration for React Native Expo
- API documentation with Swagger/ReDoc
- SQLite database (development) with PostgreSQL support (production)

🚧 **Coming Soon:**
- Restaurant and menu management
- Order processing and tracking
- Payment integration (Stripe)
- Real-time delivery tracking (WebSockets)
- Push notifications (Firebase)
- Admin dashboard

### Database Schema

The backend uses a custom User model that matches the frontend interfaces:

```python
# User model fields matching frontend User interface
id: UUID (primary key)
email: EmailField (unique)
full_name: CharField
phone_number: CharField
user_type: Choice ('customer', 'restaurant', 'delivery', 'admin')
avatar: ImageField
date_of_birth: DateField
address: TextField
is_active: BooleanField
is_verified: BooleanField
current_latitude/longitude: DecimalField
```

### Environment Variables

The `.env` file contains:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100
FRONTEND_URL=exp://192.168.1.100:8081
CORS_ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
```

## 🔄 Migration from Mock Services

To integrate the backend with your existing React Native app:

1. **Update API Base URL** in `services/index.ts`:
   ```typescript
   const API_BASE_URL = 'http://192.168.1.100:8000/api/v1';
   ```

2. **Replace Mock Authentication** in `services/authService.ts`:
   ```typescript
   // Replace mock methods with real API calls
   const login = async (email: string, password: string) => {
     const response = await fetch(`${API_BASE_URL}/auth/login/`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password })
     });
     return response.json();
   };
   ```

3. **Add JWT Token Management**:
   - Store tokens in secure storage
   - Include Authorization header in requests
   - Handle token refresh

## 🚀 Production Deployment

For production deployment:

1. **Update Environment Variables**:
   - Set `DEBUG=False`
   - Use strong `SECRET_KEY`
   - Configure PostgreSQL database
   - Set up Redis for caching/WebSockets
   - Configure email backend (SMTP)

2. **Security Considerations**:
   - Enable HTTPS
   - Configure proper CORS origins
   - Set up rate limiting
   - Use secure media storage (AWS S3)

## 📚 API Documentation

Start the server and visit:
- Swagger UI: http://127.0.0.1:8000/api/docs/
- ReDoc: http://127.0.0.1:8000/api/redoc/

## 🤝 Contributing

1. Follow Django best practices
2. Maintain consistency with frontend TypeScript interfaces
3. Write tests for new features
4. Update API documentation