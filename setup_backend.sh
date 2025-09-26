#!/bin/bash
# 🚀 FoodieExpress Backend Setup Script

echo "🍔 Setting up FoodieExpress Django Backend..."

# Create backend directory
mkdir -p ../foodie-express-backend
cd ../foodie-express-backend

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python -m venv venv

# Activate virtual environment (Linux/Mac)
source venv/bin/activate

# For Windows users, use: venv\Scripts\activate

# Create requirements files
echo "📋 Creating requirements files..."

# Base requirements
cat > requirements/base.txt << 'EOF'
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-decouple==3.8
Pillow==10.0.1
psycopg2-binary==2.9.7
redis==5.0.1
celery==5.3.4
channels==4.0.0
channels-redis==4.1.0
django-filter==23.3
djangorestframework-simplejwt==5.3.0
stripe==7.8.0
firebase-admin==6.2.0
gunicorn==21.2.0
whitenoise==6.6.0
boto3==1.29.7
django-storages==1.14.2
drf-spectacular==0.26.5
EOF

# Development requirements
cat > requirements/development.txt << 'EOF'
-r base.txt
django-debug-toolbar==4.2.0
pytest==7.4.3
pytest-django==4.5.2
black==23.11.0
flake8==6.1.0
coverage==7.3.2
factory-boy==3.3.0
django-extensions==3.2.3
EOF

# Production requirements
cat > requirements/production.txt << 'EOF'
-r base.txt
sentry-sdk==1.38.0
django-health-check==3.17.0
EOF

# Install base requirements
echo "🔽 Installing Python packages..."
pip install -r requirements/development.txt

# Create Django project
echo "🏗️ Creating Django project structure..."
django-admin startproject foodie_express_backend .

# Create apps directory
mkdir -p apps
cd apps

# Create Django apps
echo "📱 Creating Django applications..."
python ../manage.py startapp authentication
python ../manage.py startapp restaurants
python ../manage.py startapp orders
python ../manage.py startapp payments
python ../manage.py startapp delivery
python ../manage.py startapp notifications
python ../manage.py startapp admin_panel

cd ..

# Create additional directories
echo "📁 Creating project directories..."
mkdir -p core/websocket
mkdir -p media/{restaurant_images,menu_images,user_avatars}
mkdir -p static
mkdir -p logs
mkdir -p templates

# Create environment file
cat > .env.example << 'EOF'
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=foodie_express
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Celery Configuration
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-firebase-private-key-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_CLIENT_ID=your-firebase-client-id

# Frontend Configuration
FRONTEND_URL=exp://192.168.1.100:8081
CORS_ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
EOF

echo "✅ Backend project structure created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env and configure your settings"
echo "2. Set up PostgreSQL database"
echo "3. Run migrations: python manage.py migrate"
echo "4. Create superuser: python manage.py createsuperuser"
echo "5. Start development server: python manage.py runserver"
echo ""
echo "🔗 To integrate with frontend:"
echo "1. Update frontend service URLs to point to Django backend"
echo "2. Replace mock authentication with real JWT tokens"
echo "3. Configure WebSocket connections for real-time features"