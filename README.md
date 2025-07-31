# 🍽️ Bon System - Danish Food Ordering System

A complete Danish food ordering system with a beautiful sticky note board interface for order management.

## ✨ Features

### 🎨 **Sticky Note Order Board**
- Visual sticky notes on wall-like interface
- Color-coded by status: Gold (new), Red (processing), Turquoise (ready), Blue (sent)
- Interactive buttons: "Start", "Færdig", "Afsendt", "Annuller"
- Real-time updates with hover effects and animations
- Rotated notes for realistic appearance

### 📝 **Customer Order Form**
- Danish fields: Mad, Drikke, Ekstra info, Telefon
- Form validation with error messages
- Success confirmation with new order button
- Beautiful gradient UI design
- Mobile responsive

### 👨‍💼 **Admin Panel**
- Sticky note board for order management
- Statistics overview with live counters
- Settings panel for restaurant configuration
- Real-time order tracking
- Status workflow: ny → behandles → klar → afsendt

### 🗄️ **Database System**
- SQLite database with automatic setup
- Orders table with all necessary fields
- Settings table for system configuration
- No external database required

### 🔧 **API System**
- RESTful API with Express.js
- CORS enabled for frontend communication
- Rate limiting for security
- Input validation on all endpoints
- Error handling with Danish messages

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Windows
setup.bat

# Mac/Linux
chmod +x setup.sh
./setup.sh

# Or manually
npm run install-all
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🧪 Test the System

### Test Order
1. Go to http://localhost:3000
2. Fill out the form:
   - **Mad**: "Pizza Margherita"
   - **Drikke**: "Cola"
   - **Ekstra info**: "Ekstra ost"
   - **Telefon**: "+45 12 34 56 78"
3. Click "Send bestilling"
4. See success message

### Test Admin Panel
1. Go to http://localhost:3000/admin
2. See sticky note board
3. Click "Start" on an order
4. See status change

## 📁 Project Structure

```
Bonsystem/
├── frontend/                 # React TypeScript
│   ├── src/
│   │   ├── components/      # OrderBoard component
│   │   ├── pages/          # Home & Admin pages
│   │   └── services/       # API services
│   └── public/
├── backend/                  # Node.js Express
│   ├── routes/             # API routes
│   ├── database/           # SQLite database
│   └── server.js           # Main server file
├── setup.bat               # Windows setup script
├── setup.sh                # Unix setup script
├── QUICK_START.md          # Quick start guide
├── TEST_GUIDE.md           # Test instructions
└── DEPLOYMENT.md           # Deployment guide
```

## 🎯 Status Management

- **ny** - Ny bestilling (Gold)
- **behandles** - Bestilling behandles (Red)
- **klar** - Bestilling er klar (Turquoise)
- **afsendt** - Bestilling er afsendt (Blue)
- **annulleret** - Bestilling er annulleret (Gray)

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build frontend for production
npm run install-all  # Install all dependencies
```

### API Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings
- `GET /api/admin/stats` - Get statistics

## 🚀 Deployment

### Free Hosting Options
- **Frontend**: Vercel (100% free)
- **Backend**: Railway (100% free)
- **Database**: SQLite (included)

See `DEPLOYMENT.md` for detailed instructions.

## 🎨 UI/UX Features

- Modern gradient design
- Glassmorphism effects
- Smooth animations and transitions
- Hover effects on interactive elements
- Loading spinners for better UX
- Error messages with retry options
- Success confirmations
- Mobile responsive design

## 🔒 Security Features

- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration for security
- Helmet security headers
- Error handling without exposing internals

## 📱 Mobile Responsive

- Mobile-first design
- Touch-friendly buttons
- Responsive grid layouts
- Optimized for all screen sizes
- Mobile-optimized sticky notes

## 🎉 Ready for Production

### ✅ What Works Now
1. Complete order system with Danish interface
2. Sticky note board for visual order management
3. Admin panel with statistics and settings
4. Database system with SQLite
5. API system with all endpoints
6. Mobile responsive design
7. Website-only functionality (no SMS)

### 🔄 Next Steps
1. Deploy to Vercel/Railway (follow DEPLOYMENT.md)
2. Test thoroughly
3. Add custom domain (optional)
4. Start taking real orders!

---

**🎯 Your Danish food ordering system with sticky note board is 100% complete and ready to use!** 