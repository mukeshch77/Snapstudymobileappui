# SnapStudy API Quick Reference

**Base URL**: `https://{projectId}.supabase.co/functions/v1/make-server-29d1cc3a`

**Auth Header**: `Authorization: Bearer {token}`

🔒 = Requires authentication

---

## 🔐 Authentication

### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "access_token": "...", "user": {...} }
```

### Get Profile 🔒
```http
GET /auth/me
Authorization: Bearer {token}
```

### Update Profile 🔒
```http
PATCH /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Name",
  "bio": "Updated bio"
}
```

---

## 🎥 Reels

### List Reels
```http
GET /reels?page=1&limit=20
```

### Get Single Reel
```http
GET /reels/{id}
```

### Create Reel 🔒
```http
POST /reels
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Reel",
  "description": "Learn something cool",
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "duration": 60,
  "tags": ["React", "WebDev"],
  "micro_course_id": "uuid (optional)"
}
```

### Update Reel 🔒
```http
PATCH /reels/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### Delete Reel 🔒
```http
DELETE /reels/{id}
Authorization: Bearer {token}
```

### Like/Unlike Reel 🔒
```http
POST /reels/{id}/like
Authorization: Bearer {token}

Response: { "liked": true/false }
```

---

## 📚 Playlists

### Get All Playlists 🔒
```http
GET /playlists
Authorization: Bearer {token}
```

### Get Playlist 🔒
```http
GET /playlists/{id}
Authorization: Bearer {token}
```

### Create Playlist 🔒
```http
POST /playlists
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Learning Path"
}
```

### Add Reel to Playlist 🔒
```http
POST /playlists/{id}/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "reel_id": "uuid"
}
```

### Remove Reel from Playlist 🔒
```http
DELETE /playlists/{id}/remove/{reel_id}
Authorization: Bearer {token}
```

---

## 🎓 Micro-Courses

### List Courses
```http
GET /microcourses
```

### Get Course
```http
GET /microcourses/{id}
```

### Create Course 🔒
```http
POST /microcourses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Python Basics",
  "description": "Learn Python from scratch",
  "tags": ["Python", "Beginner"],
  "cover_image": "https://..."
}
```

### Add Reel to Course 🔒
```http
POST /microcourses/{id}/add-reel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reel_id": "uuid",
  "position": 1
}
```

### Get Progress 🔒
```http
GET /microcourses/{id}/progress
Authorization: Bearer {token}
```

### Update Progress 🔒
```http
POST /microcourses/{id}/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "lesson_id": "uuid",
  "completed": true
}
```

---

## 👥 Social

### Follow Creator 🔒
```http
POST /follow/{creator_id}
Authorization: Bearer {token}
```

### Unfollow Creator 🔒
```http
DELETE /follow/{creator_id}
Authorization: Bearer {token}
```

### Get Creator Profile
```http
GET /creator/{id}
```

### Get Creator's Reels
```http
GET /creator/{id}/reels
```

---

## 🔍 Search

### Full-Text Search
```http
GET /search?q=react

Response: {
  "reels": [...],
  "courses": [...],
  "creators": [...]
}
```

### Tag Search
```http
GET /search/tags?q=Python

Response: {
  "reels": [...],
  "courses": [...]
}
```

---

## 📦 Storage

### Get Upload URL 🔒
```http
POST /storage/upload-url
Authorization: Bearer {token}
Content-Type: application/json

{
  "filename": "video.mp4",
  "contentType": "video/mp4"
}

Response: {
  "bucket": "make-29d1cc3a-videos",
  "path": "user_id/timestamp.mp4",
  "uploadUrl": "https://..."
}
```

**Upload Process**:
1. Call `/storage/upload-url` to get signed URL
2. PUT video file to the returned `uploadUrl`
3. Use returned `path` as `video_url` in reel creation

---

## 🚦 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not owner) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 📝 Error Format

All errors return:
```json
{
  "error": "Descriptive error message"
}
```

---

## 🔗 Frontend Integration

### JavaScript Example

```javascript
import { reelsAPI, authAPI } from './utils/api';

// Login
const { access_token } = await authAPI.login(email, password);

// Get reels
const { data, pagination } = await reelsAPI.getAll(1, 20);

// Like reel
await reelsAPI.like(reelId);

// Create reel
await reelsAPI.create({
  title: "My Reel",
  description: "...",
  video_url: "...",
  tags: ["React"]
});
```

---

## 💡 Tips

1. **Authentication**: Store token in localStorage
2. **Pagination**: Use `page` and `limit` query params
3. **Search**: Press Enter or click search button
4. **File Upload**: Use two-step process (get URL, then upload)
5. **Error Handling**: Always check response status
6. **Guest Mode**: Some endpoints work without auth

---

## 📊 Response Examples

### Reel Object
```json
{
  "id": "uuid",
  "title": "Master React Hooks",
  "description": "Learn useState and useEffect",
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "duration": 62,
  "tags": ["React", "WebDev"],
  "creator": {
    "id": "uuid",
    "name": "Sarah Chen",
    "avatar_url": "https://..."
  },
  "likes": [{ "count": 1234 }],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Course Object
```json
{
  "id": "uuid",
  "title": "Complete React Mastery",
  "description": "Master React from basics...",
  "tags": ["React", "JavaScript"],
  "creator": {
    "id": "uuid",
    "name": "Sarah Chen"
  },
  "lessons": [
    {
      "id": "uuid",
      "position": 1,
      "reel": {
        "id": "uuid",
        "title": "Lesson 1",
        "duration": 80
      }
    }
  ]
}
```

### Progress Object
```json
{
  "user_id": "uuid",
  "course_id": "uuid",
  "completed_lessons": ["lesson1_uuid", "lesson2_uuid"],
  "progress_percentage": 40,
  "last_accessed_at": "2024-01-01T00:00:00Z"
}
```

---

## 🔧 Development Tools

### cURL Example
```bash
curl -X GET \
  "https://{projectId}.supabase.co/functions/v1/make-server-29d1cc3a/reels" \
  -H "Authorization: Bearer {anonKey}"
```

### Postman Collection
Import endpoints with base URL:
```
https://{projectId}.supabase.co/functions/v1/make-server-29d1cc3a
```

---

## 📖 Full Documentation

For detailed API documentation, see:
- `/BACKEND_DOCUMENTATION.md` - Complete API reference
- `/SETUP_GUIDE.md` - Setup instructions
- `/QUICKSTART.md` - Get started quickly

---

**Built with ❤️ using Supabase + Hono + TypeScript**
