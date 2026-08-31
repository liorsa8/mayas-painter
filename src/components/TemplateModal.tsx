import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES, TEMPLATES, Template } from '../constants';

interface TemplateModalProps {
  show: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelect: (template: Template) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ 
  show, 
  onClose, 
  currentTemplateId, 
  onSelect 
}) => {
  const [activeCategory, setActiveCategory] = useState('animals');

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#00000088] backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#FFF9ED] w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border-6 border-white"
          >
            <div className="p-4 sm:p-6 flex flex-col gap-4 border-b-2 border-[#F3E5AB] bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5D4037]">
                    <ImageIcon className="w-6 h-6 text-[#4D96FF]" />
                    <h2 className="text-xl sm:text-2xl font-display font-black uppercase">בחרו ציור לצביעה!</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-red-500" />
                </button>
              </div>

              {/* Categories Tab */}
              <div className="flex gap-2 p-1 bg-[#FFF9ED] rounded-xl self-start">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                      activeCategory === cat.id 
                        ? 'bg-[#4D96FF] text-white shadow-md' 
                        : 'text-[#5D4037] hover:bg-white/50'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 sm:p-8 flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {TEMPLATES[activeCategory].map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(t)}
                  className={`group relative p-4 bg-white rounded-2xl border-4 transition-all flex flex-col items-center justify-center gap-3 ${
                    currentTemplateId === t.id ? 'border-[#6BCB77] shadow-lg ring-4 ring-[#6BCB77]/10' : 'border-[#F3E5AB] hover:border-amber-200 shadow-md'
                  }`}
                >
                  {t.url ? (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                      <img 
                        src={t.url} 
                        alt={t.name}
                        className="w-full h-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"
                      />
                    </div>
                  ) : (
                    <span className="text-4xl sm:text-5xl">{t.icon}</span>
                  )}
                  <span className="font-black text-[#5D4037] text-xs sm:text-sm">{t.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
