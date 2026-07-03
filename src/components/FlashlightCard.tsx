'use client';

import { useRef, ReactNode } from 'react';

interface FlashlightCardProps {
  children: ReactNode;
  className?: string;
}

export default function FlashlightCard({ children, className = '' }: FlashlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className={`flashlight-card ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div className="flashlight-card-content">
        {children}
      </div>
    </div>
  );
}
