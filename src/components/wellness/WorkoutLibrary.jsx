export const PREMADE_WORKOUTS = [
  {
    id: 'beginner-full-body',
    title: 'Beginner Full Body',
    description: 'Perfect for those just starting their fitness journey',
    difficulty: 'beginner',
    duration_minutes: 20,
    category: 'full_body',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1606889464198-fcb18894cf50?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1616279969856-759f316a5ac1?w=400&fit=crop',
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
    image_url: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=400&fit=crop',
    exercises: [
      { name: 'Walking', sets: 1, reps: 0, duration_seconds: 600 },
      { name: 'Gentle Stretching', sets: 3, reps: 0, duration_seconds: 120 },
      { name: 'Foam Rolling', sets: 1, reps: 0, duration_seconds: 300 },
      { name: 'Deep Breathing', sets: 3, reps: 10, duration_seconds: 0 }
    ]
  },
  {
    id: 'morning-flexibility',
    title: 'Morning Flexibility Flow',
    description: 'Ease your body into the day with full-body stretching',
    difficulty: 'beginner',
    duration_minutes: 15,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&fit=crop',
    exercises: [
      { name: 'Neck Side Stretch', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Chest Opener', sets: 2, reps: 0, duration_seconds: 40 },
      { name: 'Standing Quad Stretch', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Standing Forward Fold', sets: 3, reps: 0, duration_seconds: 45 },
      { name: 'Hip Flexor Lunge Stretch', sets: 2, reps: 0, duration_seconds: 45 }
    ]
  },
  {
    id: 'hip-opener',
    title: 'Deep Hip Opener',
    description: 'Release tight hips and improve lower body mobility',
    difficulty: 'intermediate',
    duration_minutes: 20,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=400&fit=crop',
    exercises: [
      { name: 'Pigeon Pose', sets: 2, reps: 0, duration_seconds: 90 },
      { name: 'Butterfly Stretch', sets: 3, reps: 0, duration_seconds: 60 },
      { name: 'Figure-4 Stretch', sets: 2, reps: 0, duration_seconds: 60 },
      { name: 'Deep Squat Hold', sets: 3, reps: 0, duration_seconds: 45 },
      { name: 'Lizard Pose', sets: 2, reps: 0, duration_seconds: 60 }
    ]
  },
  {
    id: 'full-body-stretch',
    title: 'Full Body Deep Stretch',
    description: 'Head-to-toe stretching for total body relief',
    difficulty: 'beginner',
    duration_minutes: 25,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&fit=crop',
    exercises: [
      { name: 'Standing Forward Fold', sets: 2, reps: 0, duration_seconds: 60 },
      { name: 'Seated Hamstring Stretch', sets: 3, reps: 0, duration_seconds: 60 },
      { name: 'Seated Spinal Twist', sets: 2, reps: 0, duration_seconds: 45 },
      { name: 'Shoulder Cross-Body Stretch', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Lying Glute Stretch', sets: 2, reps: 0, duration_seconds: 60 },
      { name: "Child's Pose", sets: 1, reps: 0, duration_seconds: 90 }
    ]
  },
  {
    id: 'post-workout-cooldown',
    title: 'Post-Workout Cooldown',
    description: 'Essential stretches to recover after any workout',
    difficulty: 'beginner',
    duration_minutes: 12,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fit=crop',
    exercises: [
      { name: 'Standing Quad Stretch', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Calf Stretch', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Chest Opener', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Seated Hamstring Stretch', sets: 2, reps: 0, duration_seconds: 45 },
      { name: 'Neck Side Stretch', sets: 2, reps: 0, duration_seconds: 30 }
    ]
  },
  {
    id: 'spinal-health',
    title: 'Spinal Health & Back Relief',
    description: 'Decompress your spine and relieve back tension',
    difficulty: 'beginner',
    duration_minutes: 20,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=400&fit=crop',
    exercises: [
      { name: 'Cat-Cow Stretch', sets: 3, reps: 12, duration_seconds: 0 },
      { name: 'Seated Spinal Twist', sets: 3, reps: 0, duration_seconds: 45 },
      { name: "Thread the Needle", sets: 2, reps: 0, duration_seconds: 40 },
      { name: 'Knee-to-Chest Stretch', sets: 3, reps: 0, duration_seconds: 45 },
      { name: 'Sphinx Pose', sets: 2, reps: 0, duration_seconds: 60 }
    ]
  },
  {
    id: 'runners-stretch',
    title: "Runner's Stretch Routine",
    description: 'Target legs, hips and calves to prevent injury',
    difficulty: 'beginner',
    duration_minutes: 18,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&fit=crop',
    exercises: [
      { name: 'Standing Hip Flexor Lunge', sets: 2, reps: 0, duration_seconds: 60 },
      { name: 'Seated Hamstring Stretch', sets: 3, reps: 0, duration_seconds: 60 },
      { name: 'Calf Stretch (Wall)', sets: 3, reps: 0, duration_seconds: 45 },
      { name: 'IT Band Stretch', sets: 2, reps: 0, duration_seconds: 45 },
      { name: 'Quad Stretch', sets: 2, reps: 0, duration_seconds: 40 }
    ]
  },
  {
    id: 'shoulder-neck-release',
    title: 'Shoulder & Neck Release',
    description: 'Melt away tension from your upper body',
    difficulty: 'beginner',
    duration_minutes: 12,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1559888292-03b6dc1a3a0b?w=400&fit=crop',
    exercises: [
      { name: 'Neck Forward Tilt', sets: 3, reps: 0, duration_seconds: 30 },
      { name: 'Ear-to-Shoulder Stretch', sets: 3, reps: 0, duration_seconds: 30 },
      { name: 'Cross-Body Shoulder Stretch', sets: 3, reps: 0, duration_seconds: 35 },
      { name: 'Chest Doorway Stretch', sets: 2, reps: 0, duration_seconds: 45 },
      { name: 'Overhead Tricep Stretch', sets: 2, reps: 0, duration_seconds: 30 }
    ]
  },
  {
    id: 'splits-progression',
    title: 'Splits Progression',
    description: 'Build flexibility over time toward the full splits',
    difficulty: 'intermediate',
    duration_minutes: 30,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=400&fit=crop',
    exercises: [
      { name: 'Low Lunge Stretch', sets: 3, reps: 0, duration_seconds: 90 },
      { name: 'Half Split Hold', sets: 3, reps: 0, duration_seconds: 90 },
      { name: 'Hamstring Stretch Strap', sets: 3, reps: 0, duration_seconds: 60 },
      { name: 'Hip Flexor Stretch', sets: 3, reps: 0, duration_seconds: 60 },
      { name: 'Butterfly Inner Thigh', sets: 2, reps: 0, duration_seconds: 60 }
    ]
  },
  {
    id: 'evening-unwind',
    title: 'Evening Unwind Stretch',
    description: 'Release the stress of the day and prepare for rest',
    difficulty: 'beginner',
    duration_minutes: 20,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&fit=crop',
    exercises: [
      { name: "Child's Pose", sets: 1, reps: 0, duration_seconds: 90 },
      { name: 'Supine Spinal Twist', sets: 2, reps: 0, duration_seconds: 60 },
      { name: 'Legs Up Wall', sets: 1, reps: 0, duration_seconds: 120 },
      { name: 'Reclined Butterfly', sets: 1, reps: 0, duration_seconds: 90 },
      { name: 'Shavasana Breathing', sets: 1, reps: 0, duration_seconds: 120 }
    ]
  },
  {
    id: 'office-mobility',
    title: 'Office Mobility Reset',
    description: 'Fight stiffness from sitting all day — do this anywhere',
    difficulty: 'beginner',
    duration_minutes: 10,
    category: 'flexibility',
    image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&fit=crop',
    exercises: [
      { name: 'Seated Figure-4 Stretch', sets: 2, reps: 0, duration_seconds: 40 },
      { name: 'Chest Opener (hands clasped)', sets: 2, reps: 0, duration_seconds: 30 },
      { name: 'Seated Neck Stretch', sets: 3, reps: 0, duration_seconds: 25 },
      { name: 'Standing Hip Circles', sets: 2, reps: 15, duration_seconds: 0 },
      { name: 'Wrist & Forearm Stretch', sets: 2, reps: 0, duration_seconds: 30 }
    ]
  },
];