import React, { useState, useEffect, useCallback } from 'react';
import { initialRequestPayload, finalResponsePayload, DEMO_STEPS } from './constants';
import type { ModuleId } from './types';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CodeSnippet from './components/CodeSnippet';
import { ScoreCard } from './components/ScoreCard';
import { LogoIcon, GoogleCloudIcon, ClockIcon, DollarSignIcon } from './components/Icons';

const App: React.FC = () => {
  const [demoState, setDemoState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeModules, setActiveModules] = useState<ModuleId[]>([]);
  const [activeConnections, setActiveConnections] = useState<[ModuleId, ModuleId][]>([]);
  const [reputationScore, setReputationScore] = useState<number | null>(850);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [metrics, setMetrics] = useState({ latency: 0, cost: 0 });

  const resetDemo = useCallback(() => {
    setDemoState('idle');
    setCurrentStepIndex(0);
    setActiveModules([]);
    setActiveConnections([]);
    setReputationScore(850);
    setFinalScore(null);
    setMetrics({ latency: 0, cost: 0 });
  }, []);

  const startDemo = useCallback(() => {
    resetDemo();
    setDemoState('running');
  }, [resetDemo]);

  useEffect(() => {
    if (demoState !== 'running') return;

    if (currentStepIndex >= DEMO_STEPS.length) {
      const lastStep = DEMO_STEPS[DEMO_STEPS.length - 1];
      setMetrics(m => ({
          latency: m.latency + lastStep.latency,
          cost: m.cost + lastStep.cost,
      }));
      setActiveConnections([]);
      setDemoState('finished');
      return;
    }

    const step = DEMO_STEPS[currentStepIndex];
    setActiveModules(step.activeModules);
    setActiveConnections(step.connections);

    if (currentStepIndex > 0) {
        const prevStep = DEMO_STEPS[currentStepIndex - 1];
        setMetrics(m => ({
            latency: m.latency + prevStep.latency,
            cost: m.cost + prevStep.cost,
        }));
    } else {
        setMetrics({ latency: 0, cost: 0 });
    }

    if (step.scoreUpdate) {
        setReputationScore(step.scoreUpdate.from);
        setTimeout(() => {
            setFinalScore(step.scoreUpdate.to);
        }, 500);
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [demoState, currentStepIndex]);

  const currentStep = DEMO_STEPS[currentStepIndex] ?? DEMO_STEPS[DEMO_STEPS.length - 1];
  const progress = demoState === 'idle' ? 0 : (demoState === 'finished' ? 100 : (currentStepIndex / DEMO_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-700/50">
        <div className="flex items-center gap-4">
          <LogoIcon />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Demonstração da Primitiva de Confiança Executável
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 text-gray-400">
          <GoogleCloudIcon />
          <span>Powered by Google Cloud Web3</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col gap-6">
        <div className="flex-grow relative">
           <ArchitectureDiagram activeModules={activeModules} activeConnections={activeConnections} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeSnippet title="1. Requisição da API (Payload de Entrada)" code={initialRequestPayload} visible={demoState !== 'idle'} />
            <CodeSnippet title="2. Resposta da API (Artefato Probatório)" code={finalResponsePayload} visible={demoState === 'finished'} />
        </div>
      </main>

      {/* Executive Control Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 z-20">
        <div className="max-w-7xl mx-auto bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl shadow-black/50 p-4">
          <div className="w-full h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-cyan-400">
                {demoState === 'idle' ? 'Pronto para iniciar' : (demoState === 'finished' ? 'Análise Concluída' : `Passo ${currentStepIndex + 1}: ${currentStep.title}`)}
              </h3>
              <p className="text-sm text-gray-300 hidden lg:block">{demoState === 'idle' ? 'Clique em "Iniciar Simulação" para começar.' : currentStep.description}</p>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              {/* Metrics */}
              <div className="flex items-center gap-4 text-center">
                <div className="w-[120px]">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <ClockIcon />
                    <span>LATÊNCIA (p99)</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {metrics.latency.toFixed(0)}<span className="text-lg text-gray-400 ml-1">ms</span>
                  </div>
                </div>
                <div className="w-[120px]">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <DollarSignIcon />
                    <span>CUSTO / ANÁLISE</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    ${metrics.cost.toFixed(5)}
                  </div>
                </div>
              </div>
              
              <div className="h-12 w-px bg-gray-700 hidden md:block"></div>
              
              <ScoreCard initialScore={reputationScore} finalScore={finalScore} />
            </div>

            <div className="h-12 w-px bg-gray-700 hidden md:block"></div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={startDemo}
                disabled={demoState === 'running'}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                {demoState === 'running' ? 'Executando...' : 'Iniciar Simulação'}
              </button>
              <button
                onClick={resetDemo}
                disabled={demoState === 'idle'}
                className="flex-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Resetar
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
