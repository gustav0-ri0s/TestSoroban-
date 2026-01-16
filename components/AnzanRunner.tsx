
import React, { useState, useEffect } from 'react';
import { ProblemSet, OperationType } from '../types';
import { audioService } from '../services/audioService';

interface AnzanRunnerProps {
  problemSet: ProblemSet;
  delay: number;
  onFinish: () => void;
}

const AnzanRunner: React.FC<AnzanRunnerProps> = ({ problemSet, delay, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

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
          onFinish();
        }
      }, delay);
      return () => clearTimeout(nextTimer);
    }
  }, [currentIndex, problemSet.numbers.length, delay, onFinish]);

  if (currentIndex === -1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-emerald-600">
        <h2 className="text-6xl font-black animate-ping tracking-widest">¡LISTO!</h2>
      </div>
    );
  }

  const currentNumber = problemSet.numbers[currentIndex];
  const currentOp = problemSet.operators[currentIndex];
  const isPractice = problemSet.configAtRun?.operationType === OperationType.PRACTICE_COMPLEMENTS;
  const showHint = isPractice && problemSet.configAtRun?.practiceOptions.showHints;

  const getHint = (num: number, op: string) => {
    const n = num % 10;
    if (n < 6 || n > 9) return null;
    
    if (op === '+' || op === 'Initial') {
      return `5 + ${n - 5}`;
    } else if (op === '-') {
      return `-5 - ${n - 5}`;
    }
    return null;
  };

  const hintText = getHint(currentNumber, currentOp);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {isPractice && (
        <div className="mb-8 text-emerald-600 font-bold tracking-widest uppercase text-xs border-b border-emerald-100 pb-2">
           Práctica de Complementos
        </div>
      )}

      <div className="relative">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-100 px-4 py-1 rounded-full text-gray-500 font-bold text-xs tracking-widest uppercase whitespace-nowrap shadow-sm">
          Paso {currentIndex + 1} de {problemSet.numbers.length}
        </div>
        
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-6 md:space-x-10">
                <div className="w-20 md:w-32 text-right">
                    {currentOp === '-' && (
                      <span className="text-7xl md:text-9xl font-black text-red-500 leading-none">-</span>
                    )}
                    {(currentOp === '+' || currentOp === 'Initial') && currentIndex > 0 && (
                      <span className="text-7xl md:text-9xl font-black text-emerald-500 leading-none">+</span>
                    )}
                    {(currentOp === 'x' || currentOp === '÷') && (
                      <span className="text-7xl md:text-8xl font-bold text-emerald-400 leading-none">{currentOp}</span>
                    )}
                </div>
                
                <span className="text-8xl md:text-[14rem] font-extrabold text-gray-900 anzan-font tracking-tighter leading-none transition-all duration-75">
                    {currentNumber}
                </span>
            </div>

            {showHint && hintText && (
              <div className="mt-8 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-2xl font-black text-2xl md:text-3xl animate-fadeIn border border-emerald-100 shadow-sm">
                 {hintText}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnzanRunner;
