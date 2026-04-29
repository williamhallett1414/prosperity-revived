import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShoppingCart, Check } from 'lucide-react';
import { useGroceryList } from '@/components/wellness/useGroceryList';

const CAT_ICON = {
  'Produce':        '🥬',
  'Protein & Meat': '🍗',
  'Dairy':          '🥛',
  'Grains & Bread': '🌾',
  'Pantry & Spices':'🧂',
  'Nuts & Seeds':   '🥜',
  'Other':          '📦',
};

export default function GroceryListDrawer({ isOpen, onClose }) {
  const { grouped, totalCount, checkedCount, toggleItem, removeItem, clearChecked, clearAll, download } = useGroceryList();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-white/5 rounded-t-3xl max-h-[88vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#FAD98D]/40" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b border-[#FAD98D]/20 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center">
                  <ShoppingCart className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="font-bold text-[#0A1A2F] dark:text-white dark:text-white">Grocery List</p>
                  <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">
                    {totalCount === 0 ? 'Empty' : `${checkedCount} of ${totalCount} checked`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {checkedCount > 0 && (
                  <button onClick={clearChecked}
                    className="text-xs font-semibold text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F]/70 dark:text-white/70 px-2 py-1 rounded-lg hover:bg-[#F2F6FA] dark:bg-[#0A1A2F] transition-colors">
                    Clear done
                  </button>
                )}
                {totalCount > 0 && (
                  <button onClick={download}
                    className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-[#c9a227] to-[#FAD98D] px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                )}
                <button onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center text-[#0A1A2F]/50 dark:text-white/50 hover:bg-[#FAD98D]/20">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-4 py-3">
              {totalCount === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15" />
                  </div>
                  <p className="font-bold text-[#0A1A2F]/40 dark:text-white/40 text-sm">No items yet</p>
                  <p className="text-xs text-[#0A1A2F]/30 dark:text-white/30 mt-1">Tap "Add to list" on any recipe</p>
                </div>
              ) : (
                <div className="space-y-5 pb-6">
                  {grouped.map(({ category, items }) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base leading-none">{CAT_ICON[category]}</span>
                        <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">{category}</p>
                        <span className="text-[10px] text-[#0A1A2F]/25 dark:text-white/25">· {items.length}</span>
                      </div>
                      <div className="space-y-1.5">
                        {items.map(item => (
                          <div key={item.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                              item.checked
                                ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F] border-[#FAD98D]/15 opacity-60'
                                : 'bg-white dark:bg-white/5 border-[#FAD98D]/20'
                            }`}>
                            {/* Checkbox */}
                            <button onClick={() => toggleItem(item.id)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                item.checked
                                  ? 'bg-[#c9a227] border-[#c9a227]'
                                  : 'border-[#FAD98D]/50 hover:border-[#c9a227]'
                              }`}>
                              {item.checked && <Check className="w-3 h-3 text-white" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold leading-snug ${item.checked ? 'line-through text-[#0A1A2F]/40 dark:text-white/40' : 'text-[#0A1A2F] dark:text-white dark:text-white'}`}>
                                {item.ingredient}
                              </p>
                              <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35 mt-0.5">{item.recipeTitle}</p>
                            </div>

                            <button onClick={() => removeItem(item.id)}
                              className="text-[#0A1A2F]/20 dark:text-white/20 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Clear all */}
                  <button onClick={clearAll}
                    className="w-full text-xs font-semibold text-red-400 hover:text-red-500 py-2 transition-colors">
                    Clear entire list
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}