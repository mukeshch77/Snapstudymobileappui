import { Screen } from '../App';
import Button from './Button';
import { useState } from 'react';
import { authAPI } from '../utils/api';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogin: () => void;
}

export default function LoginScreen({ onNavigate, onLogin }: LoginScreenProps) {
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.login(email, password);
      onLogin();
      onNavigate('home');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // Allow guest access without authentication
    onNavigate('home');
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-between px-8 py-16">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-6">
          <svg
            width="48"
            height="48"
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

        <h1 className="text-gray-900 mb-2">Welcome to SnapStudy</h1>
        <p className="text-gray-500 text-center max-w-xs">
          Discover bite-sized learning through engaging 60-second videos
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-4">
        {!showEmailLogin ? (
          <>
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => setShowEmailLogin(true)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Continue with Email
            </Button>
            
            <Button 
              variant="text" 
              fullWidth
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-600">sarah@example.com / demo123</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C7EFF] mb-3"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin()}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C7EFF]"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button 
              variant="primary" 
              fullWidth
              onClick={handleEmailLogin}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            <Button 
              variant="text" 
              fullWidth
              onClick={() => setShowEmailLogin(false)}
            >
              Back
            </Button>
          </>
        )}
      </div>
    </div>
  );
}