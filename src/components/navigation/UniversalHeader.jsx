import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function UniversalHeader({ title, rightAction = null, backTo = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Root pages that shouldn't show back button
  const rootPages = ['/', '/Home', '/Wellness', '/Bible', '/Groups', '/Profile'];
  const isRootPage = rootPages.includes(location.pathname);

  const handleBack = () => {
    if (backTo) {
      navigate(createPageUrl(backTo));
    } else {
      navigate(-1);
    }
  };

  return null;






















}