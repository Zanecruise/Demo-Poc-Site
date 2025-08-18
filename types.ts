export type ModuleId = 
  | 'externalClient'
  | 'apiGateway'
  | 'scoreLabCore'
  | 'sherlock'
  | 'externalApis'
  | 'vertexAi'
  | 'dfc'
  | 'scoreEngine'
  | 'eventarc'
  | 'firestore';

export interface DemoStep {
  title: string;
  description: string;
  duration: number; // visual delay in ms
  activeModules: ModuleId[];
  connections: [ModuleId, ModuleId][];
  scoreUpdate?: { from: number; to: number };
  latency: number; // simulated processing time in ms for this step
  cost: number; // simulated cost for this step
}
