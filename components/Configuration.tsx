
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

  // Custom slider class for better touch experience
  const sliderClass = "w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-600 touch-pan-y";

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
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                    config.operationType === op.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md'
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-emerald-300 hover:bg-white'
                  }`}
                >
                  <span className="text-3xl mb-2">{op.icon}</span>
                  <span className="font-bold text-sm text-center">{op.label}</span>
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
                        className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
                          config.practiceOptions.difficulty === d
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {d === Difficulty.BASIC ? 'Básico' : d === Difficulty.INTERMEDIATE ? 'Medio' : 'Avanzado'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-emerald-600 opacity-70">Controla la frecuencia de saltos de decena.</p>
                </div>

                <div className="space-y-4 pt-1">
                   <div className="flex items-center justify-between p-2 bg-white/50 rounded-xl">
                     <span className="text-sm font-bold text-emerald-900">Incluir 8 y 9</span>
                     <button 
                        onClick={() => updatePractice('include89', !config.practiceOptions.include89)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${config.practiceOptions.include89 ? 'bg-emerald-600' : 'bg-gray-300'}`}
                     >
                       <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${config.practiceOptions.include89 ? 'translate-x-8' : 'translate-x-1'}`} />
                     </button>
                   </div>
                   <div className="flex items-center justify-between p-2 bg-white/50 rounded-xl">
                     <span className="text-sm font-bold text-emerald-900">Mostrar Pistas (5+X)</span>
                     <button 
                        onClick={() => updatePractice('showHints', !config.practiceOptions.showHints)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${config.practiceOptions.showHints ? 'bg-emerald-600' : 'bg-gray-300'}`}
                     >
                       <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${config.practiceOptions.showHints ? 'translate-x-8' : 'translate-x-1'}`} />
                     </button>
                   </div>
                </div>
              </div>
            </section>
          )}

          {/* Numeric Inputs */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Cantidad de Números</label>
              <div className="flex flex-col space-y-3">
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={config.count}
                  onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) })}
                  className={sliderClass}
                />
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-gray-400">Pocos</span>
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-black text-lg">
                    {config.count}
                  </span>
                  <span className="text-xs text-gray-400">Muchos</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Dígitos por Número</label>
              <div className="flex flex-col space-y-3">
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={config.digits}
                  onChange={(e) => setConfig({ ...config, digits: parseInt(e.target.value) })}
                  className={sliderClass}
                />
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-gray-400">1 Dígito</span>
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-black text-lg">
                    {config.digits}
                  </span>
                  <span className="text-xs text-gray-400">6 Dígitos</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Velocidad (Segundos)</label>
              <div className="flex flex-col space-y-3">
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={config.delay}
                  onChange={(e) => setConfig({ ...config, delay: parseInt(e.target.value) })}
                  className={sliderClass}
                />
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-gray-400">Rápido</span>
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-black text-lg">
                    {(config.delay / 1000).toFixed(1)}s
                  </span>
                  <span className="text-xs text-gray-400">Lento</span>
                </div>
              </div>
            </div>
          </section>

          <button
            onClick={onStart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 px-8 rounded-3xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 text-2xl tracking-widest uppercase"
          >
            Empezar Entrenamiento
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
