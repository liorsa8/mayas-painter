import React from 'react';
import { motion } from 'motion/react';
import { Eraser } from 'lucide-react';
import { COLORS } from '../constants';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  isEraser: boolean;
  setIsEraser: (isEraser: boolean) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  setColor, 
  isEraser, 
  setIsEraser 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3" dir="ltr">
      {COLORS.map((c) => (
        <motion.button
          key={c}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setColor(c);
            setIsEraser(false);
          }}
          style={{ backgroundColor: c }}
          className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full shadow-sm border-2 transition-all ${
            color === c && !isEraser ? 'border-amber-400 scale-110 ring-2 ring-amber-100 ring-offset-1' : 'border-white'
          }`}
        />
      ))}
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsEraser(!isEraser)}
        className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-sm transition-all ${
          isEraser ? 'bg-[#4D96FF] text-white scale-110 ring-2 ring-blue-100 ring-offset-1' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
      >
        <Eraser className="w-4 h-4 sm:w-6 sm:h-6" />
      </motion.button>
    </div>
  );
};
