
import React, { useState, useEffect, useRef } from 'react';
import { ProblemSet, OperationType, Difficulty, SessionResult } from '../types';
import confetti from 'canvas-confetti';

interface ResultViewProps {
  problemSet: ProblemSet;
  onRetry: () => void;
  onFinish: () => void;
  onUpgradeDifficulty?: (newDiff: Difficulty) => void;
}

const ResultView: React.FC<ResultViewProps> = ({ problemSet, onRetry, onFinish, onUpgradeDifficulty }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#34d399', '#ffffff', '#fbbf24']
    });
  };

  const formatProblemSequence = () => {
    const { numbers, operators } = problemSet;
    
    if (operators.length === 1 && (operators[0] === 'x' || operators[0] === '÷')) {
      return `${numbers[0]} ${operators[0]} ${numbers[1]}`;
    }

    let result = '';
    for (let i = 0; i < numbers.length; i++) {
      const op = operators[i];
      const num = numbers[i];
      
      if (i === 0) {
        result += num;
      } else {
        const displayOp = op === 'Initial' ? '+' : op;
        result += ` ${displayOp} ${num}`;
      }
    }
    return result;
  };

  const saveToHistory = (correct: boolean) => {
    const elapsed = Date.now() - (problemSet.startTime || Date.now());
    const avgTime = elapsed / (problemSet.numbers.length || 1);
    
    const newSession: SessionResult = {
      date: new Date().toISOString(),
      accuracy: correct ? 100 : 0,
      avgTime: avgTime,
      difficulty: problemSet.configAtRun?.practiceOptions.difficulty || Difficulty.BASIC,
      count: problemSet.numbers.length
    };

    const history = JSON.parse(localStorage.getItem('anzan_history') || '[]');
    history.push(newSession);
    localStorage.setItem('anzan_history', JSON.stringify(history.slice(-50)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === '') return;

    const correct = parseInt(userAnswer) === problemSet.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
    
    saveToHistory(correct);

    if (correct) {
      triggerConfetti();
    }
  };

  const renderStats = () => {
    const elapsed = Date.now() - (problemSet.startTime || Date.now());
    const avgTime = (elapsed / 1000 / (problemSet.numbers.length || 1)).toFixed(2);
    
    const targets = problemSet.numbers.filter(n => [6,7,8,9].includes(n % 10)).length;
    const targetPerc = Math.round((targets / problemSet.numbers.length) * 100);

    const diffLabel = problemSet.configAtRun?.practiceOptions.difficulty === Difficulty.BASIC ? 'BÁSICA' : 
                     problemSet.configAtRun?.practiceOptions.difficulty === Difficulty.INTERMEDIATE ? 'MEDIA' : 'AVANZADA';

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm">
           <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Ritmo</div>
           <div className="text-xl font-black text-gray-700">{avgTime}s <span className="text-xs text-gray-400">/op</span></div>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm">
           <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Frecuencia 6-9</div>
           <div className="text-xl font-black text-gray-700">{targetPerc}%</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm">
           <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Dificultad</div>
           <div className="text-xl font-black text-gray-700 uppercase">{diffLabel}</div>
        </div>
      </div>
    );
  };

  const handleUpgrade = () => {
    if (!onUpgradeDifficulty) return;
    const current = problemSet.configAtRun?.practiceOptions.difficulty;
    if (current === Difficulty.BASIC) onUpgradeDifficulty(Difficulty.INTERMEDIATE);
    else if (current === Difficulty.INTERMEDIATE) onUpgradeDifficulty(Difficulty.ADVANCED);
  };

  const canUpgrade = problemSet.configAtRun?.practiceOptions.difficulty !== Difficulty.ADVANCED;

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-50">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-800">¿Cuál es el resultado?</h2>
            
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full text-center text-6xl font-black py-8 border-b-8 border-emerald-200 focus:border-emerald-600 focus:outline-none transition-colors duration-200 bg-transparent text-gray-900"
              placeholder="?"
            />

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 text-xl uppercase tracking-wider"
            >
              Enviar Respuesta
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-bounceIn">
            <div className="flex flex-col items-center">
              {isCorrect ? (
                <>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm border border-emerald-50">
                    ★
                  </div>
                  <h2 className="text-5xl font-black text-emerald-600 tracking-tight italic uppercase mb-1">¡Fantástico!</h2>
                  <p className="text-gray-400 font-medium text-lg">Has acertado la operación.</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm border border-red-50">
                    ✕
                  </div>
                  <h2 className="text-4xl font-black text-red-600 uppercase mb-1">Revisa tus cuentas</h2>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 font-medium">
                      Tu respuesta: <span className="font-bold text-red-500">{userAnswer}</span>
                    </p>
                    <p className="text-gray-800 text-xl mt-1">
                      Correcto: <span className="font-bold text-emerald-600">{problemSet.correctAnswer}</span>
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className={`mt-6 p-6 rounded-3xl border w-full max-w-xl mx-auto ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${isCorrect ? 'text-emerald-500' : 'text-gray-400'}`}>
                Operación Realizada:
              </p>
              <p className={`text-2xl md:text-3xl font-black break-words tracking-tight ${isCorrect ? 'text-emerald-900' : 'text-gray-800'}`}>
                {formatProblemSequence()} = {problemSet.correctAnswer}
              </p>
            </div>

            {renderStats()}

            <div className="flex flex-col space-y-4 pt-4">
              {/* Main action: Next Exercise */}
              <button
                onClick={onRetry}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center space-x-3 text-lg uppercase tracking-wider"
              >
                <span className="text-2xl">🔄</span>
                <span>Siguiente Ejercicio</span>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upgrade Level button - only if not already advanced */}
                {canUpgrade && isCorrect ? (
                  <button
                    onClick={handleUpgrade}
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-4 rounded-2xl transition-all shadow-md hover:-translate-y-1 flex items-center justify-center space-x-2 text-md uppercase tracking-wide"
                  >
                    <span className="text-xl">🚀</span>
                    <span>Aumentar Nivel</span>
                  </button>
                ) : null}
                
                {/* Settings button */}
                <button
                  onClick={onFinish}
                  className={`${(!canUpgrade || !isCorrect) ? 'col-span-2' : ''} bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl transition-all shadow-sm border border-gray-100 hover:-translate-y-1 flex items-center justify-center space-x-2 text-md uppercase tracking-wide`}
                >
                  <span className="text-xl opacity-60">⚙️</span>
                  <span>Ajustes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;
