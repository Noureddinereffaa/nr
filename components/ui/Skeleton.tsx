import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
    const baseClass = "skeleton-shimmer bg-white/5";
    const variantClass = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded-md h-4' : 'rounded-2xl';

    return (
        <div className={`${baseClass} ${variantClass} ${className}`} />
    );
};

export default Skeleton;
