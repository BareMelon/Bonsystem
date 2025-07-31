# 🚀 Quick Start - Bon System

## ⚡ Hurtig Installation (5 minutter)

### 1. Installer Dependencies
```bash
# Windows
setup.bat

# Mac/Linux
chmod +x setup.sh
./setup.sh

# Eller manuelt
npm run install-all
```

### 2. Start Udviklingsserver
```bash
npm run dev
```

### 3. Åbn Browser
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🧪 Test Systemet

### Test Bestilling
1. Gå til http://localhost:3000
2. Udfyld formularen:
   - **Mad**: "Pizza Margherita"
   - **Drikke**: "Cola"
   - **Ekstra info**: "Ekstra ost"
   - **Telefon**: "+45 12 34 56 78"
3. Klik "Send bestilling"
4. Se success besked

### Test Admin Panel
1. Gå til http://localhost:3000/admin
2. Se sticky note board
3. Klik "Start" på en bestilling
4. Se status ændre sig

---

## 🎯 Funktioner

### ✅ Virker Nu
- ✅ Bestillingsformular
- ✅ Admin panel
- ✅ Sticky note board
- ✅ Status opdateringer
- ✅ Database (SQLite)
- ✅ API endpoints
- ✅ Danish interface
- ✅ Website-only (ingen SMS)

### 🔄 Næste Skridt
- 🚀 Deployment til Vercel/Railway
- 🎨 Custom styling
- 📊 Analytics

---

## 🛠️ Troubleshooting

### Backend starter ikke
```bash
cd backend
npm install
npm run dev
```

### Frontend starter ikke
```bash
cd frontend
npm install
npm start
```

### Database fejl
- Backend opretter automatisk SQLite database
- Tjek at backend kører på port 5000

### API fejl
- Tjek at backend kører
- Tjek browser console for CORS fejl
- Verificer at frontend proxy er sat til http://localhost:5000

---

## 📞 Support

- **Backend logs**: Se terminal hvor backend kører
- **Frontend logs**: Åbn browser developer tools
- **Database**: SQLite fil i `backend/database/bonsystem.db`

---

**🎉 Du er klar til at teste Bon System!** 