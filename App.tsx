
import React, { useState, useCallback } from 'react';
import { AnzanConfig, OperationType, GameState, ProblemSet, Difficulty } from './types';
import Configuration from './components/Configuration';
import AnzanRunner from './components/AnzanRunner';
import ResultView from './components/ResultView';
import { generateProblem } from './services/arithmeticService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.CONFIG);
  const [config, setConfig] = useState<AnzanConfig>({
    count: 5,
    digits: 1,
    delay: 1000,
    operationType: OperationType.SUM,
    practiceOptions: {
      include89: false,
      difficulty: Difficulty.BASIC,
      showHints: true
    }
  });
  const [currentProblem, setCurrentProblem] = useState<ProblemSet | null>(null);

  const startTraining = useCallback(() => {
    const problem = generateProblem(config);
    setCurrentProblem(problem);
    setGameState(GameState.RUNNING);
  }, [config]);

  const goToInput = useCallback(() => {
    setGameState(GameState.INPUT);
  }, []);

  const resetToConfig = useCallback(() => {
    setGameState(GameState.CONFIG);
    setCurrentProblem(null);
  }, []);

  const upgradeDifficulty = useCallback((newDiff: Difficulty) => {
     setConfig(prev => ({
       ...prev,
       practiceOptions: { ...prev.practiceOptions, difficulty: newDiff }
     }));
     // After upgrading, we restart automatically
     setTimeout(() => {
       startTraining();
     }, 100);
  }, [startTraining]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      {/* App Header */}
      <header className={`transition-all duration-300 mb-8 flex flex-col items-center ${gameState === GameState.RUNNING ? 'opacity-20 scale-75' : 'opacity-100'}`}>
        <div className="flex items-center space-x-4 mb-2">
           <svg width="56" height="40" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600 drop-shadow-md border-2 border-emerald-600 rounded-md p-1 bg-white">
             <rect x="0.5" y="0.5" width="23" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
             <line x1="0.5" y1="5" x2="23.5" y2="5" stroke="currentColor" strokeWidth="1.5" />
             <line x1="5" y1="0.5" x2="5" y2="15.5" stroke="currentColor" strokeWidth="0.5" />
             <line x1="9.5" y1="0.5" x2="9.5" y2="15.5" stroke="currentColor" strokeWidth="0.5" />
             <line x1="14" y1="0.5" x2="14" y2="15.5" stroke="currentColor" strokeWidth="0.5" />
             <line x1="18.5" y1="0.5" x2="18.5" y2="15.5" stroke="currentColor" strokeWidth="0.5" />
             <circle cx="5" cy="2.5" r="1.2" fill="currentColor" />
             <circle cx="9.5" cy="2.5" r="1.2" fill="currentColor" />
             <circle cx="14" cy="2.5" r="1.2" fill="currentColor" />
             <circle cx="18.5" cy="2.5" r="1.2" fill="currentColor" />
             <circle cx="5" cy="8" r="1.2" fill="currentColor" />
             <circle cx="5" cy="10.5" r="1.2" fill="currentColor" />
             <circle cx="9.5" cy="10.5" r="1.2" fill="currentColor" />
             <circle cx="14" cy="13" r="1.2" fill="currentColor" />
             <circle cx="18.5" cy="8" r="1.2" fill="currentColor" />
           </svg>
           <span className="text-3xl font-extrabold text-gray-800 tracking-tight">Soroban<span className="text-emerald-600">Anzan</span></span>
        </div>
        <div className="h-1 w-24 bg-emerald-600 rounded-full"></div>
      </header>

      <main className="w-full max-w-5xl">
        {gameState === GameState.CONFIG && (
          <Configuration 
            config={config} 
            setConfig={setConfig} 
            onStart={startTraining} 
          />
        )}

        {gameState === GameState.RUNNING && currentProblem && (
          <AnzanRunner 
            problemSet={currentProblem} 
            delay={config.delay} 
            onFinish={goToInput}
          />
        )}

        {gameState === GameState.INPUT && currentProblem && (
          <ResultView 
            problemSet={currentProblem} 
            onRetry={startTraining}
            onFinish={resetToConfig}
            onUpgradeDifficulty={upgradeDifficulty}
          />
        )}
      </main>

      {/* Footer Instructions (Visible only in config) */}
      {gameState === GameState.CONFIG && (
        <footer className="mt-12 text-center text-gray-400 text-sm max-w-lg space-y-2">
          <p>Utiliza tu Soroban para realizar los cálculos. El modo de práctica 6 y 7 te ayudará a automatizar los movimientos de "pinza" más difíciles.</p>
          <div className="flex justify-center space-x-4 opacity-50">
             <span>+6 = +5 +1</span>
             <span>+7 = +5 +2</span>
             <span>+8 = +5 +3</span>
             <span>+9 = +5 +4</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
