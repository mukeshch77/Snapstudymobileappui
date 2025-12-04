import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Create Supabase client helper
const getSupabaseClient = (authToken?: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = authToken 
    ? Deno.env.get('SUPABASE_ANON_KEY')!
    : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  });
};

// Auth middleware
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Auth error:', error);
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }

  c.set('user', user);
  c.set('token', token);
  await next();
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Sign up with email/password
app.post('/make-server-29d1cc3a/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = getSupabaseClient();

    // Create user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
      user_metadata: { name },
    });

    if (authError) {
      console.log('Signup error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3C7EFF&color=fff`,
        bio: '',
      });

    if (profileError) {
      console.log('Profile creation error:', profileError);
    }

    return c.json({
      user: authData.user,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Login with email/password
app.post('/make-server-29d1cc3a/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: error.message }, 401);
    }

    return c.json({
      access_token: data.session.access_token,
      user: data.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error during login' }, 500);
  }
});

// Get current user profile
app.get('/make-server-29d1cc3a/auth/me', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('Get user error:', error);
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update user profile
app.patch('/make-server-29d1cc3a/auth/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.log('Update profile error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// REELS ROUTES
// ============================================

// Get all reels (paginated)
app.get('/make-server-29d1cc3a/reels', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = getSupabaseClient();

    const { data, error, count } = await supabase
      .from('reels')
      .select(`
        *,
        creator:users!reels_creator_id_fkey(id, name, avatar_url),
        likes:likes(count),
        micro_course:micro_courses(id, title)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.log('Get reels error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get reels error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get single reel
app.get('/make-server-29d1cc3a/reels/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('reels')
      .select(`
        *,
        creator:users!reels_creator_id_fkey(id, name, avatar_url, bio),
        likes:likes(count),
        micro_course:micro_courses(id, title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.log('Get reel error:', error);
      return c.json({ error: 'Reel not found' }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get reel error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create/Upload reel
app.post('/make-server-29d1cc3a/reels', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { title, description, tags, video_url, thumbnail_url, duration, micro_course_id } = await c.req.json();

    if (!title || !video_url) {
      return c.json({ error: 'Title and video_url are required' }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('reels')
      .insert({
        title,
        description: description || '',
        tags: tags || [],
        video_url,
        thumbnail_url: thumbnail_url || '',
        duration: duration || 60,
        creator_id: user.id,
        micro_course_id: micro_course_id || null,
      })
      .select(`
        *,
        creator:users!reels_creator_id_fkey(id, name, avatar_url)
      `)
      .single();

    if (error) {
      console.log('Create reel error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    console.error('Create reel error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update reel
app.patch('/make-server-29d1cc3a/reels/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    const updates = await c.req.json();
    const supabase = getSupabaseClient();

    // Check ownership
    const { data: reel } = await supabase
      .from('reels')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!reel || reel.creator_id !== user.id) {
      return c.json({ error: 'Unauthorized - Not your reel' }, 403);
    }

    const { data, error } = await supabase
      .from('reels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Update reel error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error('Update reel error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete reel
app.delete('/make-server-29d1cc3a/reels/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    // Check ownership
    const { data: reel } = await supabase
      .from('reels')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!reel || reel.creator_id !== user.id) {
      return c.json({ error: 'Unauthorized - Not your reel' }, 403);
    }

    const { error } = await supabase
      .from('reels')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Delete reel error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: 'Reel deleted successfully' });
  } catch (error) {
    console.error('Delete reel error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Like a reel
app.post('/make-server-29d1cc3a/reels/:id/like', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const reelId = c.req.param('id');
    const supabase = getSupabaseClient();

    // Check if already liked
    const { data: existing } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('reel_id', reelId)
      .single();

    if (existing) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('reel_id', reelId);

      if (error) {
        console.log('Unlike error:', error);
        return c.json({ error: error.message }, 400);
      }

      return c.json({ liked: false, message: 'Reel unliked' });
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          reel_id: reelId,
        });

      if (error) {
        console.log('Like error:', error);
        return c.json({ error: error.message }, 400);
      }

      return c.json({ liked: true, message: 'Reel liked' });
    }
  } catch (error) {
    console.error('Like/unlike error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// PLAYLISTS ROUTES
// ============================================

// Get user's playlists
app.get('/make-server-29d1cc3a/playlists', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        items:playlist_items(
          id,
          reel:reels(id, title, thumbnail_url)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Get playlists error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get playlists error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get single playlist
app.get('/make-server-29d1cc3a/playlists/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        items:playlist_items(
          id,
          reel:reels(
            *,
            creator:users!reels_creator_id_fkey(id, name, avatar_url)
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.log('Get playlist error:', error);
      return c.json({ error: 'Playlist not found' }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get playlist error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create playlist
app.post('/make-server-29d1cc3a/playlists', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { title } = await c.req.json();

    if (!title) {
      return c.json({ error: 'Title is required' }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: user.id,
        title,
      })
      .select()
      .single();

    if (error) {
      console.log('Create playlist error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    console.error('Create playlist error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Add reel to playlist
app.post('/make-server-29d1cc3a/playlists/:id/add', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const playlistId = c.req.param('id');
    const { reel_id } = await c.req.json();

    if (!reel_id) {
      return c.json({ error: 'reel_id is required' }, 400);
    }

    const supabase = getSupabaseClient();

    // Verify playlist ownership
    const { data: playlist } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', playlistId)
      .single();

    if (!playlist || playlist.user_id !== user.id) {
      return c.json({ error: 'Unauthorized - Not your playlist' }, 403);
    }

    // Check if already in playlist
    const { data: existing } = await supabase
      .from('playlist_items')
      .select('*')
      .eq('playlist_id', playlistId)
      .eq('reel_id', reel_id)
      .single();

    if (existing) {
      return c.json({ error: 'Reel already in playlist' }, 400);
    }

    const { data, error } = await supabase
      .from('playlist_items')
      .insert({
        playlist_id: playlistId,
        reel_id,
      })
      .select()
      .single();

    if (error) {
      console.log('Add to playlist error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    console.error('Add to playlist error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Remove reel from playlist
app.delete('/make-server-29d1cc3a/playlists/:id/remove/:reel_id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const playlistId = c.req.param('id');
    const reelId = c.req.param('reel_id');
    const supabase = getSupabaseClient();

    // Verify playlist ownership
    const { data: playlist } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', playlistId)
      .single();

    if (!playlist || playlist.user_id !== user.id) {
      return c.json({ error: 'Unauthorized - Not your playlist' }, 403);
    }

    const { error } = await supabase
      .from('playlist_items')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('reel_id', reelId);

    if (error) {
      console.log('Remove from playlist error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: 'Reel removed from playlist' });
  } catch (error) {
    console.error('Remove from playlist error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// MICRO-COURSES ROUTES
// ============================================

// Get all micro-courses
app.get('/make-server-29d1cc3a/microcourses', async (c) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('micro_courses')
      .select(`
        *,
        creator:users!micro_courses_creator_id_fkey(id, name, avatar_url),
        lessons:micro_course_lessons(
          id,
          position,
          reel:reels(id, title, duration)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Get micro-courses error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get micro-courses error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get single micro-course
app.get('/make-server-29d1cc3a/microcourses/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('micro_courses')
      .select(`
        *,
        creator:users!micro_courses_creator_id_fkey(id, name, avatar_url),
        lessons:micro_course_lessons(
          id,
          position,
          reel:reels(
            id,
            title,
            description,
            duration,
            thumbnail_url,
            tags
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.log('Get micro-course error:', error);
      return c.json({ error: 'Micro-course not found' }, 404);
    }

    // Sort lessons by position
    if (data.lessons) {
      data.lessons.sort((a: any, b: any) => a.position - b.position);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get micro-course error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create micro-course
app.post('/make-server-29d1cc3a/microcourses', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { title, description, tags, cover_image } = await c.req.json();

    if (!title) {
      return c.json({ error: 'Title is required' }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('micro_courses')
      .insert({
        creator_id: user.id,
        title,
        description: description || '',
        tags: tags || [],
        cover_image: cover_image || '',
      })
      .select(`
        *,
        creator:users!micro_courses_creator_id_fkey(id, name, avatar_url)
      `)
      .single();

    if (error) {
      console.log('Create micro-course error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    console.error('Create micro-course error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Add reel to micro-course
app.post('/make-server-29d1cc3a/microcourses/:id/add-reel', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const courseId = c.req.param('id');
    const { reel_id, position } = await c.req.json();

    if (!reel_id) {
      return c.json({ error: 'reel_id is required' }, 400);
    }

    const supabase = getSupabaseClient();

    // Verify course ownership
    const { data: course } = await supabase
      .from('micro_courses')
      .select('creator_id')
      .eq('id', courseId)
      .single();

    if (!course || course.creator_id !== user.id) {
      return c.json({ error: 'Unauthorized - Not your course' }, 403);
    }

    // Get next position if not provided
    let lessonPosition = position;
    if (!lessonPosition) {
      const { data: lessons } = await supabase
        .from('micro_course_lessons')
        .select('position')
        .eq('course_id', courseId)
        .order('position', { ascending: false })
        .limit(1);

      lessonPosition = lessons && lessons.length > 0 ? lessons[0].position + 1 : 1;
    }

    const { data, error } = await supabase
      .from('micro_course_lessons')
      .insert({
        course_id: courseId,
        reel_id,
        position: lessonPosition,
      })
      .select()
      .single();

    if (error) {
      console.log('Add reel to course error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    console.error('Add reel to course error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user's progress on a course
app.get('/make-server-29d1cc3a/microcourses/:id/progress', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const courseId = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.log('Get progress error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || { completed_lessons: [], progress_percentage: 0 });
  } catch (error) {
    console.error('Get progress error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update course progress
app.post('/make-server-29d1cc3a/microcourses/:id/progress', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const courseId = c.req.param('id');
    const { lesson_id, completed } = await c.req.json();

    if (!lesson_id) {
      return c.json({ error: 'lesson_id is required' }, 400);
    }

    const supabase = getSupabaseClient();

    // Get current progress
    const { data: currentProgress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    let completedLessons = currentProgress?.completed_lessons || [];

    if (completed && !completedLessons.includes(lesson_id)) {
      completedLessons.push(lesson_id);
    } else if (!completed) {
      completedLessons = completedLessons.filter((id: string) => id !== lesson_id);
    }

    // Get total lessons
    const { data: lessons } = await supabase
      .from('micro_course_lessons')
      .select('id')
      .eq('course_id', courseId);

    const totalLessons = lessons?.length || 1;
    const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

    const { data, error } = await supabase
      .from('course_progress')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        completed_lessons: completedLessons,
        progress_percentage: progressPercentage,
      })
      .select()
      .single();

    if (error) {
      console.log('Update progress error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error('Update progress error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// FOLLOW SYSTEM ROUTES
// ============================================

// Follow a creator
app.post('/make-server-29d1cc3a/follow/:creator_id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const creatorId = c.req.param('creator_id');

    if (user.id === creatorId) {
      return c.json({ error: 'Cannot follow yourself' }, 400);
    }

    const supabase = getSupabaseClient();

    // Check if already following
    const { data: existing } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', user.id)
      .eq('followee_id', creatorId)
      .single();

    if (existing) {
      return c.json({ error: 'Already following this user' }, 400);
    }

    const { data, error } = await supabase
      .from('followers')
      .insert({
        follower_id: user.id,
        followee_id: creatorId,
      })
      .select()
      .single();

    if (error) {
      console.log('Follow error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ following: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Follow error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Unfollow a creator
app.delete('/make-server-29d1cc3a/follow/:creator_id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const creatorId = c.req.param('creator_id');
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', user.id)
      .eq('followee_id', creatorId);

    if (error) {
      console.log('Unfollow error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ following: false, message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get creator profile
app.get('/make-server-29d1cc3a/creator/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userError) {
      console.log('Get creator error:', userError);
      return c.json({ error: 'Creator not found' }, 404);
    }

    // Get follower/following counts
    const { count: followersCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('followee_id', id);

    const { count: followingCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', id);

    // Get course count
    const { count: coursesCount } = await supabase
      .from('micro_courses')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', id);

    return c.json({
      ...user,
      followers_count: followersCount || 0,
      following_count: followingCount || 0,
      courses_count: coursesCount || 0,
    });
  } catch (error) {
    console.error('Get creator error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get creator's reels
app.get('/make-server-29d1cc3a/creator/:id/reels', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('reels')
      .select(`
        *,
        creator:users!reels_creator_id_fkey(id, name, avatar_url),
        likes:likes(count)
      `)
      .eq('creator_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Get creator reels error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get creator reels error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// SEARCH ROUTES
// ============================================

// Search across reels, courses, and creators
app.get('/make-server-29d1cc3a/search', async (c) => {
  try {
    const query = c.req.query('q');
    
    if (!query) {
      return c.json({ error: 'Query parameter q is required' }, 400);
    }

    const supabase = getSupabaseClient();
    const searchTerm = `%${query}%`;

    // Search reels
    const { data: reels } = await supabase
      .from('reels')
      .select(`
        *,
        creator:users!reels_creator_id_fkey(id, name, avatar_url)
      `)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(10);

    // Search micro-courses
    const { data: courses } = await supabase
      .from('micro_courses')
      .select(`
        *,
        creator:users!micro_courses_creator_id_fkey(id, name, avatar_url)
      `)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(10);

    // Search creators
    const { data: creators } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
      .limit(10);

    return c.json({
      reels: reels || [],
      courses: courses || [],
      creators: creators || [],
    });
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Search by tags
app.get('/make-server-29d1cc3a/search/tags', async (c) => {
  try {
    const query = c.req.query('q');
    
    if (!query) {
      return c.json({ error: 'Query parameter q is required' }, 400);
    }

    const supabase = getSupabaseClient();

    const { data: reels } = await supabase
      .from('reels')
      .select(`
        *,
        creator:users!reels_creator_id_fkey(id, name, avatar_url)
      `)
      .contains('tags', [query])
      .limit(20);

    const { data: courses } = await supabase
      .from('micro_courses')
      .select(`
        *,
        creator:users!micro_courses_creator_id_fkey(id, name, avatar_url)
      `)
      .contains('tags', [query])
      .limit(20);

    return c.json({
      reels: reels || [],
      courses: courses || [],
    });
  } catch (error) {
    console.error('Tag search error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// STORAGE: Get upload URL for video
// ============================================

app.post('/make-server-29d1cc3a/storage/upload-url', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { filename, contentType } = await c.req.json();

    if (!filename) {
      return c.json({ error: 'filename is required' }, 400);
    }

    const supabase = getSupabaseClient();

    // Create bucket if it doesn't exist
    const bucketName = 'make-29d1cc3a-videos';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      });
    }

    // Generate unique filename
    const ext = filename.split('.').pop();
    const uniqueFilename = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    return c.json({
      bucket: bucketName,
      path: uniqueFilename,
      uploadUrl: `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/${bucketName}/${uniqueFilename}`,
    });
  } catch (error) {
    console.error('Get upload URL error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-29d1cc3a/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
Deno.serve(app.fetch);
