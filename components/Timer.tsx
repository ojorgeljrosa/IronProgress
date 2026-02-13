
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  onComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialSeconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete?.();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <div className="text-5xl font-black mb-4 font-mono text-emerald-400 tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          onClick={() => setTimeLeft(prev => prev + 30)}
          className="p-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-full transition-colors flex items-center gap-1 px-4"
        >
          <Plus size={18} /> 30s
        </button>
        <button 
          onClick={() => { setTimeLeft(initialSeconds); setIsActive(true); }}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
