#!/bin/bash

echo "========================================"
echo "   Bon System Setup Script"
echo "========================================"
echo

echo "Installing root dependencies..."
npm install

echo
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo
echo "========================================"
echo "   Setup Complete!"
echo "========================================"
echo
echo "To start the development server:"
echo "npm run dev"
echo
echo "This will start both frontend (port 3000) and backend (port 5000)"
echo 