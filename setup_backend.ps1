# 🚀 FoodieExpress Backend Setup Script (Windows PowerShell)

Write-Host "🍔 Setting up FoodieExpress Django Backend..." -ForegroundColor Green

# Create backend directory
$backendPath = "..\foodie-express-backend"
New-Item -ItemType Directory -Force -Path $backendPath | Out-Null
Set-Location -Path $backendPath

# Create virtual environment
Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
python -m venv venv

# Activate virtual environment
Write-Host "🔄 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Create requirements directory
New-Item -ItemType Directory -Force -Path "requirements" | Out-Null

# Create base requirements file
@"
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
"@ | Out-File -FilePath "requirements\base.txt" -Encoding UTF8

# Create development requirements file
@"
-r base.txt
django-debug-toolbar==4.2.0
pytest==7.4.3
pytest-django==4.5.2
black==23.11.0
flake8==6.1.0
coverage==7.3.2
factory-boy==3.3.0
django-extensions==3.2.3
"@ | Out-File -FilePath "requirements\development.txt" -Encoding UTF8

# Create production requirements file
@"
-r base.txt
sentry-sdk==1.38.0
django-health-check==3.17.0
"@ | Out-File -FilePath "requirements\production.txt" -Encoding UTF8

# Install requirements
Write-Host "🔽 Installing Python packages..." -ForegroundColor Yellow
pip install -r requirements/development.txt

# Create Django project
Write-Host "🏗️ Creating Django project structure..." -ForegroundColor Yellow
django-admin startproject foodie_express_backend .

# Create apps directory and Django apps
New-Item -ItemType Directory -Force -Path "apps" | Out-Null
Set-Location -Path "apps"

Write-Host "📱 Creating Django applications..." -ForegroundColor Yellow
python ..\manage.py startapp authentication
python ..\manage.py startapp restaurants
python ..\manage.py startapp orders
python ..\manage.py startapp payments
python ..\manage.py startapp delivery
python ..\manage.py startapp notifications
python ..\manage.py startapp admin_panel

Set-Location -Path ".."

# Create additional directories
Write-Host "📁 Creating project directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "core\websocket" | Out-Null
New-Item -ItemType Directory -Force -Path "media\restaurant_images" | Out-Null
New-Item -ItemType Directory -Force -Path "media\menu_images" | Out-Null
New-Item -ItemType Directory -Force -Path "media\user_avatars" | Out-Null
New-Item -ItemType Directory -Force -Path "static" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "templates" | Out-Null

# Create environment file
@"
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
"@ | Out-File -FilePath ".env.example" -Encoding UTF8

Write-Host ""
Write-Host "✅ Backend project structure created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env and configure your settings"
Write-Host "2. Set up PostgreSQL database"
Write-Host "3. Run migrations: python manage.py migrate"
Write-Host "4. Create superuser: python manage.py createsuperuser"
Write-Host "5. Start development server: python manage.py runserver"
Write-Host ""
Write-Host "🔗 To integrate with frontend:" -ForegroundColor Cyan
Write-Host "1. Update frontend service URLs to point to Django backend"
Write-Host "2. Replace mock authentication with real JWT tokens"
Write-Host "3. Configure WebSocket connections for real-time features"