// frontend/src/pages/features/Indicadores/MatrizGUTChart.tsx
import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico';

interface MatrizGUTChartProps {
  osList: OrdemServicoIndicadores[];
}

interface ProcessedGUTData {
  gravidade: number;
  urgencia: number;
  count: number;
  avgTendencia: number;
  avgGutScore: number;
  originalData: OrdemServicoIndicadores[]; // Keep original OS for detailed tooltip if needed
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedGUTData;
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p><strong>Gravidade:</strong> {data.gravidade}</p>
        <p><strong>Urgência:</strong> {data.urgencia}</p>
        <p><strong>Quantidade OS:</strong> {data.count}</p>
        <p><strong>Tendência Média:</strong> {data.avgTendencia.toFixed(2)}</p>
        <p><strong>GUT Score Médio:</strong> {data.avgGutScore.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const MatrizGUTChart: React.FC<MatrizGUTChartProps> = ({ osList }) => {
  const processedData = useMemo(() => {
    const groupedData: Record<string, {
      sumTendencia: number;
      sumGutScore: number;
      count: number;
      items: OrdemServicoIndicadores[];
      gravidade: number;
      urgencia: number;
    }> = {};

    osList.forEach(os => {
      const g = os.gut?.gravidade;
      const u = os.gut?.urgencia;
      const t = os.gut?.tendencia;

      if (g && u && t && !isNaN(Number(g)) && !isNaN(Number(u)) && !isNaN(Number(t))) {
        const gravidade = Number(g);
        const urgencia = Number(u);
        const tendencia = Number(t);

        if (gravidade < 1 || gravidade > 5 || urgencia < 1 || urgencia > 5 || tendencia < 1 || tendencia > 5) {
            // Skip if G, U, T are not within 1-5 range
            return;
        }

        const gutScore = gravidade * urgencia * tendencia;
        const key = `${gravidade}-${urgencia}`;

        if (!groupedData[key]) {
          groupedData[key] = {
            sumTendencia: 0,
            sumGutScore: 0,
            count: 0,
            items: [],
            gravidade: gravidade,
            urgencia: urgencia,
          };
        }
        groupedData[key].sumTendencia += tendencia;
        groupedData[key].sumGutScore += gutScore;
        groupedData[key].count++;
        groupedData[key].items.push(os);
      }
    });

    return Object.values(groupedData).map(group => ({
      gravidade: group.gravidade,
      urgencia: group.urgencia,
      count: group.count,
      avgTendencia: group.count > 0 ? group.sumTendencia / group.count : 0,
      avgGutScore: group.count > 0 ? group.sumGutScore / group.count : 0,
      originalData: group.items,
    }));
  }, [osList]);

  if (!processedData || processedData.length === 0) {
    return <p>Não há dados suficientes para exibir a Matriz GUT.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="urgencia"
          name="Urgência"
          domain={[0.5, 5.5]} // Adjusted domain for better tick placement
          ticks={[1, 2, 3, 4, 5]}
          label={{ value: "Urgência", position: "insideBottom", offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="gravidade"
          name="Gravidade"
          domain={[0.5, 5.5]} // Adjusted domain for better tick placement
          ticks={[1, 2, 3, 4, 5]}
          label={{ value: "Gravidade", angle: -90, position: "insideLeft" }}
        />
        <ZAxis type="number" dataKey="count" range={[100, 1000]} name="Qtd OS" unit=" OS" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Legend />
        <Scatter name="OS por GxU" data={processedData} fill="#1976d2" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default MatrizGUTChart;
