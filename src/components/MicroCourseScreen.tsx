import { ArrowLeft, Play, CheckCircle2, Circle, Clock, Users } from 'lucide-react';
import { Course, Reel } from '../App';
import Button from './Button';

interface MicroCourseScreenProps {
  course: Course;
  onBack: () => void;
  onReelClick: (reel: Reel) => void;
}

export default function MicroCourseScreen({ course, onBack, onReelClick }: MicroCourseScreenProps) {
  const completedLessons = course.lessons.filter(l => l.completed).length;
  const progressPercentage = Math.round((completedLessons / course.lessons.length) * 100);

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-y-auto">
      {/* Banner Image */}
      <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-4 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>

        {/* Play Icon */}
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="text-white fill-white ml-1" size={36} />
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="px-6 py-6">
        {/* Title and Creator */}
        <div className="mb-4">
          <h1 className="text-gray-900 mb-3">{course.title}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
            <span className="text-gray-600">{course.creator}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{course.enrolled.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{course.totalDuration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Play size={16} />
              <span>{course.lessons.length} lessons</span>
            </div>
          </div>

          {/* Progress */}
          {completedLessons > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Your Progress</span>
                <span className="text-[#3C7EFF]">{progressPercentage}% complete</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3C7EFF] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-2">About this course</h3>
          <p className="text-gray-600">
            {course.description}
          </p>
        </div>

        {/* Lessons List */}
        <div>
          <h3 className="text-gray-900 mb-4">Course Content</h3>
          
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                className="w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 flex items-center gap-4 transition-colors text-left"
              >
                {/* Lesson Number & Status */}
                <div className="flex-shrink-0">
                  {lesson.completed ? (
                    <CheckCircle2 className="text-[#3C7EFF]" size={24} />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`mb-1 ${lesson.completed ? 'text-gray-900' : 'text-gray-700'}`}>
                    {lesson.title}
                  </h4>
                  <p className="text-sm text-gray-500">{lesson.duration}</p>
                </div>

                {/* Play Button */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Play className="text-[#3C7EFF] fill-[#3C7EFF] ml-0.5" size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Course Button */}
        <div className="mt-6 pb-6">
          <Button variant="primary" fullWidth>
            {completedLessons > 0 ? 'Continue Course' : 'Start Course'}
          </Button>
        </div>
      </div>
    </div>
  );
}
