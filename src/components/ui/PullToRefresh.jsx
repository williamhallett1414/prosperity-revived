import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);
  const maxPull = 80;
  const triggerThreshold = 60;

  const handleTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (isRefreshing || startY === 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;
    
    if (distance > 0 && containerRef.current?.scrollTop === 0) {
      setPullDistance(Math.min(distance, maxPull));
      if (distance > triggerThreshold) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > triggerThreshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  const rotation = (pullDistance / maxPull) * 360;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-auto h-full"
    >
      {(pullDistance > 0 || isRefreshing) && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-center"
          style={{ height: pullDistance }}
          initial={false}
          animate={{ height: isRefreshing ? 60 : pullDistance }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : rotation }}
            transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: 'linear' } : { duration: 0 }}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'text-emerald-600' : 'text-gray-400'}`} />
          </motion.div>
        </motion.div>
      )}
      <div style={{ paddingTop: isRefreshing ? 60 : 0 }}>
        {children}
      </div>
    </div>
  );
}