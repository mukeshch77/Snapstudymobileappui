import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  fullWidth?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  onClick,
  icon 
}: ButtonProps) {
  const baseStyles = 'px-6 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-[#3C7EFF] text-white hover:bg-[#2D6EEF] active:scale-95',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95',
    text: 'text-gray-600 hover:text-gray-900'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
