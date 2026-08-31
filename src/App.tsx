import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { 
  Trash2, 
  Undo2,
  Palette,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

import { COLORS, TEMPLATES, Template } from './constants';
import { ColorPicker } from './components/ColorPicker';
import { BrushPicker } from './components/BrushPicker';
import { TemplateModal } from './components/TemplateModal';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(26);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template>(TEMPLATES.animals[0]);

  // Handle Resize and Initial Canvas Setup
  useLayoutEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const scale = window.devicePixelRatio || 1;
      const { width, height } = container.getBoundingClientRect();
      
      // Save current content to restore it after resize
      const currentData = canvas.toDataURL();

      canvas.width = width * scale;
      canvas.height = height * scale;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.scale(scale, scale);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Restore content
      const img = new Image();
      img.src = currentData;
      img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
      };
      
      contextRef.current = ctx;
    };

    handleResize();
    const timeout = setTimeout(handleResize, 100);

    let resizeDebounce: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeout);
      clearTimeout(resizeDebounce);
    };
  }, []);

  // Sync canvas settings
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isEraser ? '#FFFFFF' : color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize, isEraser]);

  const getCoordinates = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { offsetX: 0, offsetY: 0 };
    return {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent) => {
    const { offsetX, offsetY } = getCoordinates(e);
    if (!contextRef.current) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current?.closePath();
    setIsDrawing(false);
    saveHistory();
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    requestAnimationFrame(() => {
      const data = canvas.toDataURL();
      setHistory(prev => [...prev.slice(-19), data]);
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  const undo = () => {
    if (history.length <= 1) {
        clearCanvas();
        setHistory([]);
        return;
    }
    const newHistory = [...history];
    newHistory.pop();
    const lastImg = newHistory[newHistory.length - 1];
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || !lastImg) return;

    const img = new Image();
    img.src = lastImg;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      setHistory(newHistory);
    };
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const fctx = finalCanvas.getContext('2d');
    if (!fctx) return;

    fctx.fillStyle = '#FFFFFF';
    fctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    fctx.drawImage(canvas, 0, 0);

    const finishSave = () => {
        const link = document.createElement('a');
        link.download = `mayas-painter-${Date.now()}.png`;
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: COLORS
        });
    };

    if (currentTemplate.url) {
      const tempImg = new Image();
      tempImg.crossOrigin = 'anonymous';
      tempImg.src = currentTemplate.url;
      tempImg.onload = () => {
        // Match the on-screen template sizing rule (h-[85%], auto width, centered)
        const scale = (finalCanvas.height * 0.85) / tempImg.height;
        const x = (finalCanvas.width - tempImg.width * scale) / 2;
        const y = (finalCanvas.height - tempImg.height * scale) / 2;
        fctx.filter = 'grayscale(100%) brightness(0.9)';
        fctx.globalCompositeOperation = 'multiply';
        fctx.drawImage(tempImg, x, y, tempImg.width * scale, tempImg.height * scale);
        fctx.filter = 'none';
        fctx.globalCompositeOperation = 'source-over';
        finishSave();
      };
      tempImg.onerror = finishSave;
    } else {
      finishSave();
    }
  };

  const selectTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setShowTemplates(false);
    clearCanvas();
    setHistory([]);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: COLORS
    });
  };

  return (
    <div className="fixed inset-0 bg-[#FFF9ED] flex flex-col items-center overflow-hidden font-sans" dir="rtl">
      {/* Header */}
      <header className="w-full h-14 sm:h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b-2 border-[#F3E5AB] z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md transform rotate-3">
            <Palette className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-lg sm:text-2xl font-display font-black text-[#5D4037] tracking-tight">
            הצייר של מאיה
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={saveImage}
            className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-[#6BCB77] text-white rounded-xl shadow-sm hover:bg-[#5bb767] active:scale-95 transition-all"
            title="שמור תמונה"
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button 
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-[#4D96FF] text-white rounded-xl font-bold shadow-sm hover:bg-[#3d86ef] active:scale-95 transition-all text-xs sm:text-base"
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>תבניות</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 w-full relative flex flex-col items-center justify-center p-2 sm:p-4 box-border overflow-hidden">
        <div className="absolute left-4 top-4 sm:left-8 sm:top-8 flex flex-col gap-3 z-20">
          <button 
            onClick={undo}
            disabled={history.length <= 0}
            title="ביטול"
            className={`p-3 bg-white rounded-xl shadow-lg transition-all border-b-2 border-gray-100 active:translate-y-0.5 active:border-b-0 ${history.length <= 0 ? 'opacity-30' : 'hover:bg-orange-50 text-[#5D4037]'}`}
          >
            <Undo2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={clearCanvas}
            title="נקה הכל"
            className="p-3 bg-white rounded-xl shadow-lg text-red-500 border-b-2 border-gray-100 active:translate-y-0.5 active:border-b-0 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full h-full max-w-full bg-white rounded-[2rem] shadow-xl border-4 sm:border-8 border-white overflow-hidden flex items-center justify-center p-0"
        >
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            className="absolute z-10 w-full h-full touch-none cursor-crosshair"
          />

          <AnimatePresence mode="wait">
            {currentTemplate.url && (
              <motion.img
                key={currentTemplate.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={currentTemplate.url}
                className="absolute z-20 w-auto h-[85%] object-contain pointer-events-none select-none p-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
                draggable={false}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="w-full max-w-5xl px-2 pb-4 sm:pb-6 z-30">
        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-[2rem] shadow-xl flex flex-col gap-3 border-2 border-white">
          <ColorPicker 
            color={color} 
            setColor={setColor} 
            isEraser={isEraser} 
            setIsEraser={setIsEraser} 
          />
          <BrushPicker 
            brushSize={brushSize} 
            setBrushSize={setBrushSize} 
          />
        </div>
      </footer>

      <TemplateModal 
        show={showTemplates} 
        onClose={() => setShowTemplates(false)} 
        currentTemplateId={currentTemplate.id} 
        onSelect={selectTemplate} 
      />
    </div>
  );
}
