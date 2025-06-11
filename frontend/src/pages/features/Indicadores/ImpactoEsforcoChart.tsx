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

interface ImpactoEsforcoChartProps {
  osList: OrdemServicoIndicadores[];
}

interface ProcessedImpactoEsforcoData {
  id: string; // OS.id
  identificacaoOs: string; // OS.identificacao.identificacao
  impact: number; // gutScore
  effort: number; // udp
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedImpactoEsforcoData;
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p><strong>OS:</strong> {data.identificacaoOs} (ID: {data.id})</p>
        <p><strong>Impacto (GUT Score):</strong> {data.impact.toFixed(0)}</p>
        <p><strong>Esforço (UDP):</strong> {data.effort.toFixed(0)}</p>
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
          // Skip if G, U, T are not within 1-5 range or effort is not positive
          return;
        }

        const impactValue = gravidade * urgencia * tendencia;

        if (impactValue > 0) { // Ensure impact is also positive
            data.push({
                id: os.id ?? '',
                identificacaoOs: os.identificacao?.numeroOS || 'N/A',
                impact: impactValue,
                effort: effortValue,
            });
        }
      }
    });
    return data;
  }, [osList]);

  if (!processedData || processedData.length === 0) {
    return <p>Não há dados suficientes para exibir a Matriz Impacto x Esforço.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 30, // Adjusted for potential label overlap
          bottom: 30, // Adjusted for XAxis label
          left: 30,  // Adjusted for YAxis label
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="effort"
          name="Esforço (UDP)"
          domain={[0, 200]}
          ticks={[0, 25, 50, 75, 100, 125, 150, 175, 200]} // Example ticks
        >
          <Label value="Esforço (UDP)" offset={-20} position="insideBottom" />
        </XAxis>
        <YAxis
          type="number"
          dataKey="impact"
          name="Impacto (GUT Score)"
          domain={[0, 125]}
          ticks={[0, 25, 50, 75, 100, 125]} // Example ticks
        >
          <Label value="Impacto (GUT Score)" angle={-90} offset={-10} position="insideLeft" />
        </YAxis>
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36}/>
        <ReferenceLine x={100} stroke="grey" strokeDasharray="3 3" />
        <ReferenceLine y={62.5} stroke="grey" strokeDasharray="3 3" />
        <Scatter name="Ordens de Serviço" data={processedData} fill="#82ca9d" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ImpactoEsforcoChart;
