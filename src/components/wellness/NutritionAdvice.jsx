import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Droplets, Heart, Brain, Loader2, Activity, Scale, Salad, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import CommentSection from './CommentSection';

export default function NutritionAdvice() {
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleGetAdvice = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `As a nutrition expert, provide clear, evidence-based advice for this question: "${question}". 
        Keep the response practical, safe, and encourage consulting healthcare professionals for personalized plans.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            tips: { type: 'array', items: { type: 'string' } },
            foods_to_include: { type: 'array', items: { type: 'string' } },
            caution: { type: 'string' }
          }
        }
      });
      setAdvice(response);
    } catch (error) {
      console.error('Failed to get advice', error);
    }
    setLoading(false);
  };

  const nutritionArticles = [
    { 
      icon: Apple, 
      title: 'Eat Whole Foods', 
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
      desc: 'Drink 8 glasses of water daily',
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
      icon: Salad, 
      title: 'Balanced Nutrition', 
      desc: 'Get all essential nutrients daily',
      content: `A balanced diet provides your body with all the nutrients it needs to function optimally and maintain good health.

**The Building Blocks:**
• **Proteins:** Essential for muscle repair and growth (lean meats, fish, legumes)
• **Carbohydrates:** Primary energy source (whole grains, fruits, vegetables)
• **Fats:** Support cell function and hormone production (nuts, oils, fish)
• **Vitamins & Minerals:** Critical for various body processes
• **Fiber:** Aids digestion and gut health
• **Water:** Essential for all bodily functions

**Creating Balanced Meals:**
Fill half your plate with vegetables, one quarter with lean protein, and one quarter with whole grains. Add a serving of healthy fats.

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
      desc: 'Healthy strategies for sustainable weight',
      content: `Sustainable weight management is about creating healthy habits, not quick fixes or extreme diets.

**Healthy Weight Loss Principles:**
• Create a modest calorie deficit (300-500 calories)
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
• Setting unrealistic expectations

**Remember:** Slow and steady wins the race. Aim for 1-2 pounds per week for sustainable results.`
    },
    { 
      icon: Moon, 
      title: 'Sleep & Nutrition', 
      desc: 'Foods that improve sleep quality',
      content: `What you eat significantly impacts your sleep quality. The right foods can help you fall asleep faster and sleep more deeply.

**How Nutrition Affects Sleep:**
• Blood sugar levels influence sleep patterns
• Certain nutrients promote relaxation
• Heavy meals before bed can disrupt sleep
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
• Have a light snack if hungry at night

**Nighttime Snack Ideas:**
• Banana with almond butter
• Greek yogurt with berries
• Whole grain toast with avocado
• Warm milk with honey
• A handful of nuts`
    },
    { 
      icon: Brain, 
      title: 'Mindful Eating', 
      desc: 'Eat slowly and listen to your body',
      content: `Mindful eating is about being present and aware during meals, helping you develop a healthier relationship with food.

**What is Mindful Eating?**
Mindful eating means paying full attention to the experience of eating and drinking, both inside and outside the body.

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

**Start Small:** Begin with one mindful meal per day, perhaps breakfast or lunch, and gradually expand the practice.`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Featured Image */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600" 
          alt="Nutrition" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <h2 className="text-white font-bold text-xl p-4">Nutrition Guidance</h2>
        </div>
      </div>

      {/* Nutrition Article Cards */}
      <div className="grid grid-cols-2 gap-3">
        {nutritionArticles.map((article, index) => {
          const Icon = article.icon;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedArticle(article)}
              className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 text-center hover:shadow-lg transition-all cursor-pointer"
            >
              <Icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-[#1a1a2e] dark:text-white mb-1">{article.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{article.desc}</p>
            </motion.button>
          );
        })}
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
          <div className="prose prose-sm dark:prose-invert">
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

      {/* AI Nutrition Advisor */}
      <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
        <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">Ask a Nutrition Question</h3>
        
        <Textarea
          placeholder="E.g., What foods help with energy? Best pre-workout snacks?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mb-3 min-h-[80px]"
        />
        
        <Button
          onClick={handleGetAdvice}
          disabled={!question.trim() || loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting Advice...
            </>
          ) : (
            'Get Personalized Advice'
          )}
        </Button>

        {advice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-4"
          >
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{advice.summary}</p>
            </div>

            {advice.tips && advice.tips.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-2 text-sm">Tips:</h4>
                <ul className="space-y-1">
                  {advice.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">✓ {tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {advice.foods_to_include && advice.foods_to_include.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-2 text-sm">Foods to Include:</h4>
                <div className="flex flex-wrap gap-2">
                  {advice.foods_to_include.map((food, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full text-xs">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {advice.caution && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">{advice.caution}</p>
              </div>
            )}
          </motion.div>
        )}

        <CommentSection contentId="nutrition_guide" contentType="nutrition_plan" />
      </div>
    </div>
  );
}