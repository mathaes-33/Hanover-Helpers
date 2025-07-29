import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'amber' | 'red' | 'blue' | 'purple';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'green', className = '' }) => {
    const colorClasses = {
        green: 'bg-primary-light text-primary-dark',
        amber: 'bg-amber-100 text-amber-800',
        red: 'bg-red-100 text-red-800',
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
    };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;