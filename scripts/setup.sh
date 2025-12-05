#!/bin/bash

# IMS Frontend Setup Script

echo "🚀 Setting up Inventory Management System Frontend..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update VITE_API_BASE_URL in .env file"
else
    echo "ℹ️  .env file already exists"
fi
echo ""

# Run type check
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi
echo "✅ Type check passed"
echo ""

# Build the project
echo "🏗️  Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your API URL"
echo "  2. Run 'npm run dev' to start development server"
echo "  3. Open http://localhost:5173 in your browser"
echo ""
echo "For production deployment, see DEPLOYMENT.md"
