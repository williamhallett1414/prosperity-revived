import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DailyPrayer() {
  const prayers = [
  {
    title: "Morning Surrender",
    content: "Lord, as I begin this day, I surrender all my plans, worries, and hopes to You. Guide my steps, guard my heart, and help me to walk in Your love. May everything I do today bring glory to Your name. Amen."
  },
  {
    title: "Prayer for Peace",
    content: "Father, in this moment, I ask for Your perfect peace that surpasses all understanding. Calm my anxious thoughts, quiet my restless heart, and remind me that You are in control. I trust You completely. Amen."
  },
  {
    title: "Gratitude Prayer",
    content: "Heavenly Father, thank You for Your countless blessings. Thank You for life, breath, love, and grace. Open my eyes to see Your goodness in every moment. Help me to live with a grateful heart. Amen."
  },
  {
    title: "Prayer for Strength",
    content: "Lord Jesus, I feel weak today, but I know that in You I find strength. Fill me with Your power, renew my spirit, and help me to press on. I can do all things through Christ who strengthens me. Amen."
  },
  {
    title: "Evening Reflection",
    content: "God, as this day comes to a close, I thank You for walking with me. Forgive me where I've fallen short, and help me to rest in Your grace. Give me peaceful sleep and renewed hope for tomorrow. Amen."
  },
  {
    title: "Prayer for Guidance",
    content: "Father, I don't know which way to go, but You do. Give me wisdom to make the right decisions. Open doors You want me to walk through, and close the ones that aren't Your will. I trust Your perfect timing. Amen."
  },
  {
    title: "Prayer for Others",
    content: "Lord, I lift up those I love to You. Bless them, protect them, and draw them closer to Your heart. Use me to be a light in their lives. Help me to love them the way You love me. Amen."
  }];


  // Get today's prayer based on day of week
  const dayOfWeek = new Date().getDay();
  const todaysPrayer = prayers[dayOfWeek];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8">

      <Dialog>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }} className="bg-slate-50 text-[#3C4E53] p-6 text-left rounded-2xl w-full from-[#FD9C2D] to-[#FAD98D] shadow-lg">


            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-[#FD9C2D]" />
              <div>
                <h3 className="text-lg font-bold">2-Minute Prayer</h3>
                <p className="text-sm opacity-90">Today's guided prayer</p>
              </div>
            </div>
            <p className="text-sm opacity-80 italic">"{todaysPrayer.title}"</p>
          </motion.button>







        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#FD9C2D]" />
              {todaysPrayer.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🙏</div>
            </div>

            <div className="bg-[#FAD98D]/20 rounded-lg p-6 border border-[#FD9C2D]/30">
              <p className="text-[#3C4E53] font-serif leading-relaxed text-lg">
                {todaysPrayer.content}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Take a moment in silence</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>);

}