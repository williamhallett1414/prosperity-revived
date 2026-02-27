import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function WellnessHub() {
  const categories = [
  {
    name: 'Workouts',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop',
    path: createPageUrl('Workouts')
  },
  {
    name: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
    path: createPageUrl('Nutrition')
  },
  {
    name: 'Bible',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&h=300&fit=crop',
    path: createPageUrl('Bible')
  },
  {
    name: 'Personal Growth',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    path: createPageUrl('PersonalGrowth')
  }];


  return null;



































}