import React from 'react';
import { motion } from 'motion/react';
import { Paintbrush } from 'lucide-react';
import { BRUSH_SIZES } from '../constants';

interface BrushPickerProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export const BrushPicker: React.FC<BrushPickerProps> = ({ brushSize, setBrushSize }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 border-t border-gray-50 pt-4 px-4" dir="ltr">
      <div className="shrink-0 flex items-center justify-center w-8 h-8 text-[#FF4B4B] bg-[#FF4B4B]/10 rounded-lg">
        <Paintbrush size={18} className="sm:w-5 sm:h-5" />
      </div>
      
      <div className="h-6 w-px bg-gray-200 shrink-0" />
      
      <div 
        className="flex-1 relative flex items-center justify-between px-2 touch-none h-12"
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, x / rect.width));
          const index = Math.round(percentage * (BRUSH_SIZES.length - 1));
          if (index >= 0 && index < BRUSH_SIZES.length) {
            setBrushSize(BRUSH_SIZES[index].size);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, x / rect.width));
          const index = Math.round(percentage * (BRUSH_SIZES.length - 1));
          if (index >= 0 && index < BRUSH_SIZES.length) {
            setBrushSize(BRUSH_SIZES[index].size);
          }
        }}
      >
        {/* Connection Line */}
        <div className="absolute left-4 right-4 h-0.5 bg-gray-200 top-1/2 -translate-y-1/2 z-0" />
        
        {BRUSH_SIZES.map((b) => (
          <button
            key={b.id}
            onClick={() => setBrushSize(b.size)}
            title={`מברשת ${b.label}`}
            aria-label={`מברשת ${b.label}`}
            aria-pressed={brushSize === b.size}
            className="relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 group"
          >
            <motion.div 
              initial={false}
              animate={{
                scale: brushSize === b.size ? 1.25 : 1,
                backgroundColor: brushSize === b.size ? '#FF4B4B' : '#FFFFFF',
                borderColor: brushSize === b.size ? '#FFFFFF' : '#D1D5DB'
              }}
              transition={{ type: "spring", stiffness: 800, damping: 35, mass: 0.2 }}
              className={`rounded-full border-2 ${
                brushSize === b.size ? 'shadow-lg' : ''
              }`}
              style={{ 
                width: Math.max(8, b.size / 3.5 + 8), 
                height: Math.max(8, b.size / 3.5 + 8) 
              }}
            />
            
            {brushSize === b.size && (
              <motion.div 
                layoutId="activeSizeHighlight"
                className="absolute inset-0 bg-[#FF4B4B]/10 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 800, damping: 35, mass: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
