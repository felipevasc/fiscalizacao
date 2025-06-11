// frontend/src/pages/features/Indicadores/ImpactoEsforcoChart.tsx
import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ReferenceLine,
  type TooltipProps,
} from 'recharts';
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico';

const IMPACT_EFFORT_COLORS = {
  prioritize: '#388e3c',      // Green: High Impact, Low Effort
  majorProjects: '#1976d2', // Blue: High Impact, High Effort
  quickWins: '#afb42b',    // Yellow-Green: Low Impact, Low Effort
  deprioritize: '#f57c00', // Orange: Low Impact, High Effort
};

const IMPACT_MID_POINT = 62.5;
const EFFORT_MID_POINT = 100;

interface ImpactoEsforcoChartProps {
  osList: OrdemServicoIndicadores[];
}

interface ProcessedImpactoEsforcoData {
  id: string;
  identificacaoOs: string;
  impact: number;
  effort: number;
  quadrant: string;
  color: string;
}

const CustomTooltipImpactEffort: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedImpactoEsforcoData;
    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, color: '#333' }}><strong>OS:</strong> {data.identificacaoOs} (ID: {data.id})</p>
        <p style={{ margin: '4px 0 0 0', color: data.color }}><strong>{data.quadrant}</strong></p>
        <p style={{ margin: '4px 0 0 0' }}>Impacto (GUT Score): {data.impact.toFixed(0)}</p>
        <p style={{ margin: '4px 0 0 0' }}>Esforço (UDP): {data.effort.toFixed(0)}</p>
      </div>
    );
  }
  return null;
};

const ImpactoEsforcoChart: React.FC<ImpactoEsforcoChartProps> = ({ osList }) => {
  const processedData = useMemo(() => {
    const data: ProcessedImpactoEsforcoData[] = [];
    osList.forEach(os => {
      const g = os.gravidade;
      const u = os.urgencia;
      const t = os.tendencia;
      const udp = os.udp;

      if (
        g && u && t && udp !== undefined && udp !== null &&
        !isNaN(Number(g)) && !isNaN(Number(u)) && !isNaN(Number(t)) && !isNaN(Number(udp))
      ) {
        const gravidade = Number(g);
        const urgencia = Number(u);
        const tendencia = Number(t);
        const effortValue = Number(udp);

        if (gravidade < 1 || gravidade > 5 || urgencia < 1 || urgencia > 5 || tendencia < 1 || tendencia > 5 || effortValue <= 0) {
          return;
        }

        const impactValue = gravidade * urgencia * tendencia;

        if (impactValue > 0) {
          let quadrant = '';
          let color = '';

          if (impactValue > IMPACT_MID_POINT && effortValue <= EFFORT_MID_POINT) {
            quadrant = 'Priorizar (Alto Impacto, Baixo Esforço)';
            color = IMPACT_EFFORT_COLORS.prioritize;
          } else if (impactValue > IMPACT_MID_POINT && effortValue > EFFORT_MID_POINT) {
            quadrant = 'Grandes Projetos (Alto Impacto, Alto Esforço)';
            color = IMPACT_EFFORT_COLORS.majorProjects;
          } else if (impactValue <= IMPACT_MID_POINT && effortValue <= EFFORT_MID_POINT) {
            quadrant = 'Ganhos Rápidos (Baixo Impacto, Baixo Esforço)';
            color = IMPACT_EFFORT_COLORS.quickWins;
          } else { // Baixo Impacto, Alto Esforço
            quadrant = 'Despriorizar (Baixo Impacto, Alto Esforço)';
            color = IMPACT_EFFORT_COLORS.deprioritize;
          }

          data.push({
            id: os.id ?? `os-${Math.random()}`, // Ensure id is present
            identificacaoOs: os.identificacao?.numeroOS || 'N/A',
            impact: impactValue,
            effort: effortValue,
            quadrant,
            color,
          });
        }
      }
    });
    return data;
  }, [osList]);

  const q1Data = processedData.filter(d => d.color === IMPACT_EFFORT_COLORS.prioritize);
  const q2Data = processedData.filter(d => d.color === IMPACT_EFFORT_COLORS.majorProjects);
  const q3Data = processedData.filter(d => d.color === IMPACT_EFFORT_COLORS.quickWins);
  const q4Data = processedData.filter(d => d.color === IMPACT_EFFORT_COLORS.deprioritize);

  if (!processedData || processedData.length === 0) {
    return <p>Não há dados suficientes para exibir a Matriz Impacto x Esforço.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 30,
          bottom: 30,
          left: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="effort"
          name="Esforço (UDP)"
          domain={[0, 'dataMax + 20']} // Adjusted domain for better data visibility
          tick={{ fontSize: 10 }}
        >
          <Label value="Esforço (UDP)" offset={-20} position="insideBottom" fontSize={12} />
        </XAxis>
        <YAxis
          type="number"
          dataKey="impact"
          name="Impacto (GUT Score)"
          domain={[0, 'dataMax + 10']} // Adjusted domain for better data visibility
          tick={{ fontSize: 10 }}
        >
          <Label value="Impacto (GUT Score)" angle={-90} offset={-15} position="insideLeft" fontSize={12} />
        </YAxis>
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltipImpactEffort />} />
        <Legend verticalAlign="top" height={50} wrapperStyle={{ fontSize: '10px', whiteSpace: 'normal', overflow: 'visible' }} />
        <ReferenceLine x={EFFORT_MID_POINT} stroke="grey" strokeDasharray="3 3" />
        <ReferenceLine y={IMPACT_MID_POINT} stroke="grey" strokeDasharray="3 3" />
        <Scatter name="Priorizar" data={q1Data} fill={IMPACT_EFFORT_COLORS.prioritize} shape="circle" />
        <Scatter name="Grandes Projetos" data={q2Data} fill={IMPACT_EFFORT_COLORS.majorProjects} shape="circle" />
        <Scatter name="Ganhos Rápidos" data={q3Data} fill={IMPACT_EFFORT_COLORS.quickWins} shape="circle" />
        <Scatter name="Despriorizar" data={q4Data} fill={IMPACT_EFFORT_COLORS.deprioritize} shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ImpactoEsforcoChart;
