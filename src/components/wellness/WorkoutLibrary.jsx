export const PREMADE_WORKOUTS = [
  {
    id: 'beginner-full-body',
    title: 'Beginner Full Body',
    description: 'Perfect for those just starting their fitness journey',
    difficulty: 'beginner',
    duration_minutes: 20,
    category: 'full_body',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: 15, duration_seconds: 0 },
      { name: 'Wall Push-ups', sets: 3, reps: 10, duration_seconds: 0 },
      { name: 'Bodyweight Squats', sets: 3, reps: 12, duration_seconds: 0 },
      { name: 'Plank', sets: 2, reps: 0, duration_seconds: 30 }
    ]
  },
  {
    id: 'morning-energizer',
    title: 'Morning Energizer',
    description: 'Wake up your body with this quick routine',
    difficulty: 'beginner',
    duration_minutes: 15,
    category: 'full_body',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    exercises: [
      { name: 'Arm Circles', sets: 2, reps: 20, duration_seconds: 0 },
      { name: 'High Knees', sets: 3, reps: 0, duration_seconds: 30 },
      { name: 'Lunges', sets: 3, reps: 10, duration_seconds: 0 },
      { name: 'Cat-Cow Stretch', sets: 2, reps: 10, duration_seconds: 0 }
    ]
  },
  {
    id: 'cardio-blast',
    title: 'Cardio Blast',
    description: 'High-intensity cardio to burn calories fast',
    difficulty: 'intermediate',
    duration_minutes: 25,
    category: 'cardio',
    image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: 30, duration_seconds: 0 },
      { name: 'Burpees', sets: 3, reps: 10, duration_seconds: 0 },
      { name: 'Mountain Climbers', sets: 3, reps: 0, duration_seconds: 45 },
      { name: 'High Knees', sets: 3, reps: 0, duration_seconds: 45 }
    ]
  },
  {
    id: 'upper-body-strength',
    title: 'Upper Body Strength',
    description: 'Build strength in your chest, arms, and shoulders',
    difficulty: 'intermediate',
    duration_minutes: 30,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
    exercises: [
      { name: 'Push-ups', sets: 4, reps: 12, duration_seconds: 0 },
      { name: 'Dumbbell Rows', sets: 4, reps: 12, duration_seconds: 0 },
      { name: 'Shoulder Press', sets: 3, reps: 10, duration_seconds: 0 },
      { name: 'Tricep Dips', sets: 3, reps: 12, duration_seconds: 0 }
    ]
  },
  {
    id: 'lower-body-blast',
    title: 'Lower Body Blast',
    description: 'Tone and strengthen your legs and glutes',
    difficulty: 'intermediate',
    duration_minutes: 30,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=400',
    exercises: [
      { name: 'Squats', sets: 4, reps: 15, duration_seconds: 0 },
      { name: 'Lunges', sets: 3, reps: 12, duration_seconds: 0 },
      { name: 'Glute Bridge', sets: 3, reps: 15, duration_seconds: 0 },
      { name: 'Leg Raises', sets: 3, reps: 12, duration_seconds: 0 }
    ]
  },
  {
    id: 'core-crusher',
    title: 'Core Crusher',
    description: 'Strengthen your abs and core muscles',
    difficulty: 'intermediate',
    duration_minutes: 20,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    exercises: [
      { name: 'Plank', sets: 3, reps: 0, duration_seconds: 60 },
      { name: 'Bicycle Crunches', sets: 3, reps: 20, duration_seconds: 0 },
      { name: 'Leg Raises', sets: 3, reps: 15, duration_seconds: 0 },
      { name: 'Side Plank', sets: 2, reps: 0, duration_seconds: 30 }
    ]
  },
  {
    id: 'yoga-flow',
    title: 'Gentle Yoga Flow',
    description: 'Relaxing yoga sequence for flexibility and peace',
    difficulty: 'beginner',
    duration_minutes: 25,
    category: 'yoga',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    exercises: [
      { name: 'Child\'s Pose', sets: 1, reps: 0, duration_seconds: 60 },
      { name: 'Downward Dog', sets: 3, reps: 0, duration_seconds: 45 },
      { name: 'Cat-Cow Stretch', sets: 3, reps: 10, duration_seconds: 0 },
      { name: 'Warrior Pose', sets: 2, reps: 0, duration_seconds: 60 }
    ]
  },
  {
    id: 'fat-burn-20',
    title: '20-Minute Fat Burn',
    description: 'High-energy cardio to torch calories and boost metabolism',
    difficulty: 'intermediate',
    duration_minutes: 20,
    category: 'cardio',
    image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    exercises: [
      { name: 'Burpees', sets: 3, reps: 12, duration_seconds: 0 },
      { name: 'Jump Squats', sets: 3, reps: 15, duration_seconds: 0 },
      { name: 'Mountain Climbers', sets: 3, reps: 0, duration_seconds: 45 },
      { name: 'High Knees', sets: 3, reps: 0, duration_seconds: 40 }
    ]
  },
  {
    id: 'hiit-30',
    title: '30-Minute HIIT',
    description: 'Maximum calorie burn in 30 minutes',
    difficulty: 'advanced',
    duration_minutes: 30,
    category: 'cardio',
    image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    exercises: [
      { name: 'Burpees', sets: 4, reps: 15, duration_seconds: 0 },
      { name: 'Jump Squats', sets: 4, reps: 12, duration_seconds: 0 },
      { name: 'Mountain Climbers', sets: 4, reps: 0, duration_seconds: 60 },
      { name: 'High Knees', sets: 4, reps: 0, duration_seconds: 45 }
    ]
  },
  {
    id: 'desk-stretch',
    title: 'Desk Stretch Break',
    description: 'Quick stretches for office workers',
    difficulty: 'beginner',
    duration_minutes: 10,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=400',
    exercises: [
      { name: 'Neck Rolls', sets: 2, reps: 10, duration_seconds: 0 },
      { name: 'Shoulder Shrugs', sets: 2, reps: 15, duration_seconds: 0 },
      { name: 'Seated Spinal Twist', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Wrist Circles', sets: 2, reps: 15, duration_seconds: 0 }
    ]
  },
  {
    id: 'strength-circuit',
    title: 'Total Strength Circuit',
    description: 'Complete body strength training',
    difficulty: 'advanced',
    duration_minutes: 45,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    exercises: [
      { name: 'Push-ups', sets: 5, reps: 15, duration_seconds: 0 },
      { name: 'Squats', sets: 5, reps: 20, duration_seconds: 0 },
      { name: 'Dumbbell Rows', sets: 4, reps: 15, duration_seconds: 0 },
      { name: 'Plank', sets: 3, reps: 0, duration_seconds: 90 },
      { name: 'Lunges', sets: 4, reps: 12, duration_seconds: 0 }
    ]
  },
  {
    id: 'mobility-flow',
    title: 'Mobility & Flexibility',
    description: 'Improve range of motion and flexibility',
    difficulty: 'beginner',
    duration_minutes: 20,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400',
    exercises: [
      { name: 'Hip Circles', sets: 2, reps: 15, duration_seconds: 0 },
      { name: 'Leg Swings', sets: 2, reps: 20, duration_seconds: 0 },
      { name: 'Arm Circles', sets: 2, reps: 20, duration_seconds: 0 },
      { name: 'Spinal Twists', sets: 2, reps: 10, duration_seconds: 0 }
    ]
  },
  {
    id: 'abs-focus',
    title: 'Abs-Focused Workout',
    description: 'Target your core with focused exercises',
    difficulty: 'intermediate',
    duration_minutes: 25,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
    exercises: [
      { name: 'Crunches', sets: 4, reps: 20, duration_seconds: 0 },
      { name: 'Bicycle Crunches', sets: 3, reps: 25, duration_seconds: 0 },
      { name: 'Plank', sets: 3, reps: 0, duration_seconds: 60 },
      { name: 'Russian Twists', sets: 3, reps: 30, duration_seconds: 0 }
    ]
  },
  {
    id: 'power-yoga',
    title: 'Power Yoga Session',
    description: 'Challenging yoga for strength and flexibility',
    difficulty: 'intermediate',
    duration_minutes: 40,
    category: 'yoga',
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    exercises: [
      { name: 'Sun Salutations', sets: 5, reps: 1, duration_seconds: 0 },
      { name: 'Warrior Series', sets: 3, reps: 0, duration_seconds: 90 },
      { name: 'Tree Pose', sets: 2, reps: 0, duration_seconds: 60 },
      { name: 'Pigeon Pose', sets: 2, reps: 0, duration_seconds: 60 }
    ]
  },
  {
    id: 'athlete-conditioning',
    title: 'Athletic Conditioning',
    description: 'High-performance training for athletes',
    difficulty: 'advanced',
    duration_minutes: 50,
    category: 'full_body',
    image_url: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=400',
    exercises: [
      { name: 'Box Jumps', sets: 4, reps: 12, duration_seconds: 0 },
      { name: 'Burpees', sets: 5, reps: 15, duration_seconds: 0 },
      { name: 'Sprint Intervals', sets: 6, reps: 0, duration_seconds: 30 },
      { name: 'Medicine Ball Slams', sets: 4, reps: 15, duration_seconds: 0 }
    ]
  },
  {
    id: 'bedtime-stretch',
    title: 'Bedtime Stretch Routine',
    description: 'Relax and unwind before sleep',
    difficulty: 'beginner',
    duration_minutes: 15,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400',
    exercises: [
      { name: 'Child\'s Pose', sets: 1, reps: 0, duration_seconds: 90 },
      { name: 'Seated Forward Fold', sets: 2, reps: 0, duration_seconds: 60 },
      { name: 'Spinal Twist', sets: 2, reps: 0, duration_seconds: 45 },
      { name: 'Legs Up Wall', sets: 1, reps: 0, duration_seconds: 120 }
    ]
  },
  {
    id: 'kettlebell-basics',
    title: 'Kettlebell Basics',
    description: 'Introduction to kettlebell training',
    difficulty: 'intermediate',
    duration_minutes: 30,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1606889464198-fcb18894cf50?w=400',
    exercises: [
      { name: 'Kettlebell Swings', sets: 4, reps: 15, duration_seconds: 0 },
      { name: 'Goblet Squats', sets: 4, reps: 12, duration_seconds: 0 },
      { name: 'Kettlebell Rows', sets: 3, reps: 12, duration_seconds: 0 },
      { name: 'Turkish Get-Ups', sets: 3, reps: 5, duration_seconds: 0 }
    ]
  },
  {
    id: 'tabata-intense',
    title: 'Tabata Intense',
    description: '4-minute intervals of maximum intensity',
    difficulty: 'advanced',
    duration_minutes: 20,
    category: 'cardio',
    image_url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400',
    exercises: [
      { name: 'Burpees', sets: 8, reps: 0, duration_seconds: 20 },
      { name: 'Mountain Climbers', sets: 8, reps: 0, duration_seconds: 20 },
      { name: 'Jump Squats', sets: 8, reps: 0, duration_seconds: 20 },
      { name: 'High Knees', sets: 8, reps: 0, duration_seconds: 20 }
    ]
  },
  {
    id: 'resistance-band',
    title: 'Resistance Band Workout',
    description: 'Full body workout using resistance bands',
    difficulty: 'intermediate',
    duration_minutes: 30,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400',
    exercises: [
      { name: 'Band Chest Press', sets: 3, reps: 15, duration_seconds: 0 },
      { name: 'Band Rows', sets: 3, reps: 15, duration_seconds: 0 },
      { name: 'Band Squats', sets: 4, reps: 15, duration_seconds: 0 },
      { name: 'Band Shoulder Press', sets: 3, reps: 12, duration_seconds: 0 }
    ]
  },
  {
    id: 'bodyweight-master',
    title: 'Bodyweight Mastery',
    description: 'Advanced bodyweight exercises',
    difficulty: 'advanced',
    duration_minutes: 35,
    category: 'strength',
    image_url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400',
    exercises: [
      { name: 'One-Arm Push-ups', sets: 3, reps: 8, duration_seconds: 0 },
      { name: 'Pistol Squats', sets: 3, reps: 10, duration_seconds: 0 },
      { name: 'L-Sit Hold', sets: 3, reps: 0, duration_seconds: 30 },
      { name: 'Handstand Hold', sets: 3, reps: 0, duration_seconds: 30 }
    ]
  },
  {
    id: 'pregnancy-safe',
    title: 'Pregnancy-Safe Workout',
    description: 'Gentle exercises safe for expectant mothers',
    difficulty: 'beginner',
    duration_minutes: 20,
    category: 'full_body',
    image_url: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=400',
    exercises: [
      { name: 'Pelvic Tilts', sets: 3, reps: 15, duration_seconds: 0 },
      { name: 'Wall Push-ups', sets: 2, reps: 10, duration_seconds: 0 },
      { name: 'Seated Leg Lifts', sets: 3, reps: 12, duration_seconds: 0 },
      { name: 'Cat-Cow Stretch', sets: 2, reps: 10, duration_seconds: 0 }
    ]
  },
  {
    id: 'seniors-fitness',
    title: 'Seniors Fitness',
    description: 'Low-impact exercises for older adults',
    difficulty: 'beginner',
    duration_minutes: 25,
    category: 'full_body',
    image_url: 'https://images.unsplash.com/photo-1616279969856-759f316a5ac1?w=400',
    exercises: [
      { name: 'Chair Squats', sets: 3, reps: 10, duration_seconds: 0 },
      { name: 'Wall Push-ups', sets: 2, reps: 8, duration_seconds: 0 },
      { name: 'Seated Marches', sets: 3, reps: 20, duration_seconds: 0 },
      { name: 'Arm Raises', sets: 2, reps: 15, duration_seconds: 0 }
    ]
  },
  {
    id: 'recovery-day',
    title: 'Active Recovery',
    description: 'Light movement for rest days',
    difficulty: 'beginner',
    duration_minutes: 20,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=400',
    exercises: [
      { name: 'Walking', sets: 1, reps: 0, duration_seconds: 600 },
      { name: 'Gentle Stretching', sets: 3, reps: 0, duration_seconds: 120 },
      { name: 'Foam Rolling', sets: 1, reps: 0, duration_seconds: 300 },
      { name: 'Deep Breathing', sets: 3, reps: 10, duration_seconds: 0 }
    ]
  }
];