import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { Screen } from '../App';
import Button from './Button';

interface CreatorUploadScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function CreatorUploadScreen({ onNavigate }: CreatorUploadScreenProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  const availableTags = [
    'React', 'Python', 'JavaScript', 'CSS', 'Web Development',
    'Machine Learning', 'Data Science', 'UI/UX', 'Git', 'DevOps'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePublish = () => {
    // Simulate publishing
    onNavigate('home');
  };

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => onNavigate('profile')}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="text-gray-700" size={20} />
        </button>
        <h2 className="text-gray-900">Upload Reel</h2>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {/* Upload Area */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Video</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Upload className="text-[#3C7EFF]" size={24} />
            </div>
            <p className="text-gray-900 mb-1">Tap to upload video</p>
            <p className="text-sm text-gray-500">Max 90 seconds • MP4, MOV</p>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Master React Hooks in 60 Seconds"
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C7EFF] focus:border-transparent"
          />
        </div>

        {/* Topic Tags */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Topic Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-[#3C7EFF] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="inline ml-1" size={14} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Micro-Course Selection */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Add to Micro-Course (Optional)</label>
          <select className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3C7EFF] focus:border-transparent">
            <option value="">Select a course...</option>
            <option value="1">Complete React Mastery</option>
            <option value="2">Python for Beginners</option>
            <option value="3">Modern CSS Techniques</option>
            <option value="new">+ Create New Course</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Description</label>
          <textarea
            placeholder="Briefly describe what learners will gain from this reel..."
            rows={4}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C7EFF] focus:border-transparent resize-none"
          ></textarea>
        </div>

        {/* Publish Button */}
        <div className="pb-6">
          <Button 
            variant="primary" 
            fullWidth
            onClick={handlePublish}
          >
            Publish Reel
          </Button>
        </div>
      </div>
    </div>
  );
}
