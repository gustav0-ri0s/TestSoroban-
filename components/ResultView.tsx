
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === '') return;

    const correct = parseInt(userAnswer) === problemSet.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
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
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-4">
                    ✓
                  </div>
                  <h2 className="text-4xl font-black text-green-600">¡EXCELENTE!</h2>
                  <p className="text-gray-500 mt-2">Has resuelto el ejercicio correctamente.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-5xl mb-4">
                    ✕
                  </div>
                  <h2 className="text-4xl font-black text-red-600">INTÉNTALO DE NUEVO</h2>
                  <p className="text-gray-500 mt-2">
                    Tu respuesta: <span className="font-bold">{userAnswer}</span>
                  </p>
                  <p className="text-gray-900 text-xl mt-1">
                    Correcto: <span className="font-bold underline">{problemSet.correctAnswer}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <button
                onClick={onRetry}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-1"
              >
                CONTINUAR
              </button>
              <button
                onClick={onFinish}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all shadow-md hover:-translate-y-1"
              >
                CONFIGURACIÓN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;
