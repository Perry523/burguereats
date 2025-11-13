#!/bin/bash

# Tomatiza Deployment Script
# This script helps deploy the Tomatiza application

set -e

echo "🍅 Tomatiza Deployment Script"
echo "=============================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your configuration."
    echo "You can copy from .env.example and update the values."
    exit 1
fi

# Check if required environment variables are set
echo "🔍 Checking environment variables..."

required_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "SUPABASE_SERVICE_KEY" "DATABASE_URL" "JWT_SECRET" "GEMINI_API_KEY")

for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env && ! grep -q "^${var}=your_" .env; then
        echo "✅ $var is configured"
    else
        echo "❌ $var is not properly configured in .env"
        exit 1
    fi
done

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️ Running database migrations..."
npm run migrate

echo ""
echo "🧪 Running basic tests..."

# Test database connection
echo "Testing database connection..."
npm run migrate:status

echo ""
echo "🏗️ Building application..."
npm run build

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy to your hosting platform (Vercel, Netlify, etc.)"
echo "2. Set environment variables in your hosting dashboard"
echo "3. Test the deployed application"
echo ""
echo "For Vercel deployment:"
echo "  vercel --prod"
echo ""
echo "For manual deployment:"
echo "  npm run start"
