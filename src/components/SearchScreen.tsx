import { Search } from 'lucide-react';
import { Screen, Course } from '../App';
import BottomNav from './BottomNav';
import { mockCourses, trendingTopics } from '../data/mockData';
import { useState, useEffect } from 'react';
import { coursesAPI, searchAPI } from '../utils/api';

interface SearchScreenProps {
  onNavigate: (screen: Screen) => void;
  onCourseClick: (course: Course) => void;
}

export default function SearchScreen({ onNavigate, onCourseClick }: SearchScreenProps) {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesAPI.getAll();
      console.log('Loaded courses:', data);
      
      // Normalize course data
      const normalizedCourses = data.map((course: any) => ({
        id: course.id,
        title: course.title,
        creator: typeof course.creator === 'string' ? course.creator : course.creator?.name || 'Unknown',
        thumbnail: course.cover_image || '',
        description: course.description || '',
        lessons: course.lessons?.map((lesson: any) => ({
          id: lesson.id || lesson.reel?.id,
          title: lesson.reel?.title || 'Lesson',
          duration: `${lesson.reel?.duration || 60}s`,
          completed: false,
          reel_id: lesson.reel_id || lesson.reel?.id,
        })) || [],
        totalDuration: '45 min',
        enrolled: 12400,
        tags: course.tags || [],
      }));
      
      if (normalizedCourses.length > 0) {
        setCourses(normalizedCourses);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      // Keep mock data on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      loadCourses();
      return;
    }

    try {
      setLoading(true);
      const results = await searchAPI.search(query);
      console.log('Search results:', results);
      
      if (results.courses && results.courses.length > 0) {
        const normalizedCourses = results.courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          creator: typeof course.creator === 'string' ? course.creator : course.creator?.name || 'Unknown',
          thumbnail: course.cover_image || '',
          description: course.description || '',
          lessons: [],
          totalDuration: '45 min',
          enrolled: 12400,
          tags: course.tags || [],
        }));
        setCourses(normalizedCourses);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = async (tag: string) => {
    try {
      setLoading(true);
      const results = await searchAPI.searchByTag(tag);
      console.log('Tag search results:', results);
      
      if (results.courses && results.courses.length > 0) {
        const normalizedCourses = results.courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          creator: typeof course.creator === 'string' ? course.creator : course.creator?.name || 'Unknown',
          thumbnail: course.cover_image || '',
          description: course.description || '',
          lessons: [],
          totalDuration: '45 min',
          enrolled: 12400,
          tags: course.tags || [],
        }));
        setCourses(normalizedCourses);
      }
    } catch (error) {
      console.error('Tag search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-gray-900 mb-6">Discover</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search topics, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C7EFF]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 px-6">
        {/* Trending Topics */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-4">Trending Topics</h2>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(topic)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-[#3C7EFF] hover:text-white transition-colors"
              >
                #{topic}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Micro-Courses */}
        <div>
          <h2 className="text-gray-900 mb-4">
            {loading ? 'Loading...' : 'Featured Micro-Courses'}
          </h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => onCourseClick(course)}
                className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow text-left"
              >
                {/* Course Thumbnail */}
                <div className="w-full h-40 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  </div>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="white"
                    opacity="0.9"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <h3 className="text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{course.lessons.length} lessons</span>
                      <span>•</span>
                      <span>{course.totalDuration}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.enrolled.toLocaleString()} enrolled
                    </div>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{course.creator}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="search" onNavigate={onNavigate} />
    </div>
  );
}