import React from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useOnlineStatus from '@/hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-[#DC3545] text-white px-4 py-2 text-center shadow-lg"
          style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="w-4 h-4" aria-hidden="true" />
            <span>No internet connection</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
