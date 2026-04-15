# Deployment Guide - Swigato Food Website

## Quick Fix for 404 Error on Success Page

If you're seeing a 404 error after payment on the Success page, it's because **the backend URL environment variable is not set in Vercel**.

---

## Step 1: Deploy Backend First

1. Deploy your backend to Vercel or any hosting platform
2. Get your backend URL:
   - **Vercel**: `https://your-project-name.vercel.app`
   - **Custom domain**: `https://api.yourdomain.com`
3. Note this URL - you'll need it in the next step

---

## Step 2: Set Environment Variables in Vercel (CRITICAL)

1. Go to your **Vercel Dashboard**
2. Select your **frontend project**
3. Click **Settings** > **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com` (your deployed backend URL)
   - **Environments**: Select `Production` and `Preview`
5. Click **Save**

### Example:
```
VITE_API_URL=https://swigato-backend.vercel.app
```

---

## Step 3: Redeploy Frontend

1. Go to **Deployments**
2. Click the **three dots (...)** next to your latest deployment
3. Select **Redeploy**
4. Wait for the build to complete

---

## Step 4: Test Payment Flow

1. Visit your deployed frontend URL
2. Add items to cart
3. Click "Proceed to Payment"
4. Complete a test Stripe payment
5. After payment, you should be redirected to `/success` then to `/myorders`

---

## Troubleshooting: 404 Error on Success Page

If you still see **404: NOT_FOUND** on the success page:

### Check 1: Backend URL in Vercel
- Verify `VITE_API_URL` is set correctly in Vercel environment variables
- Ensure your backend URL is working (test it in browser)

### Check 2: Browser Console
- Open **DevTools (F12)** > **Console** tab
- Look for logs starting with `[Success]` and `[StoreContext]`
- This will show which URL is being used

### Check 3: Network Requests
- In DevTools, go to **Network** tab
- Check the API request to `/api/order/verify`
- If it shows 404 or connection error, the backend URL is wrong

---

## Complete Setup Checklist

- [ ] Backend deployed and accessible
- [ ] Backend URL noted
- [ ] `VITE_API_URL` environment variable set in Vercel
- [ ] Frontend redeployed after setting env vars
- [ ] Stripe keys configured in backend
- [ ] `FRONTEND_URL` environment variable set in backend
- [ ] Test payment completed successfully

---

## Environment Variables Summary

### Frontend (Vercel Environment Variables)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Backend `.env` file)
```
FRONTEND_URL=https://your-frontend-url.vercel.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_url
```

---

## Important Notes

1. **Always redeploy after changing environment variables** - Vercel doesn't automatically rebuild
2. **Test payment uses test Stripe keys** - Make sure backend `.env` has test keys during testing
3. **Cross-Origin (CORS)** - If you see CORS errors, add frontend URL to backend CORS configuration
4. **Localhost won't work on production** - Never rely on `http://localhost:4000` for production

---

Need Help?
- Check backend logs on Vercel: Deployments > Select build > Logs
- Check frontend logs: Browser DevTools > Console tab
- Verify API endpoint is responding: Try visiting `https://your-backend-url.com/api/order/verify` in browser
