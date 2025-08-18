import type { DemoStep } from './types';

export const initialRequestPayload = `{
  "transaction_id": "c7a8f2e9-b1d1-4f6a-9e1a-8c3d9f4b7a0e",
  "timestamp": "2025-07-23T17:55:00Z",
  "sdid_origin": "did:found:wallet:0xABC123...",
  "asset": {
    "type": "CRYPTO_WITHDRAWAL",
    "symbol": "USDC",
    "amount": 950.00,
    "network": "polygon"
  },
  "contexto_da_transacao": {
    "source_event": "pix_deposit_received",
    "source_transaction_id": "E18236120202507231754s047b22f4b1",
    "source_amount_brl": 5000.00
  }
}`;

export const finalResponsePayload = `{
  "decision_receipt": {
    "transaction_id": "c7a8f2e9-b1d1-4f6a-9e1a-8c3d9f4b7a0e",
    "action_executed": "REQUER_REVISAO_MANUAL",
    "policy_applied": "P07-TriangulacaoPixCripto",
    "justification": "Ativação da flag de risco crítico FLAG_ALERTA_TRIANGULACAO_PIX_CRIPTO."
  },
  "updated_sdid": {
    "sdid": "did:found:wallet:0xABC123...",
    "reputation_score": {
      "previous": 850,
      "current": 420
    },
    "active_flags": [
      {
        "flag_id": "FLAG_SAQUE_ALTO_VALOR_RECENTE",
        "source_module": "Sherlock"
      },
      {
        "flag_id": "FLAG_ALERTA_TRIANGULACAO_PIX_CRIPTO",
        "source_module": "ScoreLab Core (via DFC logic)"
      }
    ]
  }
}`;

export const DEMO_STEPS: DemoStep[] = [
  {
    title: 'Requisição de Análise Recebida',
    description: 'Um cliente externo envia um payload de transação para o API Gateway.',
    duration: 2500,
    activeModules: ['externalClient', 'apiGateway'],
    connections: [['externalClient', 'apiGateway']],
    latency: 15,
    cost: 0.0001,
  },
  {
    title: 'Orquestração via ScoreLab Core',
    description: 'O API Gateway aciona o ScoreLab Core, o cérebro da plataforma.',
    duration: 2500,
    activeModules: ['apiGateway', 'scoreLabCore'],
    connections: [['apiGateway', 'scoreLabCore']],
    latency: 10,
    cost: 0.0005,
  },
  {
    title: 'Coleta e Enriquecimento de Dados',
    description: 'O ScoreLab Core invoca múltiplos serviços em paralelo para enriquecer os dados.',
    duration: 3000,
    activeModules: ['scoreLabCore', 'sherlock', 'externalApis', 'vertexAi'],
    connections: [
        ['scoreLabCore', 'sherlock'],
        ['scoreLabCore', 'externalApis'],
        ['scoreLabCore', 'vertexAi'],
    ],
    latency: 150,
    cost: 0.008,
  },
  {
    title: 'Análise On-Chain (Sherlock)',
    description: 'Sherlock detecta um saque de alto valor recente, gerando a primeira flag de risco.',
    duration: 3500,
    activeModules: ['sherlock', 'scoreLabCore'],
    connections: [['sherlock', 'scoreLabCore']],
    latency: 0, 
    cost: 0,
  },
  {
    title: 'Consolidação e Aplicação de Regras',
    description: 'O ScoreLab Core consolida os dados e consulta as regras de negócio no DFC.',
    duration: 3000,
    activeModules: ['scoreLabCore', 'dfc'],
    connections: [['scoreLabCore', 'dfc']],
    latency: 30,
    cost: 0.0005,
  },
  {
    title: 'DFC Ativa Meta-Flag de Risco Crítico',
    description: 'A correlação entre o depósito Pix e o saque cripto ativa uma meta-flag crítica.',
    duration: 3500,
    activeModules: ['dfc', 'scoreLabCore'],
    connections: [['dfc', 'scoreLabCore']],
    latency: 0,
    cost: 0,
  },
  {
    title: 'Cálculo de Risco com Score Engine',
    description: 'As flags de risco são enviadas ao Score Engine para uma nova avaliação.',
    duration: 2500,
    activeModules: ['scoreLabCore', 'scoreEngine'],
    connections: [['scoreLabCore', 'scoreEngine']],
    latency: 10,
    cost: 0.0005,
  },
  {
    title: 'Score de Reputação Reavaliado',
    description: 'Com base nas flags, o score da wallet cai drasticamente de 850 para 420.',
    duration: 3000,
    activeModules: ['scoreEngine'],
    connections: [],
    scoreUpdate: { from: 850, to: 420 },
    latency: 50,
    cost: 0.001,
  },
  {
    title: 'Geração do Veredito Final',
    description: 'O ScoreLab Core compõe a resposta final da API, incluindo o artefato probatório.',
    duration: 2000,
    activeModules: ['scoreEngine', 'scoreLabCore'],
    connections: [['scoreEngine', 'scoreLabCore']],
    latency: 5,
    cost: 0.0001,
  },
  {
    title: 'Resposta Final Enviada (<300ms)',
    description: 'O veredito é retornado ao cliente, completando o fluxo síncrono.',
    duration: 2500,
    activeModules: ['scoreLabCore', 'apiGateway', 'externalClient'],
    connections: [['scoreLabCore', 'apiGateway'], ['apiGateway', 'externalClient']],
    latency: 15,
    cost: 0.0001,
  },
  {
    title: 'Registro para Auditoria e Compliance',
    description: 'Um evento é publicado via Eventarc para registro imutável no Firestore.',
    duration: 3500,
    activeModules: ['scoreLabCore', 'eventarc', 'firestore'],
    connections: [['scoreLabCore', 'eventarc'], ['eventarc', 'firestore']],
    latency: 0,
    cost: 0.0002,
  },
];
