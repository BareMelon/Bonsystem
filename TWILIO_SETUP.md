# 📱 Twilio SMS Setup for me&ma

## 🎯 What You'll Get
- **SMS notifications** when new orders arrive
- **Danish order details** sent to your phone
- **Beautiful formatted messages** with all order info

## 🚀 Quick Setup

### Step 1: Get Twilio Account
1. Go to [twilio.com](https://twilio.com)
2. Sign up for **free account**
3. Complete phone verification

### Step 2: Get Your Credentials
In Twilio Console, find these:
- **Account SID** (starts with AC...)
- **Auth Token** (click eye icon to reveal)
- **Phone Number** (buy a number or use trial number)

### Step 3: Add to Railway
1. Go to your Railway project
2. **Variables** tab → **Add New Variable**
3. Add these:
   ```
   TWILIO_ACCOUNT_SID=AC...your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token  
   TWILIO_PHONE_NUMBER=+1234567890
   ADMIN_PHONE=+45_your_danish_number
   ```

### Step 4: Configure in Admin Panel
1. Go to your **me&ma admin panel** `/admin`
2. Scroll to **SMS Notifikationer (Twilio)**
3. Fill in the same details
4. Click **Gem Indstillinger**

## 📱 SMS Message Format
When someone orders, you'll get:
```
🍽️ NY BESTILLING - me&ma

Mad: Pizza Margherita
Drikke: Cola
Ekstra: Ekstra ost, ingen løg
Telefon: +45 12 34 56 78

Bestilling #15
Tid: 01/08/2025 10:30:45
```

## 💰 Free Tier Limits
- **$15.50 free credit** when you sign up
- **~500-1000 SMS** depending on destination
- **Perfect for testing** and small restaurants

## ✅ Test It
1. Complete setup above
2. Place a test order on your website
3. Check your phone for SMS!

## 🔧 Troubleshooting
- **No SMS received?** Check Railway logs for errors
- **Invalid number?** Make sure to include country code
- **SMS not sending?** Verify all Twilio credentials

**Your me&ma restaurant now has SMS notifications!** 🎉