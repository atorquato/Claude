export const FRONTS = [
  'SAC', 'Crédito', 'Cadastro', 'Fiscal', 'Financeiro',
  'Pricing', 'Comercial', 'Supply Chain', 'Atendimento',
  'Backoffice', 'Inteligência de Mercado', 'Operações', 'RH', 'Planejamento'
];

export const AREAS = [
  'Operações', 'Financeiro', 'Comercial', 'TI', 'RH',
  'Jurídico', 'Compliance', 'Auditoria', 'Estratégia', 'Planejamento'
];

export const ANALYSTS = [
  'Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Diego Ferreira',
  'Elena Santos', 'Fábio Costa', 'Gabriela Oliveira', 'Henrique Alves'
];

export const MANAGERS = [
  'Diretora Operacional', 'VP Financeiro', 'Gerente SAC',
  'Head de Transformação', 'COO', 'CFO'
];

export type FlowStatus =
  | 'Não iniciado'
  | 'Em levantamento'
  | 'Em mapeamento'
  | 'Em validação operacional'
  | 'Em validação gestão'
  | 'Ajustes solicitados'
  | 'Aprovado'
  | 'Publicado';

export type Criticality = 'Alta' | 'Média' | 'Baixa';
export type GapType = 'Processo' | 'Sistema' | 'Pessoas' | 'Governança' | 'Dados';
export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export interface Flow {
  id: string;
  name: string;
  front: string;
  area: string;
  process: string;
  analyst: string;
  manager: string;
  status: FlowStatus;
  criticality: Criticality;
  startDate: string;
  expectedDate: string;
  completedDate?: string;
  plannedHours: number;
  realizedHours: number;
  progress: number;
  sla: number;
  slaConsumed: number;
  aging: number;
  manualHours: number;
  automatable: boolean;
  rework: number;
  gaps: Gap[];
  maturity: MaturityLevel;
  healthScore: number;
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  impediments: string[];
  comments: string;
}

export interface Gap {
  id: string;
  flowId: string;
  type: GapType;
  description: string;
  impact: 'Alto' | 'Médio' | 'Baixo';
  rootCause: string;
  recommendation: string;
  estimatedGain: number;
  status: 'Aberto' | 'Em análise' | 'Resolvido';
  criticality: Criticality;
}

export interface Analyst {
  id: string;
  name: string;
  role: string;
  front: string;
  area: string;
  capacity: number;
  allocated: number;
  flows: number;
  efficiency: number;
  burnoutRisk: 'Baixo' | 'Médio' | 'Alto';
}

const STATUSES: FlowStatus[] = [
  'Não iniciado', 'Em levantamento', 'Em mapeamento',
  'Em validação operacional', 'Em validação gestão',
  'Ajustes solicitados', 'Aprovado', 'Publicado'
];

const PROCESSES = [
  'Abertura de chamado', 'Validação de crédito', 'Cadastro de cliente',
  'Apuração fiscal', 'Conciliação bancária', 'Formação de preço',
  'Proposta comercial', 'Gestão de estoque', 'Atendimento nível 1',
  'Processamento de pedidos', 'Análise de mercado', 'Controle operacional',
  'Recrutamento e seleção', 'Planejamento estratégico', 'Onboarding cliente',
  'Cobrança e recuperação', 'Auditoria interna', 'Gestão de contratos',
  'Aprovação de limites', 'Despacho logístico'
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addDays(base: string, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const flows: Flow[] = Array.from({ length: 48 }, (_, i) => {
  const status = randItem(STATUSES);
  const progress = status === 'Publicado' ? 100
    : status === 'Aprovado' ? rand(90, 100)
    : status === 'Ajustes solicitados' ? rand(60, 80)
    : status === 'Em validação gestão' ? rand(75, 95)
    : status === 'Em validação operacional' ? rand(55, 80)
    : status === 'Em mapeamento' ? rand(30, 60)
    : status === 'Em levantamento' ? rand(5, 30)
    : 0;
  const planned = rand(20, 120);
  const realized = Math.round(planned * (progress / 100) * (0.8 + Math.random() * 0.5));
  const sla = rand(14, 45);
  const slaConsumed = rand(20, 110);
  const front = randItem(FRONTS);
  const aging = rand(1, 90);
  const rework = rand(0, 35);
  const criticality: Criticality = randItem(['Alta', 'Média', 'Baixa'] as Criticality[]);
  const maturity = rand(1, 5) as MaturityLevel;
  const healthScore = Math.max(10, Math.min(100,
    (progress * 0.4) +
    (100 - Math.min(100, slaConsumed)) * 0.3 +
    (100 - rework) * 0.3
  ));

  return {
    id: `F${String(i + 1).padStart(3, '0')}`,
    name: `${randItem(PROCESSES)}`,
    front,
    area: randItem(AREAS),
    process: randItem(PROCESSES),
    analyst: randItem(ANALYSTS),
    manager: randItem(MANAGERS),
    status,
    criticality,
    startDate: addDays('2025-01-15', rand(0, 60)),
    expectedDate: addDays('2025-03-01', rand(0, 90)),
    completedDate: ['Aprovado', 'Publicado'].includes(status) ? addDays('2025-04-01', rand(0, 30)) : undefined,
    plannedHours: planned,
    realizedHours: realized,
    progress,
    sla,
    slaConsumed,
    aging,
    manualHours: Math.round(planned * rand(40, 90) / 100),
    automatable: Math.random() > 0.4,
    rework,
    gaps: [],
    maturity,
    healthScore: Math.round(healthScore),
    riskLevel: slaConsumed > 100 || criticality === 'Alta' ? 'Crítico'
      : slaConsumed > 80 || aging > 60 ? 'Alto'
      : slaConsumed > 60 ? 'Médio' : 'Baixo',
    impediments: Math.random() > 0.6 ? [
      randItem([
        'Aguardando validação da área', 'Sistema indisponível',
        'Responsável em férias', 'Dados incompletos',
        'Aprovação pendente do gestor', 'Integração não disponível'
      ])
    ] : [],
    comments: '',
  };
});

const GAP_DESCRIPTIONS: Record<GapType, string[]> = {
  Processo: [
    'Ausência de procedimento documentado para exceções',
    'Fluxo de aprovação com múltiplas etapas manuais',
    'Retrabalho por falta de padronização',
    'SLA não definido para atividades críticas',
  ],
  Sistema: [
    'Ausência de integração entre sistemas legados',
    'Dupla entrada de dados em plataformas distintas',
    'Relatórios extraídos manualmente do ERP',
    'Sistema sem API disponível para automação',
  ],
  Pessoas: [
    'Ausência de treinamento formal para a equipe',
    'Concentração de conhecimento em único colaborador',
    'Alta rotatividade impactando continuidade operacional',
    'Perfil não aderente às atividades executadas',
  ],
  Governança: [
    'Ausência de política formal de aprovação',
    'Falta de alçada definida para decisões operacionais',
    'Controles internos inexistentes para atividade crítica',
    'Processo sem responsável formal definido',
  ],
  Dados: [
    'Dados não estruturados para análise gerencial',
    'Ausência de indicadores operacionais monitorados',
    'Base de dados desatualizada impactando decisões',
    'Inconsistência entre bases de diferentes áreas',
  ],
};

export const gaps: Gap[] = flows.flatMap((flow, fi) =>
  Array.from({ length: rand(1, 4) }, (_, gi) => {
    const type: GapType = randItem(['Processo', 'Sistema', 'Pessoas', 'Governança', 'Dados'] as GapType[]);
    return {
      id: `G${String(fi + 1).padStart(3, '0')}-${gi + 1}`,
      flowId: flow.id,
      type,
      description: randItem(GAP_DESCRIPTIONS[type]),
      impact: randItem(['Alto', 'Médio', 'Baixo']) as 'Alto' | 'Médio' | 'Baixo',
      rootCause: randItem([
        'Crescimento acelerado sem revisão de processos',
        'Legado tecnológico limitando evolução',
        'Ausência de governança operacional',
        'Falta de investimento em capacitação',
        'Integração incompleta de sistemas adquiridos',
      ]),
      recommendation: randItem([
        'Estruturar procedimento operacional padrão',
        'Implementar integração via API',
        'Promover capacitação técnica da equipe',
        'Definir política de governança e alçadas',
        'Criar dashboard de monitoramento em tempo real',
      ]),
      estimatedGain: rand(5, 60),
      status: randItem(['Aberto', 'Em análise', 'Resolvido']) as 'Aberto' | 'Em análise' | 'Resolvido',
      criticality: flow.criticality,
    };
  })
);

flows.forEach(flow => {
  flow.gaps = gaps.filter(g => g.flowId === flow.id);
});

export const analysts: Analyst[] = ANALYSTS.map((name, i) => ({
  id: `A${i + 1}`,
  name,
  role: randItem(['Analista Sênior', 'Analista Pleno', 'Especialista', 'Consultor']),
  front: randItem(FRONTS),
  area: randItem(AREAS),
  capacity: 160,
  allocated: rand(80, 190),
  flows: rand(3, 12),
  efficiency: rand(62, 98),
  burnoutRisk: rand(0, 100) > 70 ? 'Alto' : rand(0, 100) > 40 ? 'Médio' : 'Baixo',
}));

export const kpiSummary = {
  totalFlows: flows.length,
  published: flows.filter(f => f.status === 'Publicado').length,
  approved: flows.filter(f => f.status === 'Aprovado').length,
  inProgress: flows.filter(f => !['Publicado', 'Aprovado', 'Não iniciado'].includes(f.status)).length,
  notStarted: flows.filter(f => f.status === 'Não iniciado').length,
  atRisk: flows.filter(f => ['Alto', 'Crítico'].includes(f.riskLevel)).length,
  totalHoursPlanned: flows.reduce((s, f) => s + f.plannedHours, 0),
  totalHoursRealized: flows.reduce((s, f) => s + f.realizedHours, 0),
  totalManualHours: flows.reduce((s, f) => s + f.manualHours, 0),
  automatableFlows: flows.filter(f => f.automatable).length,
  avgProgress: Math.round(flows.reduce((s, f) => s + f.progress, 0) / flows.length),
  avgHealthScore: Math.round(flows.reduce((s, f) => s + f.healthScore, 0) / flows.length),
  totalGaps: gaps.length,
  openGaps: gaps.filter(g => g.status === 'Aberto').length,
  criticalGaps: gaps.filter(g => g.criticality === 'Alta' && g.status === 'Aberto').length,
  estimatedGainHours: flows.filter(f => f.automatable).reduce((s, f) => s + f.manualHours, 0),
  estimatedFTE: +(flows.filter(f => f.automatable).reduce((s, f) => s + f.manualHours, 0) / 160).toFixed(1),
  estimatedAnnualSavings: flows.filter(f => f.automatable).reduce((s, f) => s + f.manualHours, 0) * 85 * 12,
  avgRework: Math.round(flows.reduce((s, f) => s + f.rework, 0) / flows.length),
  slaBreaches: flows.filter(f => f.slaConsumed > 100).length,
  avgMaturity: +(flows.reduce((s, f) => s + f.maturity, 0) / flows.length).toFixed(1),
};

export const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i],
  published: rand(2, 8),
  inProgress: rand(5, 18),
  gaps: rand(8, 25),
  efficiency: rand(60, 95),
  hoursPlanned: rand(200, 600),
  hoursRealized: rand(150, 550),
}));

export const frontDistribution = FRONTS.slice(0, 10).map(front => ({
  front,
  flows: flows.filter(f => f.front === front).length,
  gaps: gaps.filter(g => flows.find(f => f.id === g.flowId)?.front === front).length,
  published: flows.filter(f => f.front === front && f.status === 'Publicado').length,
  efficiency: rand(55, 95),
  maturity: rand(2, 5),
}));

export const maturityRadar = [
  { subject: 'Documentação', value: rand(50, 90), fullMark: 100 },
  { subject: 'Automação', value: rand(20, 70), fullMark: 100 },
  { subject: 'Governança', value: rand(40, 85), fullMark: 100 },
  { subject: 'Indicadores', value: rand(30, 80), fullMark: 100 },
  { subject: 'Integração', value: rand(25, 75), fullMark: 100 },
  { subject: 'Capacitação', value: rand(45, 90), fullMark: 100 },
];
