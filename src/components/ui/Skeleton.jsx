import React from 'react';

export function Skeleton({ className = '', lines = 1, circle = false }) {
  if (circle) {
    return <div className={`animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 ${className}`} />;
  }
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 h-4"
          style={{ width: i === lines - 1 && lines > 1 ? '75%' : '100%' }} />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <CardSkeleton />
      <CardSkeleton />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    </div>
  );
}
