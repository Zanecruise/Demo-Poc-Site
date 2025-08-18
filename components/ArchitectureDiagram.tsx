import React from 'react';
import type { ModuleId } from '../types';
import { ModuleCard } from './ModuleCard';
import { DataFlow } from './DataFlow';

interface ArchitectureDiagramProps {
  activeModules: ModuleId[];
  activeConnections: [ModuleId, ModuleId][];
}

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ activeModules, activeConnections }) => {
  const isActive = (id: ModuleId) => activeModules.includes(id);

  return (
    <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 flex-grow flex flex-col items-center justify-center relative min-h-[500px] lg:min-h-full overflow-hidden">
      <div id="diagram-container" className="w-full h-full relative flex items-center justify-around">
        
        {/* Column 1: Input */}
        <div className="flex flex-col items-center gap-8">
            <ModuleCard id="externalClient" title="Cliente Externo" isActive={isActive('externalClient')} />
        </div>

        {/* Column 2: Gateway */}
        <div className="flex flex-col items-center gap-8">
             <ModuleCard id="apiGateway" title="API Gateway" isActive={isActive('apiGateway')} />
        </div>


        {/* Column 3: GCP Core / Orchestration */}
        <div className="border-2 border-dashed border-cyan-500/30 rounded-lg flex items-center justify-center p-10 h-[80%]">
            <div className="relative flex items-center justify-center gap-20">
                <div className="flex flex-col items-center justify-around h-full gap-10">
                     <ModuleCard id="sherlock" title="Sherlock" subTitle="Detetive On-Chain" isActive={isActive('sherlock')} />
                     <ModuleCard id="vertexAi" title="Vertex AI" subTitle="AI Risk Signals" isActive={isActive('vertexAi')} />
                     <ModuleCard id="externalApis" title="APIs Externas" subTitle="(Provedores de Dados)" isActive={isActive('externalApis')} />
                </div>

                <ModuleCard id="scoreLabCore" title="ScoreLab Core" subTitle="Orquestrador" isActive={isActive('scoreLabCore')} />
                
                <div className="flex flex-col items-center justify-around h-full gap-10">
                    <ModuleCard id="dfc" title="DFC" subTitle="Gov. de Regras" isActive={isActive('dfc')} />
                    <ModuleCard id="scoreEngine" title="Score Engine" subTitle="(P(x)/smil)" isActive={isActive('scoreEngine')} />
                </div>
            </div>
        </div>
        
        {/* Column 4: Async Logging */}
        <div className="flex flex-col items-center gap-2">
           <ModuleCard id="eventarc" title="Eventarc" isActive={isActive('eventarc')} />
           <div className="text-gray-500 text-2xl leading-none -my-2">↓</div>
           <ModuleCard id="firestore" title="Firestore" subTitle="Log Imutável" isActive={isActive('firestore')} />
        </div>
        
        <DataFlow connections={activeConnections} />
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
