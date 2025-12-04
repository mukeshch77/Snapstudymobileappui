# SnapStudy Backend Documentation

## 🏗️ Architecture Overview

SnapStudy uses a **three-tier architecture** with:
- **Frontend**: React + TypeScript (mobile UI)
- **Server**: Hono web server on Supabase Edge Functions
- **Database**: PostgreSQL with Row Level Security (RLS)

```
Frontend (React) → API (Hono/Deno) → Database (PostgreSQL)
```

## 🔐 Authentication

### JWT-Based Auth with Supabase
All authenticated endpoints require an `Authorization: Bearer {token}` header.

### API Endpoints

#### `POST /auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "message": "User created successfully"
}
```

#### `POST /auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### `GET /auth/me` 🔒
Get current user profile (requires authentication).

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": "https://...",
  "bio": "User bio"
}
```

#### `PATCH /auth/profile` 🔒
Update user profile.

**Request Body:**
```json
{
  "name": "New Name",
  "bio": "Updated bio"
}
```

---

## 🎥 Reels (Educational Videos)

### API Endpoints

#### `GET /reels?page=1&limit=20`
Get paginated list of reels.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Master React Hooks in 60 Seconds",
      "description": "Learn useState and useEffect...",
      "video_url": "https://...",
      "thumbnail_url": "https://...",
      "duration": 62,
      "tags": ["React", "WebDev", "Hooks"],
      "creator": {
        "id": "uuid",
        "name": "Sarah Chen",
        "avatar_url": "https://..."
      },
      "likes": [{ "count": 1234 }],
      "micro_course": {
        "id": "uuid",
        "title": "Complete React Mastery"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### `GET /reels/:id`
Get single reel by ID.

#### `POST /reels` 🔒
Create a new reel (creators only).

**Request Body:**
```json
{
  "title": "JavaScript Tips",
  "description": "Quick JavaScript tips",
  "video_url": "https://storage.supabase.co/...",
  "thumbnail_url": "https://...",
  "duration": 60,
  "tags": ["JavaScript", "Tips"],
  "micro_course_id": "uuid (optional)"
}
```

#### `PATCH /reels/:id` 🔒
Update reel metadata (creator only).

#### `DELETE /reels/:id` 🔒
Delete a reel (creator only).

#### `POST /reels/:id/like` 🔒
Like/unlike a reel (toggles).

**Response:**
```json
{
  "liked": true,
  "message": "Reel liked"
}
```

---

## 📚 Playlists

### API Endpoints

#### `GET /playlists` 🔒
Get user's playlists.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "My Learning Path",
    "user_id": "uuid",
    "items": [
      {
        "id": "uuid",
        "reel": {
          "id": "uuid",
          "title": "React Hooks",
          "thumbnail_url": "https://..."
        }
      }
    ]
  }
]
```

#### `GET /playlists/:id` 🔒
Get single playlist with all reels.

#### `POST /playlists` 🔒
Create a new playlist.

**Request Body:**
```json
{
  "title": "Web Dev Essentials"
}
```

#### `POST /playlists/:id/add` 🔒
Add reel to playlist.

**Request Body:**
```json
{
  "reel_id": "uuid"
}
```

#### `DELETE /playlists/:id/remove/:reel_id` 🔒
Remove reel from playlist.

---

## 🎓 Micro-Courses

### API Endpoints

#### `GET /microcourses`
Get all micro-courses.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Complete React Mastery",
    "description": "Master React from basics...",
    "cover_image": "https://...",
    "tags": ["React", "JavaScript"],
    "creator": {
      "id": "uuid",
      "name": "Sarah Chen",
      "avatar_url": "https://..."
    },
    "lessons": [
      {
        "id": "uuid",
        "position": 1,
        "reel": {
          "id": "uuid",
          "title": "Introduction to React",
          "duration": 80
        }
      }
    ]
  }
]
```

#### `GET /microcourses/:id`
Get single course with all lessons.

#### `POST /microcourses` 🔒
Create a new micro-course.

**Request Body:**
```json
{
  "title": "Python Basics",
  "description": "Learn Python from scratch",
  "tags": ["Python", "Beginner"],
  "cover_image": "https://..."
}
```

#### `POST /microcourses/:id/add-reel` 🔒
Add a reel as a lesson.

**Request Body:**
```json
{
  "reel_id": "uuid",
  "position": 3
}
```

#### `GET /microcourses/:id/progress` 🔒
Get user's progress on a course.

**Response:**
```json
{
  "user_id": "uuid",
  "course_id": "uuid",
  "completed_lessons": ["lesson_uuid_1", "lesson_uuid_2"],
  "progress_percentage": 40
}
```

#### `POST /microcourses/:id/progress` 🔒
Update course progress (mark lesson complete/incomplete).

**Request Body:**
```json
{
  "lesson_id": "uuid",
  "completed": true
}
```

---

## 👥 Follow System

### API Endpoints

#### `POST /follow/:creator_id` 🔒
Follow a creator.

**Response:**
```json
{
  "following": true,
  "message": "Followed successfully"
}
```

#### `DELETE /follow/:creator_id` 🔒
Unfollow a creator.

#### `GET /creator/:id`
Get creator profile with stats.

**Response:**
```json
{
  "id": "uuid",
  "name": "Sarah Chen",
  "email": "sarah@example.com",
  "avatar_url": "https://...",
  "bio": "React expert...",
  "followers_count": 1250,
  "following_count": 43,
  "courses_count": 8
}
```

#### `GET /creator/:id/reels`
Get all reels by a creator.

---

## 🔍 Search

### API Endpoints

#### `GET /search?q=keyword`
Search across reels, courses, and creators.

**Response:**
```json
{
  "reels": [...],
  "courses": [...],
  "creators": [...]
}
```

#### `GET /search/tags?q=React`
Search by tag.

**Response:**
```json
{
  "reels": [...],
  "courses": [...]
}
```

---

## 📦 Storage (Video Upload)

### API Endpoints

#### `POST /storage/upload-url` 🔒
Get a signed URL for uploading videos.

**Request Body:**
```json
{
  "filename": "myvideo.mp4",
  "contentType": "video/mp4"
}
```

**Response:**
```json
{
  "bucket": "make-29d1cc3a-videos",
  "path": "user_uuid/timestamp-random.mp4",
  "uploadUrl": "https://supabase.co/storage/v1/object/..."
}
```

**Usage:**
1. Call this endpoint to get upload URL
2. Upload file directly to the returned URL using PUT request
3. Use the returned path as `video_url` when creating a reel

---

## 🗄️ Database Schema

### Tables

#### `users`
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- name (TEXT)
- avatar_url (TEXT)
- bio (TEXT)
- created_at (TIMESTAMP)
```

#### `reels`
```sql
- id (UUID, PK)
- creator_id (UUID, FK → users)
- title (TEXT)
- description (TEXT)
- video_url (TEXT)
- thumbnail_url (TEXT)
- duration (INTEGER, seconds)
- tags (TEXT[])
- micro_course_id (UUID, FK → micro_courses, nullable)
- view_count (INTEGER)
- created_at (TIMESTAMP)
```

#### `micro_courses`
```sql
- id (UUID, PK)
- creator_id (UUID, FK → users)
- title (TEXT)
- description (TEXT)
- cover_image (TEXT)
- tags (TEXT[])
- created_at (TIMESTAMP)
```

#### `micro_course_lessons`
```sql
- id (UUID, PK)
- course_id (UUID, FK → micro_courses)
- reel_id (UUID, FK → reels)
- position (INTEGER)
- UNIQUE(course_id, reel_id)
```

#### `playlists`
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- title (TEXT)
- created_at (TIMESTAMP)
```

#### `playlist_items`
```sql
- id (UUID, PK)
- playlist_id (UUID, FK → playlists)
- reel_id (UUID, FK → reels)
- added_at (TIMESTAMP)
- UNIQUE(playlist_id, reel_id)
```

#### `likes`
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- reel_id (UUID, FK → reels)
- created_at (TIMESTAMP)
- UNIQUE(user_id, reel_id)
```

#### `followers`
```sql
- id (UUID, PK)
- follower_id (UUID, FK → users)
- followee_id (UUID, FK → users)
- created_at (TIMESTAMP)
- UNIQUE(follower_id, followee_id)
- CHECK(follower_id != followee_id)
```

#### `course_progress`
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- course_id (UUID, FK → micro_courses)
- completed_lessons (UUID[])
- progress_percentage (INTEGER)
- last_accessed_at (TIMESTAMP)
- UNIQUE(user_id, course_id)
```

---

## 🔒 Security (Row Level Security)

All tables use Supabase RLS policies:

- **Public Read**: Reels, courses, user profiles
- **Authenticated Write**: Users can create content
- **Owner-Only**: Users can only edit/delete their own content
- **Private**: Playlists, progress data visible only to owner

---

## 🧪 Testing with Seed Data

The database includes seed data with:
- 5 demo users
- 15 reels across 4 courses
- Sample likes, followers, and playlists

**Demo Credentials:**
```
Email: sarah@example.com
Password: demo123
```

---

## 🚀 Deployment

The backend is automatically deployed on Supabase Edge Functions. 

**Base URL:**
```
https://{projectId}.supabase.co/functions/v1/make-server-29d1cc3a
```

**Environment Variables (automatic):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 📝 Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Descriptive error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not owner)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔗 Frontend Integration

See `/utils/api.ts` for helper functions:

```typescript
import { reelsAPI, authAPI, coursesAPI } from './utils/api';

// Example usage
const reels = await reelsAPI.getAll();
await authAPI.login(email, password);
await reelsAPI.like(reelId);
```

---

## 📊 API Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- Rate limiting per user/IP
- Request throttling
- Caching frequently accessed data

---

## 🎯 Next Steps

Potential enhancements:
1. **Real-time features** using Supabase Realtime
2. **Comments system** for reels
3. **Notifications** for new followers/likes
4. **AI recommendations** based on viewing history
5. **Video transcoding** for multiple resolutions
6. **Analytics dashboard** for creators

---

## 📞 Support

For issues or questions, check:
- Console logs for detailed error messages
- Supabase dashboard for database queries
- Edge Function logs for server errors
