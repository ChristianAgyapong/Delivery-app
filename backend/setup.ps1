# 🚀 FoodieExpress Django Backend Setup Script (Windows PowerShell)
# Run this from the delivery-app root directory

Write-Host "🍔 Setting up FoodieExpress Django Backend..." -ForegroundColor Green

# Navigate to backend directory
Set-Location "backend"

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✅ Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
python -m venv venv

# Activate virtual environment
Write-Host "🔄 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install requirements
Write-Host "📥 Installing Python packages..." -ForegroundColor Yellow
pip install -r requirements.txt

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env configuration file..." -ForegroundColor Yellow
    @"
# Django Configuration
SECRET_KEY=django-insecure-development-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100

# Database (SQLite for development)
DATABASE_URL=sqlite:///db.sqlite3

# Frontend Configuration
FRONTEND_URL=exp://192.168.1.100:8081
CORS_ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081

# Email (Console backend for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Created .env file with development settings" -ForegroundColor Green
}

# Create media directories
Write-Host "📁 Creating media directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "media\restaurant_images" | Out-Null
New-Item -ItemType Directory -Force -Path "media\menu_images" | Out-Null
New-Item -ItemType Directory -Force -Path "media\user_avatars" | Out-Null

# Run migrations
Write-Host "🔄 Running Django migrations..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate

# Create superuser prompt
Write-Host ""
Write-Host "👤 Create a Django admin superuser?" -ForegroundColor Cyan
$createSuperuser = Read-Host "Enter 'y' to create superuser, or any other key to skip"
if ($createSuperuser -eq 'y' -or $createSuperuser -eq 'Y') {
    python manage.py createsuperuser
}

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Quick Start Commands:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  python manage.py runserver" -ForegroundColor White
Write-Host ""
Write-Host "🌐 API Endpoints will be available at:" -ForegroundColor Cyan
Write-Host "  • API Root: http://127.0.0.1:8000/api/v1/" -ForegroundColor White
Write-Host "  • Admin Panel: http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host "  • API Docs: http://127.0.0.1:8000/api/docs/" -ForegroundColor White
Write-Host ""
Write-Host "📱 Frontend Integration:" -ForegroundColor Cyan
Write-Host "  • Update your React Native services to use: http://192.168.1.100:8000/api/v1/" -ForegroundColor White
Write-Host "  • Replace mock authentication with real JWT tokens" -ForegroundColor White