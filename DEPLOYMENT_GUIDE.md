# Swigato Food Website - Deployment Guide

## Backend Configuration Issue Fixed

The payment redirection was not working on deployment because the **Frontend Backend URL was hardcoded to `http://localhost:4000`**.

### ✅ What Was Fixed

1. **Frontend StoreContext.jsx** - Now uses environment variable `VITE_API_URL`
2. **Created .env.local** - For local development (localhost:4000)
3. **Created .env.example** - Template for environment variables

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

Make sure your backend is deployed (Vercel, Heroku, Railway, etc.) and get its URL:
- Example: `https://swigato-api.vercel.app`

### Step 2: Set Frontend Environment Variable for Vercel

1. Go to your **Vercel Project Dashboard**
2. Navigate to **Settings** → **Environment Variables**
3. Add this variable:
   ```
   VITE_API_URL=https://swigato-api.vercel.app
   ```
   (Replace with your actual backend URL)

4. **Redeploy** the frontend

### Step 3: Update Backend FRONTEND_URL

Make sure your backend `.env` has:
```
FRONTEND_URL=https://swigato-food-website.vercel.app
```
(Replace with your actual frontend URL)

---

## 🔧 Local Development Setup

1. Create `.env.local` file in `frontend/` folder with:
   ```
   VITE_API_URL=http://localhost:4000
   ```

2. Make sure backend is running on `http://localhost:4000`

3. Run frontend:
   ```
   cd frontend
   npm run dev
   ```

---

## 🔍 Payment Flow (After Fixes)

```
1. User submits order form on /order page
   ↓
2. Frontend stores orderData in localStorage (items, amount, address)
   ↓
3. Frontend calls: POST /api/payment/create-session
   ↓
4. Backend creates Stripe session and returns checkout URL
   ↓
5. User redirected to Stripe checkout
   ↓
6. After payment, Stripe redirects to: /success?session_id={ID}
   ↓
7. Success.jsx component:
   - Gets sessionId from URL
   - Gets token from localStorage
   - Gets orderData from localStorage
   - Calls: POST /api/order/verify (with sessionId & orderData)
   ↓
8. Backend verifies payment with Stripe
   - If paid: Saves order to database
   - Clears user's cart
   ↓
9. Frontend gets success response
   - Clears localStorage (orderData, token if needed)
   - Clears cart state
   - Redirects to /myorders
```

---

## ✅ Checklist Before Deploying

- [ ] Backend is deployed and accessible
- [ ] Backend `.env` has correct `FRONTEND_URL`
- [ ] Frontend Vercel has `VITE_API_URL` environment variable set
- [ ] Stripe keys are configured in backend `.env`
- [ ] Frontend `.env.local` has correct local dev URL
- [ ] `vercel.json` exists with SPA rewrites (already configured)
- [ ] Tested payment flow locally first
- [ ] Tested payment flow on Vercel deployment

---

## 🐛 Debugging Payment Issues

If payment still doesn't redirect to /myorders, check:

1. **Browser Console** (F12 → Console tab):
   - Look for `[Success]` prefixed log messages
   - Check for CORS errors
   - Verify backend URL is correct

2. **Backend Logs**:
   - Check if `/api/order/verify` is being called
   - Verify Stripe session verification is working
   - Check database insert logs

3. **Network Tab** (F12 → Network tab):
   - Check if POST `/api/order/verify` request is sent
   - Verify response status is 200
   - Check response body for error messages

---

## 📝 Key Files Modified

- `frontend/src/context/StoreContext.jsx` - Now uses `import.meta.env.VITE_API_URL`
- `frontend/src/pages/Success/Success.jsx` - Enhanced error logging
- `frontend/.env.local` - Local development config
- `frontend/.env.example` - Environment variable template
- `backend/controllers/orderController.js` - Improved verifyOrder function

---

## 🔗 Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-domain.com
```

### Backend (Vercel)
```
FRONTEND_URL=https://your-frontend-domain.vercel.app
STRIPE_SECRET_KEY=sk_test_xxxx
JWT_SECRET=your_jwt_secret
MONGODB_URL=your_mongodb_url
```

---

## Need Help?

1. Check browser console for detailed error logs
2. Verify environment variables are set correctly
3. Ensure both services can communicate (no CORS errors)
4. Test with Stripe test keys first
