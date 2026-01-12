
import React, { useState, useEffect } from 'react';
import { ProblemSet } from '../types';
import { audioService } from '../services/audioService';

interface AnzanRunnerProps {
  problemSet: ProblemSet;
  delay: number;
  onFinish: () => void;
}

const AnzanRunner: React.FC<AnzanRunnerProps> = ({ problemSet, delay, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (currentIndex === -1) {
      const startTimer = setTimeout(() => {
        setCurrentIndex(0);
        audioService.playBeep();
      }, 1000);
      return () => clearTimeout(startTimer);
    }

    if (currentIndex < problemSet.numbers.length) {
      const nextTimer = setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx < problemSet.numbers.length) {
          audioService.playBeep();
          setCurrentIndex(nextIdx);
        } else {
          setIsDone(true);
          onFinish();
        }
      }, delay);
      return () => clearTimeout(nextTimer);
    }
  }, [currentIndex, problemSet.numbers.length, delay, onFinish]);

  if (currentIndex === -1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-emerald-600">
        <h2 className="text-6xl font-black animate-ping">LISTO?</h2>
      </div>
    );
  }

  const currentNumber = problemSet.numbers[currentIndex];
  const currentOp = problemSet.operators[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-100 px-4 py-1 rounded-full text-gray-500 font-bold text-sm tracking-widest uppercase whitespace-nowrap">
          {currentIndex + 1} / {problemSet.numbers.length}
        </div>
        
        <div className="flex items-center justify-center space-x-8">
            {/* Large operator next to the number */}
            <div className="w-24 text-right">
                {currentOp === '-' && (
                  <span className="text-8xl md:text-[10rem] font-black text-red-500 leading-none">
                    -
                  </span>
                )}
                {currentOp === '+' && (
                  <span className="text-8xl md:text-[10rem] font-black text-emerald-500 leading-none">
                    +
                  </span>
                )}
                {/* For multiply/divide symbols if needed */}
                {(currentOp === 'x' || currentOp === '÷') && (
                  <span className="text-8xl md:text-[8rem] font-bold text-emerald-400 leading-none">
                    {currentOp}
                  </span>
                )}
            </div>
            
            <span className="text-9xl md:text-[14rem] font-extrabold text-gray-900 anzan-font tracking-tighter transition-all duration-75 leading-none">
                {currentNumber}
            </span>
        </div>
      </div>
    </div>
  );
};

export default AnzanRunner;
