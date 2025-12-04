export default function SplashScreen() {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-8">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* App Name */}
      <h1 className="text-gray-900 mb-3">SnapStudy</h1>
      
      {/* Tagline */}
      <p className="text-gray-500">Learn in 60 Seconds</p>
    </div>
  );
}
