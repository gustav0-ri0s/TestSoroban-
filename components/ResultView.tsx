
import React, { useState, useEffect, useRef } from 'react';
import { ProblemSet } from '../types';

interface ResultViewProps {
  problemSet: ProblemSet;
  onRetry: () => void;
  onFinish: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ problemSet, onRetry, onFinish }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerConfetti = async () => {
    try {
      const { default: confetti } = await import('https://esm.sh/canvas-confetti');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#ffffff', '#fbbf24'],
        ticks: 300
      });
    } catch (e) {
      console.error("No se pudo cargar el confeti", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === '') return;

    const correct = parseInt(userAnswer) === problemSet.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
    
    if (correct) {
      triggerConfetti();
    }
  };

  const renderSequence = () => {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
          Verificación del Ejercicio
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-2 text-xl md:text-2xl font-semibold text-gray-700">
          {problemSet.numbers.map((num, idx) => {
            const op = problemSet.operators[idx];
            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className={`font-black ${op === '-' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {op === 'Initial' ? '+' : (op === 'x' ? '×' : (op === '÷' ? '÷' : op))}
                  </span>
                )}
                <span className="bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                  {num}
                </span>
              </React.Fragment>
            );
          })}
          <span className="font-black text-gray-400">=</span>
          <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-lg shadow-inner border border-emerald-200 font-black">
            {problemSet.correctAnswer}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 text-xl"
            >
              ENVIAR RESPUESTA
            </button>
          </form>
        ) : (
          <div className="text-center space-y-8 animate-bounceIn">
            <div>
              {isCorrect ? (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mb-4 shadow-lg animate-pulse">
                    ★
                  </div>
                  <h2 className="text-5xl font-black text-emerald-600 tracking-tighter">¡EXCELENTE!</h2>
                  <p className="text-gray-500 mt-2 font-medium">Cálculo mental perfecto.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-5xl mb-4 shadow-sm">
                    ✕
                  </div>
                  <h2 className="text-4xl font-black text-red-600">INTÉNTALO DE NUEVO</h2>
                  <p className="text-gray-500 mt-2">
                    Tu respuesta: <span className="font-bold text-red-500">{userAnswer}</span>
                  </p>
                  <p className="text-gray-900 text-xl mt-1">
                    El resultado correcto era: <span className="font-bold underline text-emerald-600">{problemSet.correctAnswer}</span>
                  </p>
                </div>
              )}
            </div>

            {renderSequence()}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={onRetry}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-1"
              >
                OTRO INTENTO
              </button>
              <button
                onClick={onFinish}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all shadow-md hover:-translate-y-1"
              >
                AJUSTES
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;
