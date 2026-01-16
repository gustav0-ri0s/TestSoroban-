
import React from 'react';
import { AnzanConfig, OperationType, Difficulty } from '../types';

interface ConfigurationProps {
  config: AnzanConfig;
  setConfig: (config: AnzanConfig) => void;
  onStart: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ config, setConfig, onStart }) => {
  const handleTypeChange = (type: OperationType) => {
    setConfig({ ...config, operationType: type });
  };

  const updatePractice = (key: string, value: any) => {
    setConfig({
      ...config,
      practiceOptions: {
        ...config.practiceOptions,
        [key]: value
      }
    });
  };

  const operations = [
    { id: OperationType.SUM, label: 'Suma (+)', icon: '➕' },
    { id: OperationType.SUBTRACT, label: 'Resta (-)', icon: '➖' },
    { id: OperationType.COMBINED_SUM_SUB, label: 'Suma y Resta', icon: '±' },
    { id: OperationType.MULTIPLY, label: 'Multiplicación', icon: '✖️' },
    { id: OperationType.DIVIDE, label: 'División', icon: '➗' },
    { id: OperationType.PRACTICE_COMPLEMENTS, label: 'Práctica 6 y 7', icon: '⚡' },
  ];

  const isPractice = config.operationType === OperationType.PRACTICE_COMPLEMENTS;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-emerald-600 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Soroban Anzan Master</h1>
          <p className="text-emerald-100 text-lg">Entrena tu mente con el ábaco japonés</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Operations Grid */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg mr-3">🧮</span>
              Tipo de Operación
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {operations.map((op) => (
                <button
                  key={op.id}
                  onClick={() => handleTypeChange(op.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                    config.operationType === op.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md'
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-emerald-300 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl mb-2">{op.icon}</span>
                  <span className="font-semibold text-sm text-center">{op.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Practice Specific Options */}
          {isPractice && (
            <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-6 animate-slideDown">
              <h2 className="text-lg font-bold text-emerald-800 flex items-center">
                <span className="mr-2">🛠️</span> Ajustes de Práctica (Complementos)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-emerald-900">Nivel de Dificultad</label>
                  <div className="flex bg-white p-1 rounded-xl shadow-sm border border-emerald-200">
                    {[Difficulty.BASIC, Difficulty.INTERMEDIATE, Difficulty.ADVANCED].map((d) => (
                      <button
                        key={d}
                        onClick={() => updatePractice('difficulty', d)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          config.practiceOptions.difficulty === d
                            ? 'bg-emerald-600 text-white'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {d === Difficulty.BASIC ? 'Básico' : d === Difficulty.INTERMEDIATE ? 'Medio' : 'Avanzado'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-emerald-600 opacity-70">Controla la frecuencia de saltos de decena.</p>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-emerald-900">Incluir 8 y 9</span>
                     <button 
                        onClick={() => updatePractice('include89', !config.practiceOptions.include89)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${config.practiceOptions.include89 ? 'bg-emerald-600' : 'bg-gray-300'}`}
                     >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${config.practiceOptions.include89 ? 'translate-x-7' : 'translate-x-1'}`} />
                     </button>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-emerald-900">Mostrar Pistas (5+X)</span>
                     <button 
                        onClick={() => updatePractice('showHints', !config.practiceOptions.showHints)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${config.practiceOptions.showHints ? 'bg-emerald-600' : 'bg-gray-300'}`}
                     >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${config.practiceOptions.showHints ? 'translate-x-7' : 'translate-x-1'}`} />
                     </button>
                   </div>
                </div>
              </div>
            </section>
          )}

          {/* Numeric Inputs */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">Cantidad de Números</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={config.count}
                  onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold w-12 text-center">
                  {config.count}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">Dígitos por Número</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={config.digits}
                  onChange={(e) => setConfig({ ...config, digits: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold w-12 text-center">
                  {config.digits}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">Velocidad (Delay)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={config.delay}
                  onChange={(e) => setConfig({ ...config, delay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold w-20 text-center text-xs">
                  {(config.delay / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          </section>

          <button
            onClick={onStart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 text-xl tracking-wider"
          >
            EMPEZAR ENTRENAMIENTO
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
