import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-12',
    md: 'w-32 h-16', 
    lg: 'w-40 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="/logo.png"
        alt="REPilot.ai Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}




