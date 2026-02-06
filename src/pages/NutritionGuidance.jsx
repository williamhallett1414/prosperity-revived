import React, { useState } from 'react';
import { ArrowLeft, Search, Apple, Droplets, Activity, Heart, Salad, Scale, Moon, Brain, Beef, Wheat, Fish, Leaf, Battery, Shield, Bone, Sparkles, Sun, Coffee, Flame, Clock, Users, Baby, Zap, Target, TrendingUp, AlertCircle, Book, Soup, Cookie, Sandwich, Pizza } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

const nutritionArticles = [
  { 
    icon: Apple, 
    title: 'Eat Whole Foods', 
    category: 'Basics',
    desc: 'Focus on fruits, vegetables, whole grains',
    content: `Whole foods are minimally processed and free from artificial ingredients and additives. They're packed with essential nutrients your body needs to thrive.

**Benefits of Whole Foods:**
• Higher in fiber, vitamins, and minerals
• Lower in added sugars and unhealthy fats
• Better for weight management
• Improved digestive health
• Reduced risk of chronic diseases

**Top Whole Foods to Include:**
• Fresh fruits and vegetables
• Whole grains (brown rice, quinoa, oats)
• Legumes (beans, lentils, chickpeas)
• Nuts and seeds
• Lean proteins (fish, chicken, eggs)

**Getting Started:**
Start by replacing one processed food with a whole food alternative each week. Shop the perimeter of grocery stores where fresh foods are typically located.`
  },
  { 
    icon: Droplets, 
    title: 'Stay Hydrated', 
    category: 'Basics',
    desc: 'Drink adequate water daily',
    content: `Water is essential for every cell, tissue, and organ in your body. Proper hydration supports energy levels, brain function, and overall health.

**Benefits of Staying Hydrated:**
• Improves physical performance
• Boosts energy and reduces fatigue
• Aids digestion and prevents constipation
• Promotes healthy skin
• Helps regulate body temperature
• Supports kidney function

**How Much Water Do You Need?**
While "8 glasses a day" is a good rule of thumb, individual needs vary based on activity level, climate, and health status. Aim for 2-3 liters daily.

**Tips to Stay Hydrated:**
• Start your day with a glass of water
• Keep a water bottle with you
• Drink before, during, and after exercise
• Eat water-rich foods (cucumbers, watermelon)
• Set hydration reminders on your phone`
  },
  { 
    icon: Activity, 
    title: 'Lower Blood Sugar', 
    category: 'Health',
    desc: 'Balance glucose for better energy',
    content: `Managing blood sugar levels is crucial for sustained energy, weight management, and preventing chronic diseases like diabetes.

**Why Blood Sugar Matters:**
• Stable levels prevent energy crashes
• Reduces cravings and overeating
• Supports heart and kidney health
• Improves mood and focus
• Helps maintain healthy weight

**Foods That Help Lower Blood Sugar:**
• Leafy greens (spinach, kale)
• Cinnamon and turmeric
• Fatty fish (salmon, mackerel)
• Chia seeds and flaxseeds
• Nuts (almonds, walnuts)
• Berries and citrus fruits
• Whole grains over refined carbs

**Lifestyle Tips:**
• Eat regular, balanced meals
• Include protein with every meal
• Exercise regularly
• Manage stress levels
• Get adequate sleep
• Limit processed foods and sugary drinks`
  },
  { 
    icon: Heart, 
    title: 'Healthy Fats', 
    category: 'Macronutrients',
    desc: 'Include omega-3s from fish, nuts, seeds',
    content: `Not all fats are created equal. Healthy fats are essential for brain function, hormone production, and heart health.

**Benefits of Healthy Fats:**
• Supports brain and nervous system health
• Reduces inflammation
• Improves heart health
• Helps absorb vitamins A, D, E, and K
• Promotes healthy skin and hair
• Increases satiety and fullness

**Best Sources of Healthy Fats:**
• Fatty fish (salmon, sardines, mackerel)
• Avocados
• Nuts and nut butters
• Seeds (chia, flax, hemp)
• Olive oil and avocado oil
• Dark chocolate (70%+ cacao)

**Fats to Limit:**
Reduce trans fats and excessive saturated fats found in processed foods, fried items, and fatty meats. Focus on unsaturated fats for optimal health.`
  },
  { 
    icon: Beef, 
    title: 'Protein Power', 
    category: 'Macronutrients',
    desc: 'Build and repair with quality protein',
    content: `Protein is the building block of muscles, bones, skin, and virtually every part of your body. Adequate protein is essential for health and performance.

**Why Protein Matters:**
• Builds and repairs tissues
• Makes enzymes and hormones
• Supports immune function
• Helps maintain muscle mass
• Increases satiety and reduces hunger
• Boosts metabolism

**How Much Protein Do You Need?**
Aim for 0.8-1g per pound of body weight daily, more if you're active or building muscle.

**Best Protein Sources:**
• Lean meats (chicken, turkey)
• Fish and seafood
• Eggs and dairy
• Legumes and beans
• Tofu and tempeh
• Greek yogurt
• Protein powder (whey, plant-based)

**Distribution Matters:**
Spread protein intake throughout the day, aiming for 20-30g per meal for optimal muscle protein synthesis.`
  },
  { 
    icon: Wheat, 
    title: 'Smart Carbs', 
    category: 'Macronutrients',
    desc: 'Choose complex carbs for sustained energy',
    content: `Carbohydrates are your body's primary energy source. Choosing the right types makes all the difference for health and performance.

**Complex vs Simple Carbs:**
Complex carbs are digested slowly, providing steady energy. Simple carbs cause quick spikes and crashes.

**Best Complex Carb Sources:**
• Whole grains (oats, quinoa, brown rice)
• Sweet potatoes and yams
• Legumes and lentils
• Vegetables
• Fruits (especially berries)

**Carbs to Limit:**
• White bread and pasta
• Sugary cereals
• Pastries and cookies
• Candy and soda
• Highly processed snacks

**Timing Your Carbs:**
• Morning: Fuel your day
• Pre-workout: Boost performance
• Post-workout: Aid recovery
• Evening: Consider lighter portions

**Remember:** Carbs aren't the enemy - quality and quantity matter.`
  },
  { 
    icon: Salad, 
    title: 'Balanced Nutrition', 
    category: 'Basics',
    desc: 'Get all essential nutrients daily',
    content: `A balanced diet provides your body with all the nutrients it needs to function optimally and maintain good health.

**The Building Blocks:**
• **Proteins:** Essential for muscle repair and growth
• **Carbohydrates:** Primary energy source
• **Fats:** Support cell function and hormones
• **Vitamins & Minerals:** Critical for body processes
• **Fiber:** Aids digestion and gut health
• **Water:** Essential for all bodily functions

**Creating Balanced Meals:**
Fill half your plate with vegetables, one quarter with lean protein, and one quarter with whole grains. Add healthy fats.

**Meal Planning Tips:**
• Include variety and color
• Plan meals ahead
• Prep ingredients in advance
• Listen to hunger cues
• Practice portion control`
  },
  { 
    icon: Scale, 
    title: 'Weight Management', 
    category: 'Goals',
    desc: 'Healthy strategies for sustainable weight',
    content: `Sustainable weight management is about creating healthy habits, not quick fixes or extreme diets.

**Healthy Weight Loss Principles:**
• Create modest calorie deficit (300-500 calories)
• Focus on nutrient-dense whole foods
• Include protein at every meal
• Stay active with regular exercise
• Get adequate sleep (7-9 hours)
• Manage stress effectively

**Foods That Support Weight Management:**
• High-fiber foods (vegetables, whole grains)
• Lean proteins (chicken, fish, tofu)
• Healthy fats that increase satiety
• Water-rich foods (soups, salads)
• Fermented foods for gut health

**Avoid These Pitfalls:**
• Skipping meals or extreme restriction
• Eliminating entire food groups
• Relying on processed "diet" foods
• Ignoring hunger and fullness cues

**Remember:** Aim for 1-2 pounds per week for sustainable results.`
  },
  { 
    icon: Moon, 
    title: 'Sleep & Nutrition', 
    category: 'Lifestyle',
    desc: 'Foods that improve sleep quality',
    content: `What you eat significantly impacts your sleep quality. The right foods can help you fall asleep faster and sleep more deeply.

**How Nutrition Affects Sleep:**
• Blood sugar levels influence sleep patterns
• Certain nutrients promote relaxation
• Heavy meals before bed disrupt sleep
• Caffeine and alcohol interfere with sleep cycles

**Best Foods for Better Sleep:**
• **Tryptophan-rich:** Turkey, chicken, eggs
• **Magnesium:** Almonds, spinach, pumpkin seeds
• **Melatonin:** Cherries, kiwis, tomatoes
• **Complex carbs:** Oatmeal, whole grain bread
• **Herbal teas:** Chamomile, valerian root

**Eating Habits for Better Sleep:**
• Eat dinner 2-3 hours before bed
• Avoid large, heavy meals at night
• Limit caffeine after 2 PM
• Stay hydrated but reduce fluids before bed

**Nighttime Snack Ideas:**
• Banana with almond butter
• Greek yogurt with berries
• Whole grain toast with avocado
• Warm milk with honey`
  },
  { 
    icon: Brain, 
    title: 'Mindful Eating', 
    category: 'Lifestyle',
    desc: 'Eat slowly and listen to your body',
    content: `Mindful eating is about being present and aware during meals, helping you develop a healthier relationship with food.

**Benefits:**
• Better digestion and nutrient absorption
• Improved satisfaction from meals
• Reduced overeating and binge eating
• Enhanced enjoyment of food
• Better recognition of hunger/fullness cues
• Reduced emotional eating

**How to Practice Mindful Eating:**
• Eat without distractions (no phone, TV)
• Take small bites and chew thoroughly
• Put utensils down between bites
• Notice colors, textures, and flavors
• Eat slowly and savor each bite
• Check in with hunger levels
• Stop when comfortably full

**Mindful Eating Questions:**
Before eating: "Am I truly hungry?"
During eating: "Am I enjoying this?"
After eating: "Am I satisfied?"

**Start Small:** Begin with one mindful meal per day and gradually expand the practice.`
  },
  { 
    icon: Fish, 
    title: 'Mediterranean Diet', 
    category: 'Diets',
    desc: 'Heart-healthy eating pattern',
    content: `The Mediterranean diet is consistently ranked as one of the healthiest eating patterns, associated with longevity and disease prevention.

**Core Principles:**
• Abundant vegetables and fruits
• Whole grains and legumes
• Healthy fats (olive oil)
• Moderate fish and seafood
• Limited red meat
• Herbs and spices for flavor

**Health Benefits:**
• Reduced heart disease risk
• Better brain health
• Lower inflammation
• Weight management support
• Diabetes prevention
• Improved gut health

**Key Foods to Include:**
• Extra virgin olive oil
• Fatty fish (salmon, sardines)
• Nuts and seeds
• Fresh vegetables and fruits
• Whole grains
• Legumes and beans

**Getting Started:**
Replace butter with olive oil, eat fish twice weekly, fill half your plate with vegetables, and enjoy meals with others.`
  },
  { 
    icon: Leaf, 
    title: 'Plant-Based Eating', 
    category: 'Diets',
    desc: 'Benefits of more plants in your diet',
    content: `Plant-based eating emphasizes foods from plant sources while reducing or eliminating animal products.

**Types of Plant-Based Diets:**
• **Vegan:** No animal products
• **Vegetarian:** No meat, but includes dairy/eggs
• **Flexitarian:** Mostly plants with occasional meat
• **Whole food plant-based:** Minimally processed plants

**Health Benefits:**
• Lower cholesterol and blood pressure
• Reduced risk of heart disease
• Better weight management
• Improved digestion
• Lower cancer risk
• Enhanced athletic performance

**Essential Nutrients to Monitor:**
• Protein (legumes, tofu, tempeh)
• Iron (dark leafy greens, fortified foods)
• B12 (supplement recommended)
• Omega-3s (flax, chia, walnuts)
• Calcium (fortified plant milks, leafy greens)
• Vitamin D (sunlight, fortified foods)

**Making the Transition:**
Start with one meatless day per week and gradually increase.`
  },
  { 
    icon: Flame, 
    title: 'Keto Diet', 
    category: 'Diets',
    desc: 'Low-carb, high-fat eating approach',
    content: `The ketogenic diet is a very low-carb, high-fat diet that puts your body in a metabolic state called ketosis.

**How It Works:**
When you drastically reduce carbs, your body burns fat for fuel instead of glucose, producing ketones.

**Macronutrient Breakdown:**
• 70-80% fat
• 15-20% protein
• 5-10% carbs (typically under 50g daily)

**Potential Benefits:**
• Rapid weight loss
• Reduced appetite
• Improved mental clarity
• Better blood sugar control
• Increased energy for some

**Foods to Eat:**
• Fatty fish and meats
• Eggs and cheese
• Nuts and seeds
• Avocados and olives
• Low-carb vegetables
• Healthy oils

**Important Considerations:**
• May cause "keto flu" initially
• Not suitable for everyone
• Requires careful planning
• Consult healthcare provider first
• Long-term effects still being studied`
  },
  { 
    icon: Battery, 
    title: 'Energy Boosting Foods', 
    category: 'Performance',
    desc: 'Natural ways to increase vitality',
    content: `The right foods can provide sustained energy throughout the day without crashes or jitters.

**Top Energy-Boosting Foods:**
• **Oats:** Complex carbs for steady energy
• **Bananas:** Quick carbs plus potassium
• **Fatty fish:** Omega-3s reduce fatigue
• **Sweet potatoes:** Fiber and vitamin-rich
• **Eggs:** Complete protein and B vitamins
• **Nuts:** Healthy fats and protein
• **Dark chocolate:** Caffeine and antioxidants
• **Green tea:** Gentle caffeine plus L-theanine

**Energy-Draining Foods to Limit:**
• Refined sugars and candy
• White bread and pastries
• Fried and fatty foods
• Excessive caffeine
• Alcohol

**Eating for Energy Tips:**
• Eat regular, balanced meals
• Don't skip breakfast
• Stay hydrated
• Combine protein with carbs
• Eat smaller, frequent meals
• Limit processed foods

**When You Need a Quick Boost:**
Pair a piece of fruit with nut butter or have a handful of trail mix.`
  },
  { 
    icon: Shield, 
    title: 'Immune System Support', 
    category: 'Health',
    desc: 'Nutrients that strengthen immunity',
    content: `A strong immune system depends heavily on proper nutrition. Certain nutrients play critical roles in immune function.

**Key Immune-Supporting Nutrients:**
• **Vitamin C:** Citrus, bell peppers, broccoli
• **Vitamin D:** Sunlight, fatty fish, fortified foods
• **Zinc:** Oysters, beef, pumpkin seeds
• **Selenium:** Brazil nuts, tuna, eggs
• **Vitamin A:** Sweet potatoes, carrots, spinach
• **Probiotics:** Yogurt, kefir, sauerkraut

**Foods That Boost Immunity:**
• Citrus fruits
• Red bell peppers
• Garlic and ginger
• Turmeric
• Green tea
• Berries
• Mushrooms
• Leafy greens

**Lifestyle Factors:**
• Get adequate sleep
• Manage stress
• Exercise regularly
• Stay hydrated
• Limit alcohol
• Don't smoke

**During Cold/Flu Season:**
Focus on warm, nourishing soups, herbal teas, and plenty of vitamin C-rich foods.`
  },
  { 
    icon: Bone, 
    title: 'Bone Health', 
    category: 'Health',
    desc: 'Build and maintain strong bones',
    content: `Strong bones are built through proper nutrition, especially calcium and vitamin D, combined with weight-bearing exercise.

**Essential Nutrients for Bones:**
• **Calcium:** Dairy, fortified plant milks, leafy greens
• **Vitamin D:** Sunlight, fatty fish, fortified foods
• **Vitamin K:** Kale, spinach, broccoli
• **Magnesium:** Nuts, seeds, whole grains
• **Protein:** Meat, fish, legumes

**Best Foods for Bone Health:**
• Milk, yogurt, and cheese
• Sardines and salmon with bones
• Leafy green vegetables
• Fortified cereals and plant milks
• Almonds and sesame seeds
• Tofu made with calcium sulfate

**Foods That May Harm Bones:**
• Excessive salt
• Too much caffeine
• Excessive alcohol
• Very high protein diets
• Soft drinks

**Daily Recommendations:**
• Adults need 1,000-1,200mg calcium
• 600-800 IU vitamin D
• Weight-bearing exercise
• Adequate protein intake

**Prevention is Key:** Build strong bones in youth and maintain them as you age.`
  },
  { 
    icon: Sparkles, 
    title: 'Skin Health Nutrition', 
    category: 'Beauty',
    desc: 'Eat your way to glowing skin',
    content: `Beautiful skin starts from within. What you eat significantly impacts your skin's health and appearance.

**Nutrients for Glowing Skin:**
• **Vitamin C:** Collagen production
• **Vitamin E:** Antioxidant protection
• **Omega-3s:** Reduce inflammation
• **Zinc:** Healing and repair
• **Biotin:** Healthy skin cells
• **Water:** Hydration and elasticity

**Best Foods for Skin:**
• Fatty fish (salmon, mackerel)
• Avocados
• Walnuts and sunflower seeds
• Sweet potatoes
• Bell peppers
• Broccoli
• Tomatoes
• Green tea
• Dark chocolate
• Berries

**Foods to Limit:**
• Sugar and refined carbs
• Dairy (may trigger acne for some)
• Excessive alcohol
• Fried foods
• Processed foods

**Hydration is Critical:**
Drink 8-10 glasses of water daily. Eat water-rich foods like cucumbers and watermelon.

**Anti-Aging Tips:**
Focus on antioxidant-rich colorful fruits and vegetables to combat free radical damage.`
  },
  { 
    icon: Sun, 
    title: 'Vitamin D', 
    category: 'Micronutrients',
    desc: 'The sunshine vitamin',
    content: `Vitamin D is crucial for bone health, immune function, and mood regulation. Many people are deficient.

**Why Vitamin D Matters:**
• Supports calcium absorption
• Strengthens immune system
• Regulates mood
• Supports muscle function
• May reduce cancer risk
• Improves heart health

**Sources of Vitamin D:**
• **Sunlight:** 10-30 minutes daily
• **Fatty fish:** Salmon, mackerel, sardines
• **Egg yolks**
• **Fortified foods:** Milk, cereals, orange juice
• **Mushrooms:** Exposed to UV light
• **Supplements:** Often necessary

**Signs of Deficiency:**
• Fatigue and weakness
• Bone and back pain
• Depression
• Slow wound healing
• Hair loss
• Frequent infections

**How Much Do You Need?**
Adults need 600-800 IU daily, possibly more if deficient.

**Testing:** Ask your doctor for a blood test to check your levels, especially if you live in northern climates or have limited sun exposure.`
  },
  { 
    icon: Coffee, 
    title: 'Caffeine Facts', 
    category: 'Supplements',
    desc: 'Smart caffeine consumption',
    content: `Caffeine is the world's most popular stimulant. Used wisely, it can enhance performance and alertness.

**Benefits of Moderate Caffeine:**
• Increased alertness and focus
• Enhanced physical performance
• Improved mood
• May reduce disease risk
• Boosts metabolism slightly

**How Much is Safe?**
Up to 400mg daily for most adults (about 4 cups of coffee).

**Best Caffeine Sources:**
• **Coffee:** 95mg per 8oz cup
• **Green tea:** 25-50mg per cup (plus L-theanine)
• **Black tea:** 40-70mg per cup
• **Matcha:** 70mg per serving
• **Dark chocolate:** 12mg per oz

**Timing Matters:**
• Best consumed 30-60 minutes before activity
• Avoid after 2 PM for better sleep
• Don't consume on empty stomach

**Watch Out For:**
• Jitters and anxiety
• Sleep disruption
• Dependency and withdrawal
• Increased heart rate
• Digestive issues

**Alternatives:** If sensitive, try green tea or matcha for gentler energy with less caffeine.`
  },
  { 
    icon: Target, 
    title: 'Meal Timing', 
    category: 'Strategy',
    desc: 'When to eat for optimal results',
    content: `Meal timing can impact energy levels, performance, and body composition. Finding what works for you is key.

**Popular Approaches:**
• **3 meals + 2 snacks:** Traditional, stable energy
• **Intermittent fasting:** 16/8 or 14/10 windows
• **5-6 small meals:** Frequent, smaller portions
• **2-3 larger meals:** Simplified, fewer decisions

**Pre-Workout Nutrition:**
• 2-3 hours before: Full meal with carbs and protein
• 30-60 minutes before: Light snack (banana, toast)
• Avoid heavy fats right before exercise

**Post-Workout Nutrition:**
• Within 30-120 minutes: Protein and carbs
• Aids recovery and muscle building
• Replenishes glycogen stores

**Before Bed:**
• Light protein snack if hungry (cottage cheese, protein shake)
• Avoid large meals 2-3 hours before sleep
• May support overnight muscle recovery

**Breakfast Debate:**
Not essential for everyone, but can help with energy and metabolism for many.

**Listen to Your Body:** The "best" meal timing is the one you can sustain consistently.`
  },
  { 
    icon: TrendingUp, 
    title: 'Metabolism Boosters', 
    category: 'Performance',
    desc: 'Natural ways to rev up your metabolism',
    content: `Metabolism is how your body converts food to energy. While largely genetic, certain strategies can optimize it.

**Natural Metabolism Boosters:**
• **Protein:** Higher thermic effect than carbs/fat
• **Strength training:** Builds metabolic-active muscle
• **Green tea:** Contains catechins and caffeine
• **Spicy foods:** Capsaicin temporarily increases metabolism
• **Cold water:** Body burns calories warming it
• **Adequate sleep:** Poor sleep slows metabolism
• **Small frequent meals:** Keeps metabolism active (debated)

**Foods That May Help:**
• Lean proteins (chicken, fish, tofu)
• Whole grains (need more energy to digest)
• Legumes (high in protein and fiber)
• Chili peppers
• Ginger and cinnamon
• Apple cider vinegar
• Coffee and green tea

**Common Metabolism Myths:**
• Eating late doesn't slow metabolism
• You can't "damage" metabolism with dieting
• There's no magic metabolism-boosting food

**Best Strategy:**
Build muscle through strength training, eat adequate protein, stay active, and get enough sleep.`
  },
  { 
    icon: AlertCircle, 
    title: 'Food Allergies & Intolerances', 
    category: 'Health',
    desc: 'Understanding and managing reactions',
    content: `Food allergies and intolerances are different but both require careful management.

**Food Allergy vs Intolerance:**
• **Allergy:** Immune system reaction, can be severe/life-threatening
• **Intolerance:** Digestive system issue, uncomfortable but not dangerous

**Common Food Allergies:**
• Peanuts and tree nuts
• Milk
• Eggs
• Wheat
• Soy
• Fish and shellfish
• Sesame

**Common Intolerances:**
• Lactose (dairy)
• Gluten
• FODMAPs
• Histamine
• Sulfites

**Symptoms to Watch:**
• **Allergy:** Hives, swelling, difficulty breathing, anaphylaxis
• **Intolerance:** Bloating, gas, diarrhea, headaches

**Management Strategies:**
• Read food labels carefully
• Avoid cross-contamination
• Carry epinephrine if severe allergy
• Keep food diary to identify triggers
• Work with allergist or dietitian
• Find suitable substitutes

**Getting Diagnosed:**
See an allergist for proper testing. Don't self-diagnose or unnecessarily eliminate foods.`
  },
  { 
    icon: Book, 
    title: 'Reading Food Labels', 
    category: 'Strategy',
    desc: 'Decode nutrition information',
    content: `Understanding food labels helps you make informed choices about what you're eating.

**Key Components:**
• **Serving size:** Everything is per serving
• **Calories:** Total energy per serving
• **Macronutrients:** Protein, carbs, fat
• **Fiber:** Aim for high fiber
• **Sugar:** Watch added sugars
• **Sodium:** Limit if concerned about blood pressure
• **% Daily Value:** Based on 2,000 calorie diet

**Ingredient List Tips:**
• Listed by weight, heaviest first
• Watch for multiple sugar names
• Fewer ingredients generally better
• Avoid trans fats and hydrogenated oils
• Look for whole grains as first ingredient

**Marketing Claims to Question:**
• "Natural" (not regulated)
• "Made with whole grains" (might be minimal)
• "Light" (could mean color, not calories)
• "Sugar-free" (may contain artificial sweeteners)

**Red Flags:**
• Long ingredient lists with unpronounceable names
• Multiple types of sugar
• High sodium levels
• Trans fats or partially hydrogenated oils

**Pro Tip:** Focus on whole foods that don't need labels rather than obsessing over packaged foods.`
  },
  { 
    icon: Target, 
    title: 'Portion Control', 
    category: 'Strategy',
    desc: 'Right-size your servings',
    content: `Even healthy foods can lead to weight gain if portions are too large. Learning proper portions is key.

**Visual Portion Guides:**
• **Protein:** Palm of hand (3-4 oz)
• **Carbs:** Cupped hand (1/2-1 cup)
• **Fats:** Thumb (1 tbsp)
• **Vegetables:** Fist (1 cup)

**Practical Strategies:**
• Use smaller plates and bowls
• Measure portions initially to calibrate
• Pre-portion snacks into containers
• Don't eat from bags or boxes
• Fill half your plate with vegetables
• Eat slowly and mindfully
• Wait 20 minutes before seconds

**Restaurant Challenges:**
• Share entrees or take half home
• Order appetizer-sized portions
• Ask for dressing/sauce on side
• Skip the bread basket
• Choose grilled over fried

**Common Portion Distortions:**
• Bagels: Often 3-4 servings
• Pasta: 2 cups is 4 servings
• Cereal: Easy to pour 2-3 servings
• Meat: Restaurants serve 8+ oz portions

**Remember:** You can eat anything in moderation - portion size matters.`
  },
  { 
    icon: Soup, 
    title: 'Meal Prep Mastery', 
    category: 'Strategy',
    desc: 'Prep ahead for success',
    content: `Meal prep saves time, money, and helps you stick to healthy eating goals.

**Benefits of Meal Prep:**
• Saves time during busy weekdays
• Reduces food waste
• Saves money vs eating out
• Controls portions and ingredients
• Reduces decision fatigue
• Supports health goals

**Getting Started:**
• Pick one day for prep (Sunday is popular)
• Start small (prep 2-3 days worth)
• Choose simple, batch-friendly recipes
• Invest in good containers
• Use slow cooker or instant pot
• Prep versatile ingredients

**What to Prep:**
• **Proteins:** Grilled chicken, hard-boiled eggs
• **Grains:** Brown rice, quinoa
• **Vegetables:** Roasted or raw cut
• **Sauces:** Dressings, marinades
• **Snacks:** Cut fruits, portioned nuts

**Storage Tips:**
• Most preps last 3-4 days
• Label with dates
• Keep raw and cooked separate
• Freeze extras for longer storage
• Use glass containers when possible

**Time-Saving Tricks:**
• Cook multiple items simultaneously
• Double recipes for extra portions
• Use pre-cut vegetables when needed`
  },
  { 
    icon: Users, 
    title: 'Eating Out Healthy', 
    category: 'Lifestyle',
    desc: 'Make better restaurant choices',
    content: `You can enjoy dining out while still maintaining healthy eating habits.

**Before You Go:**
• Check menu online
• Don't arrive starving
• Have a healthy snack if needed
• Choose restaurants with healthy options
• Plan what you'll order

**Smart Ordering Strategies:**
• Start with soup or salad
• Choose grilled, baked, or steamed
• Ask for dressing/sauce on side
• Substitute veggies for fries
• Share entrees or appetizers
• Order water or unsweetened drinks
• Skip the bread basket

**Watch Out For:**
• Creamy sauces and dressings
• Fried foods
• Large portions
• Sugary drinks
• "Healthy" salads with lots of toppings

**Cuisine-Specific Tips:**
• **Italian:** Choose marinara over cream sauces
• **Mexican:** Skip chips, choose grilled proteins
• **Asian:** Watch sodium, choose steamed dishes
• **American:** Grilled proteins, veggie sides

**Enjoy the Experience:**
Don't stress about perfect choices. One meal won't ruin progress. Make reasonable choices and savor the social experience.`
  },
  { 
    icon: Zap, 
    title: 'Pre-Workout Nutrition', 
    category: 'Performance',
    desc: 'Fuel your workouts properly',
    content: `What you eat before exercise can significantly impact performance and recovery.

**Timing Your Pre-Workout Meal:**
• **2-3 hours before:** Full meal with carbs, protein, minimal fat
• **30-60 minutes before:** Small snack, easily digestible
• **Less than 30 minutes:** Liquid/simple carbs only if needed

**Best Pre-Workout Foods:**
• Oatmeal with banana
• Toast with peanut butter
• Greek yogurt with berries
• Apple with almond butter
• Rice cakes with honey
• Banana or dates
• Sports drink (for quick energy)

**What to Avoid:**
• Heavy, fatty foods
• High fiber (may cause GI issues)
• New/untested foods
• Large meals right before
• Spicy foods

**Hydration Matters:**
• Drink 16-20 oz water 2-3 hours before
• Another 8-10 oz 20-30 minutes before
• Sip during exercise
• More needed in heat/humidity

**Individualization:**
Everyone's digestive system differs. Experiment to find what works best for you and your workout type.

**For Early Morning Workouts:**
If you can't eat beforehand, try a small easily digestible carb source like banana or sports drink.`
  },
  { 
    icon: Battery, 
    title: 'Post-Workout Recovery', 
    category: 'Performance',
    desc: 'Optimize recovery nutrition',
    content: `Post-workout nutrition is crucial for recovery, muscle building, and replenishing energy stores.

**The Recovery Window:**
While not as critical as once thought, eating within 2 hours post-workout is beneficial, especially after intense exercise.

**What Your Body Needs:**
• **Protein:** 20-40g to repair and build muscle
• **Carbs:** Replenish glycogen stores
• **Fluids:** Rehydrate
• **Electrolytes:** Replace what's lost in sweat

**Best Post-Workout Meals:**
• Grilled chicken with sweet potato and veggies
• Salmon with quinoa and broccoli
• Turkey sandwich on whole grain bread
• Eggs and avocado toast
• Protein smoothie with fruit and spinach
• Greek yogurt with granola and berries
• Tuna wrap with vegetables

**Quick Post-Workout Snacks:**
• Protein shake with banana
• Chocolate milk
• Trail mix with dried fruit
• Apple with nut butter
• String cheese and crackers

**Hydration:**
Drink 16-24 oz water for every pound lost during exercise.

**Special Considerations:**
• Endurance athletes need more carbs
• Strength trainers focus on protein
• Timing matters more for athletes vs casual exercisers`
  },
  { 
    icon: Clock, 
    title: 'Intermittent Fasting', 
    category: 'Diets',
    desc: 'Time-restricted eating patterns',
    content: `Intermittent fasting (IF) focuses on when you eat rather than what you eat.

**Popular IF Methods:**
• **16/8:** Fast 16 hours, eat in 8-hour window
• **14/10:** Fast 14 hours, eat in 10-hour window
• **5:2:** Eat normally 5 days, restrict to 500-600 calories 2 days
• **Eat-Stop-Eat:** 24-hour fast once or twice weekly
• **Alternate day:** Fast every other day

**Potential Benefits:**
• Weight loss through calorie restriction
• Improved insulin sensitivity
• Enhanced autophagy (cellular cleanup)
• Simplified meal planning
• Possible longevity benefits

**Who Should Avoid:**
• Pregnant or breastfeeding women
• People with eating disorders
• Those with diabetes (without medical supervision)
• Children and teenagers
• People with certain medical conditions

**Tips for Success:**
• Start gradually (12/12, then progress)
• Stay hydrated during fasting
• Break fast with nutritious foods
• Listen to your body
• Maintain adequate nutrition in eating window

**Common Side Effects:**
• Initial hunger and irritability
• Headaches
• Fatigue
• May not work for everyone

**Not Magic:** IF is effective because it typically reduces overall calorie intake.`
  },
  { 
    icon: Baby, 
    title: 'Pregnancy Nutrition', 
    category: 'Life Stages',
    desc: 'Eating for two (sort of)',
    content: `Proper nutrition during pregnancy supports both mother and baby's health.

**Extra Nutrients Needed:**
• **Folic acid:** 400-800mcg daily (prevents neural tube defects)
• **Iron:** 27mg daily (prevents anemia)
• **Calcium:** 1000mg daily (baby's bone development)
• **Protein:** Extra 25g daily
• **DHA omega-3:** 200-300mg daily (brain development)
• **Vitamin D:** 600 IU daily

**Best Pregnancy Foods:**
• Leafy greens (folate, iron)
• Lean proteins (growth and development)
• Eggs (choline for brain)
• Fatty fish (DHA, limit to 2 servings/week)
• Greek yogurt (calcium, protein)
• Legumes (folate, fiber, protein)
• Berries (antioxidants, fiber)
• Whole grains (energy, B vitamins)

**Foods to Avoid:**
• Raw or undercooked meat, eggs, fish
• High-mercury fish (shark, swordfish, king mackerel)
• Unpasteurized dairy and juices
• Deli meats (unless heated)
• Alcohol
• Excessive caffeine (limit to 200mg)

**Weight Gain:**
Typical gain is 25-35 pounds for normal weight women.

**Morning Sickness Tips:**
• Eat small, frequent meals
• Try bland foods (crackers, toast)
• Ginger tea or candies
• Stay hydrated
• Avoid strong smells`
  },
  { 
    icon: Users, 
    title: 'Kids Nutrition', 
    category: 'Life Stages',
    desc: 'Building healthy habits early',
    content: `Childhood nutrition sets the foundation for lifelong health habits.

**Key Nutrients for Kids:**
• **Calcium:** Growing bones and teeth
• **Vitamin D:** Bone health and immunity
• **Iron:** Brain development and energy
• **Protein:** Growth and development
• **Fiber:** Digestive health
• **Healthy fats:** Brain development

**Serving Sizes by Age:**
• **Toddlers (1-3):** Very small portions
• **Preschool (4-5):** About 1/4 adult portion
• **School age (6-12):** About 1/2 adult portion
• **Teens:** Adult portions or more if active

**Building Healthy Habits:**
• Family meals together
• No food as reward or punishment
• Involve kids in meal planning/prep
• Make healthy foods accessible
• Limit sugary drinks and snacks
• Be a role model
• Don't force "clean plate"

**Dealing with Picky Eaters:**
• Offer variety without pressure
• Keep presenting rejected foods
• Make food fun and appealing
• Let them help cook
• Respect preferences to a point
• Don't make separate meals

**School Lunch Ideas:**
• Turkey and cheese roll-ups
• Hummus with veggies and pita
• Yogurt parfait with granola
• PB&J on whole wheat
• Pasta salad with chicken`
  },
  { 
    icon: Users, 
    title: 'Senior Nutrition', 
    category: 'Life Stages',
    desc: 'Eating well as you age',
    content: `Nutritional needs change with age. Seniors require nutrient-dense foods and may need fewer calories.

**Unique Senior Nutrition Needs:**
• **More protein:** Prevent muscle loss (sarcopenia)
• **More calcium and vitamin D:** Bone health
• **More B12:** Often poorly absorbed with age
• **More fiber:** Digestive health
• **More fluids:** Reduced thirst sensation
• **Fewer calories:** Lower metabolism

**Common Challenges:**
• Decreased appetite
• Difficulty chewing/swallowing
• Limited mobility for shopping/cooking
• Medication interactions
• Digestive changes
• Living alone

**Best Foods for Seniors:**
• Fatty fish (protein, omega-3s)
• Eggs (protein, B12, choline)
• Fortified dairy or alternatives
• Leafy greens (vitamins, minerals)
• Berries (antioxidants)
• Nuts and seeds (healthy fats)
• Whole grains (fiber, B vitamins)
• Legumes (protein, fiber)

**Solutions to Common Issues:**
• Soft, easy-to-chew foods
• Smaller, frequent meals
• Nutritional supplements if needed
• Meal delivery services
• Share meals with friends
• Add herbs/spices for flavor

**Stay Hydrated:**
Aim for 8 glasses daily even if not feeling thirsty.`
  },
  { 
    icon: TrendingUp, 
    title: 'Sports Nutrition', 
    category: 'Performance',
    desc: 'Fuel like an athlete',
    content: `Athletes have unique nutritional needs to support training, performance, and recovery.

**Macronutrient Needs:**
• **Carbs:** 3-10g per kg body weight (depends on sport)
• **Protein:** 1.2-2.0g per kg body weight
• **Fats:** 20-35% of total calories

**Timing is Crucial:**
• **Pre-training:** Carbs for energy
• **During:** Carbs/electrolytes for endurance events
• **Post-training:** Protein and carbs for recovery

**Hydration for Athletes:**
• Drink to thirst during training
• Weigh before/after to assess losses
• Replace 150% of fluid lost
• Include electrolytes for sessions over 1 hour

**Best Sports Foods:**
• **Pre-workout:** Oats, banana, toast
• **During:** Sports drinks, gels, dates
• **Post-workout:** Protein shake, chocolate milk
• **General:** Lean proteins, whole grains, colorful veggies

**Supplements to Consider:**
• Protein powder (convenience)
• Creatine (strength/power athletes)
• Beta-alanine (high-intensity sports)
• Caffeine (performance enhancer)
• Vitamin D (if deficient)

**Common Mistakes:**
• Not eating enough calories
• Inadequate protein
• Poor timing of nutrients
• Trying new foods on competition day
• Over-reliance on supplements`
  },
  { 
    icon: Heart, 
    title: 'Heart-Healthy Eating', 
    category: 'Health',
    desc: 'Protect your cardiovascular health',
    content: `Heart disease is preventable through diet and lifestyle. Focus on whole foods and healthy fats.

**Key Principles:**
• Increase fruits and vegetables
• Choose whole grains over refined
• Include healthy fats (omega-3s)
• Limit saturated and trans fats
• Reduce sodium intake
• Moderate alcohol if consumed

**Best Foods for Heart Health:**
• Fatty fish (salmon, sardines)
• Nuts and seeds
• Berries
• Leafy greens
• Whole grains
• Legumes
• Olive oil
• Avocados
• Dark chocolate (in moderation)
• Green tea

**Foods to Limit:**
• Red and processed meats
• Full-fat dairy
• Fried foods
• Baked goods with trans fats
• Sugary drinks
• Excessive salt

**Dietary Patterns:**
• Mediterranean diet (highly recommended)
• DASH diet (Dietary Approaches to Stop Hypertension)
• Plant-based diets

**Other Important Factors:**
• Maintain healthy weight
• Exercise regularly
• Don't smoke
• Manage stress
• Control blood pressure and cholesterol

**Reading Labels:**
Look for low sodium, no trans fats, and minimal saturated fat.`
  },
  { 
    icon: Brain, 
    title: 'Brain-Boosting Foods', 
    category: 'Health',
    desc: 'Nutrition for cognitive health',
    content: `What you eat impacts brain function, memory, mood, and long-term brain health.

**Key Nutrients for Brain:**
• **Omega-3s:** DHA for brain structure
• **Antioxidants:** Protect against oxidative stress
• **B vitamins:** Neurotransmitter production
• **Vitamin E:** Cognitive decline prevention
• **Choline:** Memory and learning

**Top Brain Foods:**
• **Fatty fish:** Omega-3s (salmon, sardines)
• **Blueberries:** Antioxidants
• **Turmeric:** Anti-inflammatory curcumin
• **Broccoli:** Vitamin K and antioxidants
• **Pumpkin seeds:** Zinc, magnesium
• **Dark chocolate:** Flavonoids, caffeine
• **Nuts:** Vitamin E, healthy fats
• **Eggs:** Choline
• **Green tea:** Caffeine and L-theanine
• **Leafy greens:** Folate, vitamins

**Foods That May Harm:**
• Refined carbs and sugars
• Excessive alcohol
• Trans fats
• High-sodium processed foods

**Lifestyle Factors:**
• Stay mentally active
• Exercise regularly
• Get adequate sleep
• Manage stress
• Stay socially connected
• Limit alcohol

**Mediterranean-MIND Diet:**
Combination of Mediterranean and DASH diets, specifically designed for brain health.`
  },
  { 
    icon: Flame, 
    title: 'Anti-Inflammatory Diet', 
    category: 'Health',
    desc: 'Reduce chronic inflammation',
    content: `Chronic inflammation is linked to many diseases. Diet plays a significant role in managing inflammation.

**What Causes Inflammation:**
• Processed foods
• Refined sugars
• Trans fats
• Excessive alcohol
• Lack of exercise
• Chronic stress
• Poor sleep

**Anti-Inflammatory Foods:**
• **Fatty fish:** Omega-3s (EPA and DHA)
• **Berries:** Antioxidants
• **Broccoli and cruciferous veggies**
• **Avocados:** Healthy fats
• **Green tea:** Polyphenols
• **Peppers:** Vitamins and antioxidants
• **Mushrooms:** Various compounds
• **Turmeric:** Curcumin
• **Extra virgin olive oil:** Oleocanthal
• **Dark chocolate:** Flavonoids
• **Tomatoes:** Lycopene
• **Cherries:** Anthocyanins

**Pro-Inflammatory Foods to Avoid:**
• Sugary drinks and snacks
• Refined carbs (white bread, pastries)
• Processed meats
• Fried foods
• Excessive red meat
• Trans fats

**Sample Anti-Inflammatory Day:**
• Breakfast: Oatmeal with berries and walnuts
• Lunch: Salmon salad with olive oil dressing
• Dinner: Grilled chicken with roasted vegetables
• Snacks: Nuts, dark chocolate, green tea

**Benefits:**
Reduced disease risk, better joint health, improved mood, enhanced recovery.`
  },
  { 
    icon: Activity, 
    title: 'Gut Health', 
    category: 'Health',
    desc: 'Feed your microbiome',
    content: `Your gut microbiome influences digestion, immunity, mood, and overall health.

**Why Gut Health Matters:**
• Produces vitamins (K, B vitamins)
• Supports immune function
• Influences mood and mental health
• Affects weight and metabolism
• Protects against pathogens
• Reduces inflammation

**Probiotic Foods (Good Bacteria):**
• Yogurt with live cultures
• Kefir
• Sauerkraut
• Kimchi
• Kombucha
• Miso
• Tempeh
• Pickles (naturally fermented)

**Prebiotic Foods (Feed Good Bacteria):**
• Garlic and onions
• Leeks and asparagus
• Bananas (slightly green)
• Oats and barley
• Apples
• Chicory root
• Jerusalem artichokes

**Foods That Harm Gut Health:**
• Artificial sweeteners
• Excessive sugar
• Processed foods
• Excessive alcohol
• Antibiotics (when necessary, rebuild after)

**Supporting Gut Health:**
• Eat diverse plant foods
• Include fermented foods daily
• Limit processed foods
• Manage stress
• Exercise regularly
• Get adequate sleep
• Stay hydrated

**Signs of Poor Gut Health:**
• Digestive issues
• Food intolerances
• Frequent illness
• Fatigue
• Skin problems
• Mood issues`
  },
  { 
    icon: Sparkles, 
    title: 'Antioxidants', 
    category: 'Micronutrients',
    desc: 'Fight free radicals naturally',
    content: `Antioxidants protect your cells from damage caused by free radicals, potentially reducing disease risk.

**Key Antioxidants:**
• **Vitamin C:** Citrus, berries, peppers
• **Vitamin E:** Nuts, seeds, oils
• **Beta-carotene:** Orange/yellow vegetables
• **Selenium:** Brazil nuts, fish, eggs
• **Flavonoids:** Berries, tea, dark chocolate
• **Lycopene:** Tomatoes, watermelon

**Top Antioxidant Foods:**
• Berries (especially blueberries)
• Dark leafy greens
• Beans and legumes
• Artichokes
• Pecans and walnuts
• Dark chocolate
• Green tea
• Red grapes
• Purple cabbage
• Beets

**Colorful Eating:**
Eat a rainbow of fruits and vegetables to get diverse antioxidants.

**Health Benefits:**
• Reduced inflammation
• Lower disease risk
• Slower aging process
• Better skin health
• Enhanced immune function
• Improved brain health

**Should You Supplement?**
Food sources are best. High-dose antioxidant supplements may not be beneficial and could be harmful.

**How to Maximize:**
• Eat fruits and vegetables raw or lightly cooked
• Store properly to maintain nutrients
• Buy fresh and seasonal
• Include variety daily

**Remember:** More isn't always better. Focus on getting antioxidants from whole food sources.`
  },
  { 
    icon: Cookie, 
    title: 'Smart Snacking', 
    category: 'Strategy',
    desc: 'Healthy snacks that satisfy',
    content: `Strategic snacking can help maintain energy, prevent overeating, and support nutrition goals.

**When to Snack:**
• 3-4 hours between meals
• Before/after workouts
• When genuinely hungry
• To curb cravings
• NOT out of boredom

**Balanced Snack Formula:**
Combine protein or healthy fat with fiber/carbs for sustained energy.

**Healthy Snack Ideas:**
• Apple slices with almond butter
• Greek yogurt with berries
• Hummus with veggies
• String cheese and whole grain crackers
• Trail mix (nuts, seeds, dried fruit)
• Hard-boiled eggs
• Cottage cheese with fruit
• Edamame
• Protein smoothie
• Dark chocolate and almonds

**Pre-Portioned Snacks:**
• Individual nut portions (1 oz)
• Single-serve yogurt
• Pre-cut veggies with dip
• Portioned trail mix
• String cheese

**Snacks to Limit:**
• Chips and crackers
• Candy
• Cookies and pastries
• Sugary granola bars
• Soda and juice

**Snacking Tips:**
• Keep healthy options visible and accessible
• Portion snacks, don't eat from bag
• Stay hydrated (thirst mimics hunger)
• Plan snacks into daily calories
• Prepare snacks in advance

**Office-Friendly:**
Keep nuts, seeds, fruit, and protein bars at your desk for healthy options.`
  },
  { 
    icon: Sandwich, 
    title: 'Protein Myths Debunked', 
    category: 'Facts',
    desc: 'Truth about protein needs',
    content: `Protein is essential, but many myths surround how much you need and when to eat it.

**Common Protein Myths:**

**Myth 1: More is always better**
Truth: Most people need 0.8-1g per pound of body weight. Excessive protein isn't harmful but isn't necessary.

**Myth 2: You need protein immediately after workout**
Truth: The "anabolic window" is longer than thought. Within 2 hours is fine for most people.

**Myth 3: Plant proteins are incomplete**
Truth: Combining various plant proteins throughout the day provides all essential amino acids.

**Myth 4: High protein damages kidneys**
Truth: Only a concern if you have existing kidney disease. Healthy kidneys handle high protein fine.

**Myth 5: You can only absorb 30g per meal**
Truth: Your body can absorb more, but spreading intake is optimal for muscle building.

**Myth 6: You need supplements**
Truth: Most people can meet needs through food alone.

**Protein Facts:**
• Increases satiety
• Supports muscle maintenance
• Has higher thermic effect
• Important for all body tissues
• Needs increase with activity

**Best Approach:**
Spread protein throughout day, aim for 20-30g per meal, prioritize whole food sources.`
  },
  { 
    icon: Pizza, 
    title: 'Flexible Dieting', 
    category: 'Strategy',
    desc: 'Balance and moderation approach',
    content: `Flexible dieting allows room for all foods while meeting nutrition goals. No foods are off-limits.

**Core Principles:**
• Track macronutrients (protein, carbs, fats)
• 80/20 rule: 80% nutrient-dense, 20% treats
• Fit any food into daily targets
• Focus on overall diet quality
• Sustainable long-term
• No "good" or "bad" foods

**Benefits:**
• Prevents feeling deprived
• Sustainable for life
• Teaches balance
• Reduces binge eating
• Social eating is easier
• Less stress around food

**How It Works:**
1. Calculate calorie and macro targets
2. Plan majority of meals with whole foods
3. Leave room for treats if desired
4. Track intake accurately
5. Adjust based on results

**Not a Free-For-All:**
Meeting protein and fiber goals naturally limits junk food intake while allowing flexibility.

**Example Day:**
• Breakfast: Oatmeal with protein powder
• Lunch: Chicken salad
• Snack: Apple and protein bar
• Dinner: Burger and fries (fits macros)
• Dessert: Ice cream (fits macros)

**Keys to Success:**
• Prioritize protein and fiber
• Be honest with tracking
• Plan treats, don't eat impulsively
• Focus on nutrient timing around training
• Don't let treats dominate diet

**Who It's For:**
People who want sustainable, long-term approach without strict rules or food restrictions.`
  },
  { 
    icon: AlertCircle, 
    title: 'Sugar: The Full Story', 
    category: 'Facts',
    desc: 'Understanding different sugars',
    content: `Not all sugars are equal. Understanding types helps you make informed choices.

**Types of Sugar:**
• **Natural:** Found in fruits, milk, vegetables
• **Added:** Put into foods during processing
• **Free sugars:** Added sugars plus juice/honey

**Why Sugar Concerns:**
• Excess calories without nutrients
• Blood sugar spikes and crashes
• Increased disease risk
• Promotes inflammation
• Can be addictive
• Damages teeth

**Hidden Sugar Names:**
• Cane sugar, sucrose, glucose
• High fructose corn syrup
• Agave, honey, maple syrup
• Dextrose, maltose, lactose
• Fruit juice concentrate
• Molasses, evaporated cane juice

**Daily Limits:**
• WHO recommends under 10% of calories
• Ideally under 5% (about 25g/6 tsp)
• Average person consumes 17 teaspoons daily

**Natural vs Added:**
Fruit sugar comes with fiber, vitamins, and water. Added sugar provides empty calories.

**Reducing Sugar:**
• Read labels carefully
• Choose whole fruits over juice
• Limit sugary drinks
• Reduce gradually (cold turkey causes cravings)
• Use spices for sweetness (cinnamon, vanilla)
• Choose unsweetened versions
• Be aware of "healthy" processed foods

**Artificial Sweeteners:**
Mixed evidence on safety and effectiveness. Better to reduce sweet preference overall.`
  },
  { 
    icon: Droplets, 
    title: 'Electrolytes Explained', 
    category: 'Supplements',
    desc: 'More than just sports drinks',
    content: `Electrolytes are minerals that carry electrical charges, essential for many body functions.

**Key Electrolytes:**
• **Sodium:** Fluid balance, nerve function
• **Potassium:** Heart and muscle function
• **Chloride:** Fluid balance, digestion
• **Calcium:** Muscle contractions, bones
• **Magnesium:** 300+ enzymatic reactions
• **Phosphate:** Energy production

**Why They Matter:**
• Regulate fluid balance
• Control pH levels
• Enable muscle contractions
• Support nerve signals
• Regulate blood pressure

**Who Needs Extra:**
• Endurance athletes
• Those exercising in heat
• People who sweat heavily
• During illness (vomiting/diarrhea)
• Very low-carb dieters

**Food Sources:**
• **Sodium:** Salt, olives, pickles
• **Potassium:** Bananas, potatoes, spinach
• **Magnesium:** Nuts, seeds, dark chocolate
• **Calcium:** Dairy, leafy greens, sardines

**Signs of Imbalance:**
• Muscle cramps
• Fatigue
• Headaches
• Irregular heartbeat
• Nausea
• Confusion

**Do You Need Sports Drinks?**
Only for intense exercise over 60-90 minutes. Otherwise, water and balanced diet suffice.

**Making Your Own:**
Water + pinch of salt + squeeze of lemon + honey = simple electrolyte drink`
  },
  { 
    icon: Heart, 
    title: 'Cholesterol Facts', 
    category: 'Health',
    desc: 'Good, bad, and what to eat',
    content: `Cholesterol is more complex than "good" or "bad." Understanding it helps you manage heart health.

**Types of Cholesterol:**
• **LDL:** "Bad" - can build up in arteries
• **HDL:** "Good" - removes excess cholesterol
• **Triglycerides:** Type of fat in blood
• **Total:** Sum of all types

**Healthy Levels:**
• Total: Under 200 mg/dL
• LDL: Under 100 mg/dL
• HDL: Over 60 mg/dL
• Triglycerides: Under 150 mg/dL

**Dietary Cholesterol vs Blood Cholesterol:**
Eating cholesterol has less impact than once thought. Saturated and trans fats affect blood cholesterol more.

**Foods That Lower LDL:**
• Oats and barley (beta-glucan)
• Beans and legumes
• Nuts (almonds, walnuts)
• Fatty fish (omega-3s)
• Fruits high in pectin (apples, citrus)
• Vegetables (eggplant, okra)
• Olive oil
• Soy foods

**Foods to Limit:**
• Saturated fats (fatty meats, butter)
• Trans fats (partially hydrogenated oils)
• Fried foods
• Full-fat dairy
• Processed meats

**Other Factors:**
• Exercise raises HDL
• Weight loss improves numbers
• Smoking lowers HDL
• Genetics play a role
• Some people are hyper-responders

**When to Take Action:**
Work with healthcare provider for testing and personalized plan.`
  },
  { 
    icon: Leaf, 
    title: 'Organic vs Conventional', 
    category: 'Facts',
    desc: 'Understanding your choices',
    content: `The organic debate continues. Understanding the differences helps you make informed, budget-conscious choices.

**What Organic Means:**
• No synthetic pesticides
• No synthetic fertilizers
• No GMOs
• No antibiotics/hormones (meat/dairy)
• No irradiation
• Higher animal welfare standards

**Nutrition Differences:**
Minimal difference in nutrient content. Some studies show slightly higher antioxidants in organic.

**Pesticide Concerns:**
Conventional produce has pesticide residues, but levels are generally considered safe by regulatory agencies.

**Dirty Dozen (buy organic):**
• Strawberries
• Spinach
• Kale
• Apples
• Grapes
• Peaches
• Cherries
• Pears
• Tomatoes
• Celery
• Potatoes
• Hot peppers

**Clean Fifteen (OK conventional):**
• Avocados
• Sweet corn
• Pineapple
• Onions
• Papaya
• Sweet peas (frozen)
• Asparagus
• Honeydew melon
• Kiwi
• Cabbage
• Mushrooms
• Cantaloupe
• Mangoes
• Watermelon
• Sweet potatoes

**Cost Considerations:**
Organic costs 20-100% more. Prioritize based on Dirty Dozen if budget-conscious.

**Bottom Line:**
Eating fruits and vegetables, organic or not, is more important than eating none due to organic concerns. Wash all produce thoroughly.`
  },
  { 
    icon: Scale, 
    title: 'Understanding Calories', 
    category: 'Facts',
    desc: 'Energy balance explained',
    content: `Calories are units of energy. Understanding them helps with weight management goals.

**What Are Calories:**
Measure of energy in food. Your body uses this energy for everything from breathing to running.

**Macronutrient Calories:**
• Carbohydrates: 4 calories per gram
• Protein: 4 calories per gram
• Fat: 9 calories per gram
• Alcohol: 7 calories per gram

**Calorie Needs:**
Depend on age, sex, size, activity level. Average adult needs 2000-2500 calories daily.

**Quality Matters:**
100 calories of broccoli ≠ 100 calories of candy in terms of nutrition, satiety, and metabolic effects.

**Weight Management:**
• Maintenance: Calories in = Calories out
• Weight loss: Deficit of 300-500 calories
• Weight gain: Surplus of 300-500 calories

**Metabolism Factors:**
• Basal metabolic rate (BMR)
• Thermic effect of food (digestion)
• Physical activity
• Non-exercise activity thermogenesis (NEAT)

**Don't Get Obsessed:**
Calorie counting isn't necessary for everyone. Focus on food quality, portion sizes, and hunger cues.

**Metabolism Can't Be "Broken:"**
It slows with weight loss but can be optimized with strength training and adequate protein.

**Sustainable Approach:**
Small deficits over time beat aggressive cuts that aren't maintainable.`
  },
  { 
    icon: Book, 
    title: 'Nutrition Myths Busted', 
    category: 'Facts',
    desc: 'Separating fact from fiction',
    content: `Nutrition is full of myths. Let's bust some common ones.

**Myth: Carbs make you fat**
Truth: Excess calories make you fat, regardless of source. Carbs are a needed energy source.

**Myth: Eating late causes weight gain**
Truth: Total daily calories matter more than timing. Late eating isn't inherently problematic.

**Myth: Fat makes you fat**
Truth: Fat is essential and satiating. Healthy fats support weight management.

**Myth: Detox diets cleanse your body**
Truth: Your liver and kidneys naturally detox. No special diet needed.

**Myth: Everyone needs supplements**
Truth: Most people can meet needs through food. Some groups may benefit from specific supplements.

**Myth: Skipping meals helps weight loss**
Truth: Often backfires by causing overeating later. Regular meals support metabolism.

**Myth: Organic is always healthier**
Truth: Minimal nutritional difference. Conventional produce is healthy too.

**Myth: Sea salt is healthier than table salt**
Truth: Similar sodium content. Table salt is iodized (beneficial). Both should be limited.

**Myth: Egg yolks are unhealthy**
Truth: Yolks contain most of egg's nutrients. Dietary cholesterol has less impact than once thought.

**Myth: All calories are equal**
Truth: While energy value is same, different foods affect satiety, hormones, and metabolism differently.

**Bottom Line:**
Question extreme claims. Balance and moderation are usually the answer.`
  },
  {
    icon: Target,
    title: 'Nutrition Goals by Age',
    category: 'Life Stages',
    desc: 'Changing needs through life',
    content: `Nutritional needs evolve throughout life. Understanding these changes helps optimize health at every stage.

**Children (2-12 years):**
• Focus on growth and development
• Build healthy eating habits
• Ensure adequate calcium and vitamin D
• Include variety of foods
• Limit added sugars
• Establish regular meal times

**Teens (13-18 years):**
• Support rapid growth
• Increase iron (especially girls)
• Adequate calcium for peak bone mass
• More calories if very active
• Balance fast food with nutrition
• Address body image concerns

**Young Adults (19-35 years):**
• Establish sustainable habits
• Maintain healthy weight
• Build muscle mass
• Adequate nutrition if planning pregnancy
• Balance social eating with health goals
• Prevent future disease

**Middle Age (36-55 years):**
• Prevent metabolic slowdown
• Maintain muscle mass
• Focus on heart health
• Bone health becomes priority
• Manage stress eating
• Watch portion sizes

**Seniors (55+ years):**
• More protein to prevent sarcopenia
• Adequate calcium and vitamin D
• B12 supplementation often needed
• Fewer calories needed
• Maintain hydration
• Nutrient-dense foods
• Social aspects of eating

**Universal Principles:**
Regardless of age, focus on whole foods, adequate protein, colorful vegetables, and staying active.`
  }
];

export default function NutritionGuidancePage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Basics', 'Macronutrients', 'Diets', 'Health', 'Performance', 'Strategy', 'Lifestyle', 'Life Stages', 'Micronutrients', 'Supplements', 'Facts', 'Beauty', 'Goals'];

  const filteredArticles = nutritionArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f6ebe0] pb-20">
      {/* The Good Pantry Banner */}
      <div className="relative bg-[#f6ebe0] -mx-4 mb-6">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/0079a599f_TheGoodPantry.png"
          alt="The Good Pantry"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#FD9C2D] via-[#f6ebe0] to-[#C4E3FD] p-6">
        <Link
          to={createPageUrl('Wellness')}
          className="inline-flex items-center gap-2 text-white mb-4 hover:opacity-80"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Wellness
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Nutrition Guidance</h1>
        <p className="text-white/90">Comprehensive nutrition articles and advice</p>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-[#2d2d4a] text-[#1a1a2e] dark:text-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FD9C2D] text-white'
                  : 'bg-white dark:bg-[#2d2d4a] text-[#1a1a2e] dark:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {filteredArticles.map((article, index) => {
            const Icon = article.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedArticle(article)}
                className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 text-left hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-sm text-[#1a1a2e] dark:text-white mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {article.desc}
                    </p>
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedArticle && React.createElement(selectedArticle.icon, { className: "w-6 h-6 text-emerald-600" })}
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {selectedArticle?.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={i} className="font-semibold text-[#1a1a2e] dark:text-white mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
              } else if (paragraph.startsWith('•')) {
                return <li key={i} className="text-gray-700 dark:text-gray-300 ml-4">{paragraph.substring(1).trim()}</li>;
              } else if (paragraph.trim()) {
                return <p key={i} className="text-gray-700 dark:text-gray-300 mb-3">{paragraph}</p>;
              }
              return null;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}