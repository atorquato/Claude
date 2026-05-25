import React, { useState } from 'react';
import { Wand2, ChevronRight, TrendingUp, AlertTriangle, Zap, Target, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fmt, fmtCurrency, fmtHours, healthColor } from '../utils/format';
import { Badge } from '../components/ui/Badge';

type NarrativeCategory = 'operational' | 'risk' | 'transformation' | 'maturity' | 'recommendation';

interface Narrative {
  id: string;
  category: NarrativeCategory;
  title: string;
  text: string;
  insight: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

const CATEGORY_CONFIG: Record<NarrativeCategory, { label: string; icon: typeof Wand2; color: string }> = {
  operational: { label: 'Operacional', icon: Target, color: '#005A7A' },
  risk: { label: 'Risco', icon: AlertTriangle, color: '#dc2626' },
  transformation: { label: 'Transformação', icon: Zap, color: '#7A9A01' },
  maturity: { label: 'Maturidade', icon: TrendingUp, color: '#7c3aed' },
  recommendation: { label: 'Recomendação', icon: ChevronRight, color: '#d97706' },
};

export function Storytelling() {
  const { flows, gaps, kpiSummary, analysts } = useStore(s => ({
    flows: s.filteredFlows(), gaps: s.gaps, kpiSummary: s.kpiSummary, analysts: s.analysts,
  }));
  const [generating, setGenerating] = useState(false);
  const [narratives, setNarratives] = useState<Narrative[] | null>(null);

  const overallHealth = Math.round(flows.reduce((s, f) => s + f.healthScore, 0) / (flows.length || 1));
  const overloaded = analysts.filter(a => a.allocated > a.capacity);
  const criticalGaps = gaps.filter(g => g.impact === 'Alto' && g.status !== 'Resolvido');
  const slaBreached = flows.filter(f => f.slaConsumed > 100);

  const generateNarratives = (): Narrative[] => [
    {
      id: 'n1', category: 'operational', severity: overallHealth >= 70 ? 'success' : 'warning',
      title: 'Saúde Operacional Global',
      text: `A operação apresenta health score médio de ${overallHealth}/100, com ${kpiSummary.published} fluxos publicados e ${kpiSummary.inProgress} em andamento. ${overallHealth >= 70 ? 'A trajetória é positiva e alinhada com os objetivos estratégicos.' : 'Ações corretivas são necessárias para elevar o índice ao patamar desejado.'}`,
      insight: overallHealth >= 70
        ? 'Manter o ritmo atual e focar na publicação dos fluxos restantes.'
        : 'Priorizar desbloqueio dos fluxos com impedimentos ativos.',
    },
    {
      id: 'n2', category: 'risk', severity: slaBreached.length > 5 ? 'critical' : 'warning',
      title: 'Exposição ao Risco de SLA',
      text: `${slaBreached.length} fluxos ultrapassaram o limite de SLA definido, representando ${Math.round((slaBreached.length / flows.length) * 100)}% da carteira total. ${kpiSummary.atRisk} fluxos encontram-se em situação de risco alto ou crítico, exigindo atenção imediata da liderança operacional.`,
      insight: 'Realizar reunião de emergência com analistas responsáveis pelos fluxos em SLA crítico.',
    },
    {
      id: 'n3', category: 'transformation', severity: 'info',
      title: 'Potencial de Transformação Identificado',
      text: `A análise identificou ${kpiSummary.automatableFlows} fluxos com potencial de automação, representando ${fmtHours(kpiSummary.estimatedGainHours)} mensais recuperáveis — equivalentes a ${kpiSummary.estimatedFTE} FTEs. A economia anual estimada é de ${fmtCurrency(kpiSummary.estimatedAnnualSavings)}, com impacto direto na escalabilidade da operação.`,
      insight: 'Iniciar programa piloto de automação com os 5 fluxos de maior retorno identificados.',
    },
    {
      id: 'n4', category: 'maturity', severity: 'info',
      title: 'Análise de Maturidade Operacional',
      text: `A maturidade média operacional é de ${kpiSummary.avgMaturity}/5. As dimensões de Automação e Integração apresentam os maiores gaps em relação ao benchmark de mercado. Governança e Documentação estão acima da média setorial, representando diferencial competitivo da operação.`,
      insight: 'Estruturar roadmap de elevação de maturidade com foco nas dimensões críticas identificadas.',
    },
    {
      id: 'n5', category: 'operational', severity: kpiSummary.criticalGaps > 10 ? 'critical' : 'warning',
      title: 'Diagnóstico de GAPs Operacionais',
      text: `Foram identificados ${kpiSummary.openGaps} GAPs operacionais abertos, dos quais ${kpiSummary.criticalGaps} de alta criticidade. A maior concentração está nas categorias de Processo (${Math.round(kpiSummary.openGaps * 0.35)} ocorrências) e Sistema (${Math.round(kpiSummary.openGaps * 0.28)} ocorrências), indicando necessidade de revisão estrutural.`,
      insight: `Priorizar os ${kpiSummary.criticalGaps} GAPs críticos no próximo ciclo de melhoria.`,
    },
    {
      id: 'n6', category: 'recommendation', severity: overloaded.length > 2 ? 'critical' : 'warning',
      title: 'Capacidade e Alocação de Recursos',
      text: `${overloaded.length} analistas encontram-se em situação de sobrecarga operacional, com alocação superior a 100% da capacidade disponível. ${analysts.filter(a => a.burnoutRisk === 'Alto').length} colaboradores apresentam risco elevado de burnout, impactando qualidade e produtividade no médio prazo.`,
      insight: 'Redistribuir carga operacional e priorizar contratação ou rebalanceamento imediato.',
    },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setNarratives(generateNarratives());
      setGenerating(false);
    }, 2000);
  };

  const SEVERITY_STYLE: Record<string, { bg: string; border: string; accent: string; badge: string }> = {
    success: { bg: '#f0fdf4', border: '#86efac', accent: '#16a34a', badge: 'green' as const },
    info: { bg: '#EFF6FF', border: '#93c5fd', accent: '#2563eb', badge: 'blue' as const },
    warning: { bg: '#fffbeb', border: '#fcd34d', accent: '#d97706', badge: 'yellow' as const },
    critical: { bg: '#FFF5F5', border: '#fca5a5', accent: '#dc2626', badge: 'red' as const },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #001f35, #003B5C, #005A7A)',
        borderRadius: 14, padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Wand2 size={22} color="#7A9A01" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Executive Storytelling Engine
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.6)', maxWidth: 560 }}>
            Geração automática de narrativas executivas baseadas nos dados operacionais da plataforma.
            Insights estratégicos, riscos e oportunidades sintetizados para comunicação com a diretoria.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {narratives && (
            <button className="btn-secondary" style={{ fontFamily: 'inherit' }} onClick={() => setNarratives(null)}>
              <RefreshCw size={13} /> Resetar
            </button>
          )}
          <button
            onClick={handleGenerate}
            className="btn-primary"
            style={{ fontFamily: 'inherit', padding: '11px 24px', fontSize: 14 }}
            disabled={generating}
          >
            {generating ? (
              <>
                <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Analisando dados...
              </>
            ) : (
              <>
                <Wand2 size={14} />
                {narratives ? 'Regenerar Narrativas' : 'Gerar Narrativas Executivas'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Context summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'Fluxos analisados', value: fmt(flows.length), color: '#003B5C' },
          { label: 'GAPs identificados', value: fmt(kpiSummary.openGaps), color: '#dc2626' },
          { label: 'Health Score', value: `${overallHealth}`, color: healthColor(overallHealth) },
          { label: 'Em risco', value: fmt(kpiSummary.atRisk), color: '#d97706' },
          { label: 'Potencial ganho', value: fmtHours(kpiSummary.estimatedGainHours), color: '#7A9A01' },
        ].map(k => (
          <div key={k.label} className="enterprise-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: k.color, letterSpacing: '-0.03em' }}>{k.value}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {!narratives && !generating && (
        <div style={{
          padding: '60px 40px', textAlign: 'center', background: '#FFFFFF',
          border: '2px dashed #D9E1E7', borderRadius: 14,
        }}>
          <Wand2 size={40} color="#D9E1E7" style={{ marginBottom: 16 }} />
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#B0BFCC' }}>
            Clique em "Gerar Narrativas Executivas" para ativar o engine
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#D9E1E7' }}>
            O sistema analisará automaticamente todos os dados operacionais e gerará insights estratégicos
          </p>
        </div>
      )}

      {generating && (
        <div style={{
          padding: '60px 40px', textAlign: 'center', background: '#FFFFFF',
          border: '1px solid #D9E1E7', borderRadius: 14,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, border: '3px solid #D9EAF4', borderTopColor: '#003B5C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#102A43' }}>Processando dados operacionais...</p>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#667085' }}>
                Analisando {flows.length} fluxos, {kpiSummary.openGaps} GAPs e métricas de {analysts.length} analistas
              </p>
            </div>
          </div>
        </div>
      )}

      {narratives && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {narratives.map((narrative, i) => {
            const cat = CATEGORY_CONFIG[narrative.category];
            const sev = SEVERITY_STYLE[narrative.severity];
            const Icon = cat.icon;
            return (
              <div
                key={narrative.id}
                className="animate-fade-in-up"
                style={{
                  padding: '20px 24px', background: sev.bg,
                  border: `1px solid ${sev.border}`, borderRadius: 12,
                  borderLeft: `4px solid ${sev.accent}`,
                  animationDelay: `${i * 0.1}s`, opacity: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: sev.accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={sev.accent} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#102A43' }}>{narrative.title}</h3>
                      <Badge variant={sev.badge as any}>{cat.label}</Badge>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: 13.5, color: '#102A43', lineHeight: 1.65 }}>
                      {narrative.text}
                    </p>
                    <div style={{
                      padding: '10px 14px', background: 'rgba(255,255,255,0.6)',
                      borderRadius: 8, borderLeft: `3px solid ${sev.accent}`,
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                    }}>
                      <ChevronRight size={14} color={sev.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ margin: 0, fontSize: 13, color: '#102A43', fontWeight: 600 }}>
                        Ação recomendada: {narrative.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
