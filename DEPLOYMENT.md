# 🚀 Deployment Guide - Bon System

## Gratis Hosting Setup

### **Frontend: Vercel (100% Gratis)**
### **Backend: Railway (100% Gratis)**

---

## 📋 Forudsætninger

1. **GitHub konto** (gratis)
2. **Vercel konto** (gratis) - [vercel.com](https://vercel.com)
3. **Railway konto** (gratis) - [railway.app](https://railway.app)
4. **Twilio konto** (gratis tier) - [twilio.com](https://twilio.com)

---

## 🎯 Trin 1: Twilio Setup (Gratis)

1. **Opret Twilio konto**
   - Gå til [twilio.com](https://twilio.com)
   - Opret gratis konto
   - Verificer din telefon

2. **Få dine credentials**
   - Gå til Twilio Console
   - Find din Account SID og Auth Token
   - Køb et telefonnummer (gratis tier = 1,000 SMS/måned)

3. **Noter dine oplysninger**
   ```
   Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Phone Number: +1XXXXXXXXXX
   ```

---

## 🎯 Trin 2: Backend Deployment (Railway)

### 2.1 Opret Railway Projekt

1. **Gå til Railway**
   - Besøg [railway.app](https://railway.app)
   - Log ind med GitHub

2. **Opret nyt projekt**
   - Klik "New Project"
   - Vælg "Deploy from GitHub repo"
   - Vælg dit Bon System repository

3. **Konfigurer miljøvariabler**
   - Gå til "Variables" tab
   - Tilføj følgende variabler:

   ```env
   NODE_ENV=production
   PORT=5000
   TWILIO_ACCOUNT_SID=din_twilio_account_sid
   TWILIO_AUTH_TOKEN=dit_twilio_auth_token
   TWILIO_PHONE_NUMBER=dit_twilio_telefonnummer
   ADMIN_PHONE=dit_admin_telefonnummer
   RESTAURANT_NAME=Bon System
   ```

4. **Deploy**
   - Railway vil automatisk deploye når du pusher til GitHub
   - Noter din Railway URL (f.eks. `https://bonsystem-backend.railway.app`)

---

## 🎯 Trin 3: Frontend Deployment (Vercel)

### 3.1 Opret Vercel Projekt

1. **Gå til Vercel**
   - Besøg [vercel.com](https://vercel.com)
   - Log ind med GitHub

2. **Import projekt**
   - Klik "New Project"
   - Import dit Bon System repository
   - Vælg `frontend` som root directory

3. **Konfigurer build settings**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   ```

4. **Tilføj miljøvariabel**
   - Gå til "Settings" → "Environment Variables"
   - Tilføj:
   ```
   REACT_APP_API_URL=https://din-railway-url.railway.app/api
   ```

5. **Deploy**
   - Klik "Deploy"
   - Vercel vil automatisk deploye når du pusher til GitHub

---

## 🎯 Trin 4: Database Setup

### 4.1 Railway SQLite (Automatisk)

Railway håndterer SQLite automatisk:
- Database fil oprettes automatisk
- Backups håndteres automatisk
- Ingen ekstra konfiguration nødvendig

---

## 🎯 Trin 5: Test Systemet

### 5.1 Test Bestilling
1. Gå til din Vercel URL
2. Udfyld bestillingsformularen
3. Send en test bestilling
4. Tjek at du modtager SMS

### 5.2 Test Admin Panel
1. Gå til `din-url.vercel.app/admin`
2. Tjek at bestillinger vises
3. Test status opdateringer
4. Konfigurer Twilio indstillinger

---

## 🔧 Troubleshooting

### Backend fejler
- Tjek Railway logs
- Verificer miljøvariabler
- Tjek at alle dependencies er installeret

### Frontend fejler
- Tjek Vercel logs
- Verificer API URL
- Tjek build logs

### SMS virker ikke
- Verificer Twilio credentials
- Tjek at telefonnummer er købt
- Verificer admin telefonnummer

---

## 📊 Monitoring

### Railway Dashboard
- Se live logs
- Monitor ressourceforbrug
- Se deployment status

### Vercel Dashboard
- Se deployment status
- Monitor performance
- Se analytics

---

## 🔄 Continuous Deployment

### Automatisk Deploy
- Push til GitHub main branch
- Railway og Vercel deployer automatisk
- Ingen manuel intervention nødvendig

### Miljøvariabler
- Opdateres via dashboard
- Ingen kode ændringer nødvendig
- Øjeblikkelig effekt

---

## 💰 Omkostninger

### Gratis Tier Limits
- **Vercel**: Ubegrænset
- **Railway**: $5/måned kredit (gratis)
- **Twilio**: 1,000 SMS/måned (gratis)

### Skalering
- Opgrader til betalt plan når nødvendigt
- Alle data bevares
- Ingen nedetid

---

## 🎉 Du er klar!

Dit Bon System kører nu på:
- **Frontend**: `https://din-app.vercel.app`
- **Backend**: `https://din-backend.railway.app`
- **SMS**: Twilio (gratis tier)

**Næste skridt:**
1. Test systemet grundigt
2. Konfigurer custom domain (valgfrit)
3. Inviter team medlemmer
4. Start med at tage bestillinger!

---

**Hjælp?** Opret en issue på GitHub eller kontakt support. 