
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
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center text-emerald-600">
        <h2 className="text-8xl md:text-[12rem] font-black animate-ping tracking-[0.2em]">¡LISTO!</h2>
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
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center overflow-hidden animate-fadeIn select-none">
      {/* Top Metadata Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="bg-gray-100/80 backdrop-blur-sm px-6 py-2 rounded-full text-gray-500 font-black text-sm tracking-[0.3em] uppercase shadow-sm">
          PASO {currentIndex + 1} DE {problemSet.numbers.length}
        </div>
        {isPractice && (
          <div className="bg-emerald-600 text-white px-6 py-2 rounded-full font-black text-sm tracking-[0.1em] uppercase shadow-md">
            MODO PRÁCTICA
          </div>
        )}
      </div>

      {/* Massive Number Container */}
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <div className="flex items-center justify-center space-x-6 md:space-x-12">
          {/* Operator Display */}
          <div className="w-[10vw] md:w-[15vw] flex items-center justify-end">
            {currentOp === '-' && (
              <span className="text-[12vw] md:text-[18vh] font-black text-red-500 leading-none">-</span>
            )}
            {(currentOp === '+' || currentOp === 'Initial') && currentIndex > 0 && (
              <span className="text-[12vw] md:text-[18vh] font-black text-emerald-500 leading-none">+</span>
            )}
            {(currentOp === 'x' || currentOp === '÷') && (
              <span className="text-[10vw] md:text-[15vh] font-bold text-emerald-400 leading-none">{currentOp}</span>
            )}
          </div>
          
          {/* Huge Numbers */}
          <div className="flex-1 flex justify-center">
            <span className="text-[25vw] md:text-[45vh] font-extrabold text-gray-900 anzan-font tracking-tighter leading-none transition-all duration-75 transform scale-110">
              {currentNumber}
            </span>
          </div>
          
          {/* Empty spacer for balancing the operator if needed, or keeping it centered */}
          <div className="w-[10vw] md:w-[15vw]"></div>
        </div>
      </div>

      {/* Bottom Hint Bar */}
      {showHint && hintText && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-emerald-50 text-emerald-700 px-12 py-4 rounded-[2rem] font-black text-4xl md:text-6xl animate-bounceIn border-4 border-emerald-100 shadow-xl">
             {hintText}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnzanRunner;
