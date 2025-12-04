# SnapStudy Backend Setup Guide

## 🚀 Quick Start

Your SnapStudy backend is ready to use! The app will automatically connect to Supabase when you run it.

## 📋 What's Been Set Up

### ✅ Backend Server
- **Location**: `/supabase/functions/server/index.tsx`
- **Framework**: Hono web server running on Deno
- **Endpoints**: 30+ REST API endpoints for authentication, reels, courses, playlists, etc.

### ✅ Database Schema
- **Location**: `/supabase/migrations/001_initial_schema.sql`
- **Tables**: 9 tables with Row Level Security
- **Relationships**: Foreign keys and indexes configured

### ✅ Seed Data
- **Location**: `/supabase/migrations/002_seed_data.sql`
- **Includes**: 5 demo users, 15 reels, 4 micro-courses, sample interactions

### ✅ Frontend Integration
- **Location**: `/utils/api.ts`
- **Features**: Type-safe API client with helper functions

---

## 🔧 Running Database Migrations

The migrations need to be run in your Supabase dashboard:

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Schema Migration
1. Click **"New Query"**
2. Copy the entire contents of `/supabase/migrations/001_initial_schema.sql`
3. Paste into the SQL editor
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. Wait for success message

### Step 3: Run Seed Data Migration
1. Click **"New Query"** again
2. Copy the entire contents of `/supabase/migrations/002_seed_data.sql`
3. Paste into the SQL editor
4. Click **"Run"**
5. Wait for success message

### Step 4: Verify Tables
1. Navigate to **Table Editor** in the left sidebar
2. You should see these tables:
   - users
   - reels
   - micro_courses
   - micro_course_lessons
   - playlists
   - playlist_items
   - likes
   - followers
   - course_progress

---

## 🔐 Setting Up Demo User

The seed data includes demo users, but they need passwords set via Supabase Auth:

### Option 1: Use Guest Mode
The app allows guest access without authentication. Just click "Continue as Guest" on login screen.

### Option 2: Create Demo User via Auth
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - Email: `sarah@example.com`
   - Password: `demo123`
   - Confirm password: `demo123`
4. Check "Auto Confirm User"
5. Click **"Create User"**

> **Note**: The user ID from Auth must match the seed data. If it doesn't match, the app will work but you won't see the seeded content for that user.

---

## 🎬 Using the App

### Login Screen
- **Email Login**: Use `sarah@example.com` / `demo123` (after creating the user)
- **Guest Mode**: Click "Continue as Guest" to browse without auth

### Features Available

#### Without Login (Guest):
- ✅ Browse reels feed
- ✅ Search courses and creators
- ✅ View course details
- ❌ Cannot like, save, or create content

#### With Login:
- ✅ All guest features
- ✅ Like and save reels
- ✅ Create playlists
- ✅ Track course progress
- ✅ Follow creators
- ✅ Upload new reels

---

## 📱 Testing the API

### Test Reels Endpoint
Open browser console and run:

```javascript
// Fetch all reels
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-29d1cc3a/reels', {
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(console.log)
```

### Test Authentication
```javascript
// Login
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-29d1cc3a/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'sarah@example.com',
    password: 'demo123'
  })
})
.then(r => r.json())
.then(console.log)
```

---

## 🐛 Troubleshooting

### Issue: "Failed to load reels"
**Solution**: Check that migrations have been run and tables exist.

```sql
-- Run in SQL Editor to verify tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Issue: "Unauthorized" errors
**Solution**: Make sure you're logged in or using guest mode.
- Check browser console for the access token
- Guest mode should work for browsing content

### Issue: "No data showing"
**Solution**: Verify seed data was inserted.

```sql
-- Run in SQL Editor
SELECT COUNT(*) FROM reels;
SELECT COUNT(*) FROM micro_courses;
SELECT COUNT(*) FROM users;
```

Should return:
- reels: 15
- micro_courses: 4  
- users: 5

### Issue: "Function not found"
**Solution**: The Edge Function should auto-deploy. If not:
1. Go to **Edge Functions** in Supabase Dashboard
2. You should see `server` function
3. Check deployment logs for errors

### Issue: Login doesn't work
**Solution**: 
1. Make sure you created the auth user (not just seed data)
2. Password must be set via Supabase Auth UI or admin API
3. Try guest mode as alternative

---

## 🔄 Resetting Data

To reset and re-run migrations:

```sql
-- ⚠️ WARNING: This deletes ALL data
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS playlist_items CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS micro_course_lessons CASCADE;
DROP TABLE IF EXISTS reels CASCADE;
DROP TABLE IF EXISTS micro_courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Then re-run both migration files.

---

## 📊 Monitoring

### View Server Logs
1. Go to **Edge Functions** → **server**
2. Click **"Logs"** tab
3. Watch real-time logs of API requests

### View Database Activity
1. Go to **Database** → **Query Performance**
2. Monitor slow queries and optimize if needed

---

## 🎯 Next Steps

Now that your backend is set up:

1. ✅ Test the app - Browse reels, search courses
2. ✅ Try authentication - Login with demo account
3. ✅ Test interactions - Like reels, save to playlists
4. ✅ Upload content - Create new reels and courses
5. ✅ Monitor logs - Check Edge Function logs for errors

---

## 📚 Additional Resources

- **API Documentation**: See `/BACKEND_DOCUMENTATION.md`
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Hono Docs**: [https://hono.dev](https://hono.dev)

---

## 💡 Tips

- **Development**: Use guest mode for quick testing
- **Production**: Always use authenticated endpoints
- **Debugging**: Check browser console and Edge Function logs
- **Performance**: Database queries are optimized with indexes

---

## ✅ Checklist

Before using the app, ensure:

- [ ] Migrations run successfully in SQL Editor
- [ ] Tables visible in Table Editor
- [ ] Seed data inserted (check row counts)
- [ ] Demo user created in Authentication (optional)
- [ ] Edge Function deployed and running
- [ ] App loads without errors

---

## 🚨 Important Notes

1. **Email Server**: Auto-confirm is enabled since email server isn't configured
2. **Row Level Security**: All tables have RLS policies for security
3. **Guest Access**: Allowed for browsing, but limited functionality
4. **Demo Data**: Safe to use for testing, can be cleared anytime
5. **API Keys**: Never expose service role key to frontend

---

## 🎉 You're Ready!

Your SnapStudy backend is fully functional with:
- ✅ 30+ REST API endpoints
- ✅ 9 database tables with relationships
- ✅ Authentication with JWT
- ✅ Sample data for testing
- ✅ Frontend integration

Start exploring the app and building amazing features! 🚀
