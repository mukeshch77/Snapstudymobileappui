# SnapStudy - Quick Start Guide

Get your SnapStudy app running in 5 minutes! 🚀

## 📋 Prerequisites

- Supabase project (automatically configured in Figma Make)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## ⚡ 3-Step Setup

### Step 1: Run Database Migrations (2 minutes)

1. Open Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Copy and paste contents of `/supabase/migrations/001_initial_schema.sql`
4. Click **Run**
5. Create another new query
6. Copy and paste contents of `/supabase/migrations/002_seed_data.sql`
7. Click **Run**

✅ Done! Your database now has 9 tables with demo data.

### Step 2: Create Demo User (1 minute)

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - Email: `sarah@example.com`
   - Password: `demo123`
   - Check "Auto Confirm User"
4. Click **"Create User"**

✅ Done! You can now log in.

### Step 3: Start Using the App (30 seconds)

1. Open the SnapStudy app
2. Wait for splash screen
3. On login screen, choose one:
   - **Email Login**: Use `sarah@example.com` / `demo123`
   - **Guest Mode**: Click "Continue as Guest"
4. Start exploring!

✅ Done! You're ready to learn! 🎉

---

## 🎯 What You Can Do Now

### As Guest (No Login Required)
- ✅ Browse 15 educational reels
- ✅ Swipe up/down to navigate
- ✅ Search courses by keyword or tag
- ✅ View course details
- ✅ Explore creator profiles

### As Logged-In User
- ✅ Everything above, PLUS:
- ✅ Like reels
- ✅ Save reels to playlists
- ✅ Track course progress
- ✅ Follow creators
- ✅ Upload your own reels
- ✅ Create micro-courses

---

## 🎮 Try These Features

### 1. Browse Reels
- Go to **Home** tab
- Swipe up to see next reel
- Swipe down to go back
- Tap video to see details

### 2. Search Courses
- Go to **Search** tab
- Tap trending topics
- Or type a keyword and press Enter
- Tap a course to see lessons

### 3. Save Content
- On any reel, tap the **Bookmark** icon
- Go to **Playlists** tab to see saved reels
- Create custom playlists

### 4. Track Progress
- Open a course from Search
- Tap "Start Course"
- Complete lessons
- Watch progress bar grow!

### 5. Upload Content (Requires Login)
- Go to **Profile** tab
- Tap **Upload** button
- Add title and description
- Select tags
- Publish!

---

## 🐛 Troubleshooting

### Problem: "No reels showing"
**Solution**: Database migrations not run.
- Go back to Step 1 and run migrations

### Problem: "Login failed"
**Solution**: Demo user not created.
- Go back to Step 2 and create user
- OR use Guest Mode

### Problem: "Permission denied"
**Solution**: Try logging out and back in
- Or refresh the page

### Problem: API errors in console
**Solution**: Check Edge Function deployment
- Go to Supabase Dashboard → Edge Functions
- Ensure `server` function is deployed

---

## 📊 Verify Setup

Run these checks to ensure everything is working:

### Check 1: Database Tables ✓
```sql
-- Run in SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```
Should show 9 tables.

### Check 2: Sample Data ✓
```sql
-- Run in SQL Editor
SELECT COUNT(*) as reel_count FROM reels;
SELECT COUNT(*) as course_count FROM micro_courses;
```
Should show 15 reels and 4 courses.

### Check 3: Authentication ✓
- Login with `sarah@example.com` / `demo123`
- Should redirect to Home screen
- Should see user profile in Profile tab

### Check 4: API Connection ✓
- Open browser console (F12)
- Look for API calls to `/make-server-29d1cc3a/`
- Should see successful 200 responses

---

## 🎓 Sample Content Overview

Your app comes with pre-loaded content:

### 5 Demo Users
1. **Sarah Chen** - React Expert
2. **Alex Kumar** - Python Developer
3. **Emma Davis** - CSS Wizard
4. **Michael Brown** - JavaScript Enthusiast
5. **Lisa Wang** - DevOps Engineer

### 15 Educational Reels
Topics include:
- React Hooks
- Python Basics
- CSS Flexbox
- JavaScript Arrays
- Git Commands

### 4 Micro-Courses
1. **Complete React Mastery** (4 lessons)
2. **Python for Beginners** (3 lessons)
3. **Modern CSS Techniques** (3 lessons)
4. **JavaScript ES6+ Features** (3 lessons)

### Sample Interactions
- Pre-configured likes
- Follow relationships
- Playlists with content
- Course progress tracking

---

## 💡 Pro Tips

1. **Guest Mode First**: Try guest mode to explore before logging in
2. **Use Demo Credentials**: Login screen shows the credentials
3. **Check Console**: Open browser console for detailed logs
4. **Test Features**: Try every button and interaction
5. **Read Docs**: Check `/BACKEND_DOCUMENTATION.md` for API details

---

## 🔄 Reset & Restart

Need to start fresh? Here's how:

### Reset Data Only (Keep Schema)
```sql
-- Run in SQL Editor
DELETE FROM course_progress;
DELETE FROM playlist_items;
DELETE FROM playlists;
DELETE FROM likes;
DELETE FROM followers;
DELETE FROM micro_course_lessons;
DELETE FROM reels;
DELETE FROM micro_courses;
DELETE FROM users;
```
Then re-run `002_seed_data.sql`

### Full Reset (Everything)
```sql
-- Run in SQL Editor
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

## 📱 Feature Testing Checklist

Mark off as you test:

### Core Features
- [ ] Login with email
- [ ] Login as guest
- [ ] Browse reels feed
- [ ] Swipe up/down navigation
- [ ] Like a reel
- [ ] Save a reel
- [ ] View reel details

### Search & Discovery
- [ ] Search by keyword
- [ ] Search by tag
- [ ] Browse trending topics
- [ ] View course details
- [ ] View creator profile

### Learning Features
- [ ] Start a course
- [ ] Mark lesson complete
- [ ] View progress
- [ ] Add to playlist
- [ ] Create playlist

### Creator Features
- [ ] Upload reel
- [ ] Add tags
- [ ] Link to course
- [ ] View uploads
- [ ] Edit profile

### Navigation
- [ ] Bottom nav works
- [ ] Screen transitions smooth
- [ ] Back buttons work
- [ ] Tab switching works

---

## 📞 Need Help?

### Check These First
1. Browser console for errors (F12 → Console)
2. Network tab for API calls (F12 → Network)
3. Supabase logs (Dashboard → Edge Functions → Logs)
4. SQL Editor for database queries

### Common Issues & Fixes

**Issue**: Blank screen
- **Fix**: Check if migrations ran
- **Fix**: Refresh page
- **Fix**: Check console for errors

**Issue**: No data loading
- **Fix**: Verify seed data inserted
- **Fix**: Check API responses in Network tab
- **Fix**: Ensure Edge Function deployed

**Issue**: Login not working
- **Fix**: Create demo user in Auth
- **Fix**: Use correct credentials
- **Fix**: Try guest mode instead

---

## 🎉 You're All Set!

Your SnapStudy app is now fully functional with:
- ✅ Complete backend API
- ✅ Database with sample data
- ✅ Authentication system
- ✅ Interactive UI
- ✅ 15 reels to explore
- ✅ 4 courses to learn

**Start exploring and building amazing educational content!** 🚀📚✨

---

## 📚 Next Steps

Once you're comfortable with the basics:

1. **Read Full Documentation**
   - `/BACKEND_DOCUMENTATION.md` - All API endpoints
   - `/FEATURES.md` - Complete feature list
   - `/SETUP_GUIDE.md` - Detailed setup instructions

2. **Customize Content**
   - Add your own reels
   - Create custom courses
   - Upload video content
   - Build your audience

3. **Extend Functionality**
   - Add new features
   - Integrate AI recommendations
   - Build analytics dashboard
   - Create notification system

**Happy Learning!** 🎓
