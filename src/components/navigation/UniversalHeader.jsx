import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function UniversalHeader({ title, rightAction = null, backTo = null }) {
  const handleBack = () => {
    if (backTo) {
      window.location.href = createPageUrl(backTo);
    } else {
      window.history.back();
    }
  };

  return null;























}