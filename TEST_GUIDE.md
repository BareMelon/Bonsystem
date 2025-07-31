# 🧪 Test Guide - Bon System

## 🚀 Din Første Test Launch

### Trin 1: Start Systemet
```bash
# Åbn terminal/command prompt i Bonsystem mappen
npm run dev
```

Du skulle se noget som:
```
Server kører på port 5000
Bon System API er klar!
Compiled successfully!
```

### Trin 2: Åbn Browser
- Gå til: **http://localhost:3000**
- Du skulle se Bon System hjemmeside

### Trin 3: Test Bestilling
1. **Udfyld formularen:**
   - **Mad**: "Pizza Margherita med ekstra ost"
   - **Drikke**: "Cola Zero"
   - **Ekstra info**: "Ingen løg tak"
   - **Telefon**: "+45 12 34 56 78"

2. **Klik "📤 Send bestilling"**

3. **Se success besked:**
   - "Tak for din bestilling!"
   - "Din bestilling er blevet modtaget og behandles nu."

### Trin 4: Test Admin Panel
1. **Gå til admin panel:**
   - Klik "👨‍💼 Admin Panel" link
   - Eller gå til: **http://localhost:3000/admin**

2. **Se sticky note board:**
   - Din bestilling skulle være der som en gul sticky note
   - Se order ID, tid, og alle detaljer

3. **Test status opdateringer:**
   - Klik "Start" → Note bliver rød
   - Klik "Færdig" → Note bliver turkis
   - Klik "Afsendt" → Note bliver blå

### Trin 5: Test Statistikker
- Se statistikker øverst i admin panel
- "Total Bestillinger": 1
- "I Dag": 1
- "Nye": 0 (efter du har klikket "Start")

### Trin 6: Test Indstillinger
1. **Klik "⚙️ Indstillinger"**
2. **Ændr restaurant navn:**
   - Skriv "Min Restaurant"
   - Se at det gemmes automatisk

### Trin 7: Test Flere Bestillinger
1. **Gå tilbage til hjemmeside**
2. **Lav flere bestillinger:**
   - "Burger med pommes"
   - "Salat med dressing"
   - "Kaffe og kage"

3. **Gå til admin panel og se:**
   - Alle bestillinger som sticky notes
   - Forskellige farver baseret på status
   - Live statistikker

---

## 🎯 Hvad Du Skulle Se

### ✅ Success Indikatorer
- ✅ Frontend starter på port 3000
- ✅ Backend starter på port 5000
- ✅ Bestillingsformular virker
- ✅ Success besked vises
- ✅ Sticky notes i admin panel
- ✅ Status opdateringer virker
- ✅ Statistikker opdateres live

### ❌ Hvis Noget Ikke Virker

#### Backend starter ikke:
```bash
cd backend
npm install
npm run dev
```

#### Frontend starter ikke:
```bash
cd frontend
npm install
npm start
```

#### Database fejl:
- Tjek at backend kører på port 5000
- Database oprettes automatisk

#### API fejl:
- Tjek browser console (F12)
- Verificer at backend kører
- Tjek CORS fejl

---

## 🎉 Næste Skridt

### Når Alt Virker:
1. **Deploy til Vercel/Railway** (se DEPLOYMENT.md)
2. **Tilføj custom domain**
3. **Inviter team medlemmer**
4. **Start med at tage rigtige bestillinger!**

### Tips:
- **Sticky notes** roterer lidt for realistisk udseende
- **Hover effects** giver god feedback
- **Mobile responsive** - test på telefon
- **Real-time updates** - admin panel opdateres automatisk

---

**🎯 Din Bon System er klar til brug!** 