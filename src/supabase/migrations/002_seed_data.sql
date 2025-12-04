-- ============================================
-- SEED DATA FOR SNAPSTUDY
-- ============================================

-- Insert sample users (Note: In production, these would be created via Supabase Auth)
-- For development, we'll create them directly
INSERT INTO users (id, email, name, avatar_url, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'sarah@example.com', 'Sarah Chen', 'https://ui-avatars.com/api/?name=Sarah+Chen&background=3C7EFF&color=fff', 'React expert and educator. Teaching web development for 5+ years.'),
  ('22222222-2222-2222-2222-222222222222', 'alex@example.com', 'Alex Kumar', 'https://ui-avatars.com/api/?name=Alex+Kumar&background=FF6B6B&color=fff', 'Python developer and data science enthusiast.'),
  ('33333333-3333-3333-3333-333333333333', 'emma@example.com', 'Emma Davis', 'https://ui-avatars.com/api/?name=Emma+Davis&background=4ECDC4&color=fff', 'CSS wizard and UI/UX designer. Making the web beautiful.'),
  ('44444444-4444-4444-4444-444444444444', 'michael@example.com', 'Michael Brown', 'https://ui-avatars.com/api/?name=Michael+Brown&background=95E1D3&color=fff', 'JavaScript enthusiast. Passionate about clean code.'),
  ('55555555-5555-5555-5555-555555555555', 'lisa@example.com', 'Lisa Wang', 'https://ui-avatars.com/api/?name=Lisa+Wang&background=F38181&color=fff', 'DevOps engineer and Git guru.')
ON CONFLICT (id) DO NOTHING;

-- Insert micro courses
INSERT INTO micro_courses (id, creator_id, title, description, cover_image, tags) VALUES
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Complete React Mastery', 'Master React from basics to advanced concepts through bite-sized video lessons. Perfect for beginners and intermediate developers.', '', ARRAY['React', 'JavaScript', 'WebDev']),
  ('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Python for Beginners', 'Learn Python programming from scratch with practical examples and real-world applications.', '', ARRAY['Python', 'Programming', 'Beginner']),
  ('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Modern CSS Techniques', 'Build beautiful, responsive websites with modern CSS including Flexbox, Grid, and animations.', '', ARRAY['CSS', 'WebDev', 'Design']),
  ('c4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'JavaScript ES6+ Features', 'Explore modern JavaScript features including arrow functions, destructuring, and async/await.', '', ARRAY['JavaScript', 'ES6', 'WebDev'])
ON CONFLICT (id) DO NOTHING;

-- Insert reels
INSERT INTO reels (id, creator_id, title, description, video_url, thumbnail_url, duration, tags, micro_course_id) VALUES
  -- React Course Reels
  ('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Master React Hooks in 60 Seconds', 'Learn the fundamentals of React Hooks including useState and useEffect in this quick tutorial.', 'https://placeholder-video.com/react-hooks', '', 62, ARRAY['React', 'WebDev', 'Hooks'], 'c1111111-1111-1111-1111-111111111111'),
  ('r1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Components and Props Explained', 'Understanding React components and how to pass data with props.', 'https://placeholder-video.com/react-props', '', 75, ARRAY['React', 'WebDev', 'Components'], 'c1111111-1111-1111-1111-111111111111'),
  ('r1111113-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'State Management with useState', 'Deep dive into managing component state with the useState hook.', 'https://placeholder-video.com/react-state', '', 68, ARRAY['React', 'WebDev', 'State'], 'c1111111-1111-1111-1111-111111111111'),
  ('r1111114-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'useEffect Hook Deep Dive', 'Master side effects in React with useEffect hook.', 'https://placeholder-video.com/react-useeffect', '', 82, ARRAY['React', 'WebDev', 'Hooks'], 'c1111111-1111-1111-1111-111111111111'),
  
  -- Python Course Reels
  ('r2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Python List Comprehension Explained', 'Discover the power of Python list comprehensions and write cleaner, more efficient code.', 'https://placeholder-video.com/python-list', '', 55, ARRAY['Python', 'Programming', 'Tips'], 'c2222222-2222-2222-2222-222222222222'),
  ('r2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Python Functions Made Easy', 'Learn how to write clean and reusable Python functions.', 'https://placeholder-video.com/python-functions', '', 70, ARRAY['Python', 'Programming', 'Functions'], 'c2222222-2222-2222-2222-222222222222'),
  ('r2222223-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Variables and Data Types', 'Understanding Python variables and basic data types.', 'https://placeholder-video.com/python-vars', '', 58, ARRAY['Python', 'Programming', 'Basics'], 'c2222222-2222-2222-2222-222222222222'),
  
  -- CSS Course Reels
  ('r3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'CSS Flexbox Made Simple', 'Master CSS Flexbox layout in under a minute with practical examples.', 'https://placeholder-video.com/css-flexbox', '', 58, ARRAY['CSS', 'WebDev', 'Design'], 'c3333333-3333-3333-3333-333333333333'),
  ('r3333332-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'CSS Grid Layout Basics', 'Learn CSS Grid and create complex layouts with ease.', 'https://placeholder-video.com/css-grid', '', 72, ARRAY['CSS', 'WebDev', 'Layout'], 'c3333333-3333-3333-3333-333333333333'),
  ('r3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Responsive Design Patterns', 'Essential responsive design techniques for modern websites.', 'https://placeholder-video.com/css-responsive', '', 65, ARRAY['CSS', 'WebDev', 'Responsive'], 'c3333333-3333-3333-3333-333333333333'),
  
  -- JavaScript Course Reels
  ('r4444441-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'JavaScript Array Methods You Need', 'Essential JavaScript array methods like map, filter, and reduce explained quickly.', 'https://placeholder-video.com/js-arrays', '', 63, ARRAY['JavaScript', 'Arrays', 'WebDev'], 'c4444444-4444-4444-4444-444444444444'),
  ('r4444442-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Arrow Functions Explained', 'Master ES6 arrow functions and when to use them.', 'https://placeholder-video.com/js-arrow', '', 52, ARRAY['JavaScript', 'ES6', 'Functions'], 'c4444444-4444-4444-4444-444444444444'),
  ('r4444443-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Async/Await Made Easy', 'Simplify asynchronous JavaScript with async/await.', 'https://placeholder-video.com/js-async', '', 78, ARRAY['JavaScript', 'Async', 'ES6'], 'c4444444-4444-4444-4444-444444444444'),
  
  -- Standalone Reels
  ('r5555551-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Quick Git Commands Cheat Sheet', 'The most important Git commands you need to know for daily development.', 'https://placeholder-video.com/git-commands', '', 60, ARRAY['Git', 'DevTools', 'Productivity'], NULL),
  ('r5555552-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Git Branching Strategies', 'Learn effective Git branching workflows for team collaboration.', 'https://placeholder-video.com/git-branch', '', 67, ARRAY['Git', 'DevTools', 'Workflow'], NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert micro course lessons (linking reels to courses)
INSERT INTO micro_course_lessons (course_id, reel_id, position) VALUES
  -- React Course
  ('c1111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 1),
  ('c1111111-1111-1111-1111-111111111111', 'r1111112-1111-1111-1111-111111111111', 2),
  ('c1111111-1111-1111-1111-111111111111', 'r1111113-1111-1111-1111-111111111111', 3),
  ('c1111111-1111-1111-1111-111111111111', 'r1111114-1111-1111-1111-111111111111', 4),
  
  -- Python Course
  ('c2222222-2222-2222-2222-222222222222', 'r2222223-2222-2222-2222-222222222222', 1),
  ('c2222222-2222-2222-2222-222222222222', 'r2222222-2222-2222-2222-222222222222', 2),
  ('c2222222-2222-2222-2222-222222222222', 'r2222221-2222-2222-2222-222222222222', 3),
  
  -- CSS Course
  ('c3333333-3333-3333-3333-333333333333', 'r3333331-3333-3333-3333-333333333333', 1),
  ('c3333333-3333-3333-3333-333333333333', 'r3333332-3333-3333-3333-333333333333', 2),
  ('c3333333-3333-3333-3333-333333333333', 'r3333333-3333-3333-3333-333333333333', 3),
  
  -- JavaScript Course
  ('c4444444-4444-4444-4444-444444444444', 'r4444442-4444-4444-4444-444444444444', 1),
  ('c4444444-4444-4444-4444-444444444444', 'r4444441-4444-4444-4444-444444444444', 2),
  ('c4444444-4444-4444-4444-444444444444', 'r4444443-4444-4444-4444-444444444444', 3)
ON CONFLICT (course_id, reel_id) DO NOTHING;

-- Insert sample likes
INSERT INTO likes (user_id, reel_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'r2222221-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', 'r3333331-3333-3333-3333-333333333333'),
  ('22222222-2222-2222-2222-222222222222', 'r1111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222', 'r4444441-4444-4444-4444-444444444444'),
  ('33333333-3333-3333-3333-333333333333', 'r1111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', 'r3333331-3333-3333-3333-333333333333')
ON CONFLICT (user_id, reel_id) DO NOTHING;

-- Insert sample followers
INSERT INTO followers (follower_id, followee_id) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333'),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (follower_id, followee_id) DO NOTHING;

-- Insert sample playlists
INSERT INTO playlists (id, user_id, title) VALUES
  ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'My Learning Path'),
  ('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Saved for Later'),
  ('p3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Web Dev Essentials')
ON CONFLICT (id) DO NOTHING;

-- Insert sample playlist items
INSERT INTO playlist_items (playlist_id, reel_id) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'r2222221-2222-2222-2222-222222222222'),
  ('p1111111-1111-1111-1111-111111111111', 'r3333331-3333-3333-3333-333333333333'),
  ('p2222222-2222-2222-2222-222222222222', 'r1111111-1111-1111-1111-111111111111'),
  ('p3333333-3333-3333-3333-333333333333', 'r1111111-1111-1111-1111-111111111111'),
  ('p3333333-3333-3333-3333-333333333333', 'r4444441-4444-4444-4444-444444444444')
ON CONFLICT (playlist_id, reel_id) DO NOTHING;

-- Insert sample course progress
INSERT INTO course_progress (user_id, course_id, completed_lessons, progress_percentage) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', ARRAY['r2222223-2222-2222-2222-222222222222'::UUID], 33),
  ('22222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', ARRAY['r1111111-1111-1111-1111-111111111111'::UUID, 'r1111112-1111-1111-1111-111111111111'::UUID], 50),
  ('33333333-3333-3333-3333-333333333333', 'c4444444-4444-4444-4444-444444444444', ARRAY['r4444442-4444-4444-4444-444444444444'::UUID], 33)
ON CONFLICT (user_id, course_id) DO NOTHING;
