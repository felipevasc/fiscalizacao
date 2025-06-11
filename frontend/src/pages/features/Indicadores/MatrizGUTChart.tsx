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
  ReferenceLine,
  type TooltipProps,
} from 'recharts';
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico';

const GUT_COLORS = {
  high: '#d32f2f', // Red
  medium: '#fbc02d', // Yellow/Orange
  low: '#388e3c',   // Green
};

interface MatrizGUTChartProps {
  osList: OrdemServicoIndicadores[];
}

interface ProcessedGUTData {
  gravidade: number;
  urgencia: number;
  count: number;
  avgTendencia: number;
  avgGutScore: number;
  color: string;
  originalData: OrdemServicoIndicadores[];
}

const CustomTooltipGUT: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedGUTData;
    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Gravidade: {data.gravidade}, Urgência: {data.urgencia}</p>
        <p style={{ margin: '4px 0 0 0' }}>OS na Célula: {data.count}</p>
        <p style={{ margin: '4px 0 0 0' }}>Tendência Média: {data.avgTendencia.toFixed(2)}</p>
        <p style={{ margin: '4px 0 0 0', color: data.color }}>Score GUT Médio: {data.avgGutScore.toFixed(2)}</p>
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
      const g = os.gravidade;
      const u = os.urgencia;
      const t = os.tendencia;

      if (g && u && t && !isNaN(Number(g)) && !isNaN(Number(u)) && !isNaN(Number(t))) {
        const gravidade = Number(g);
        const urgencia = Number(u);
        const tendencia = Number(t);

        if (gravidade < 1 || gravidade > 5 || urgencia < 1 || urgencia > 5 || tendencia < 1 || tendencia > 5) {
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

    return Object.values(groupedData).map(group => {
      const avgGutScore = group.count > 0 ? group.sumGutScore / group.count : 0;
      let color = GUT_COLORS.low;
      if (avgGutScore > 80) {
        color = GUT_COLORS.high;
      } else if (avgGutScore > 40) {
        color = GUT_COLORS.medium;
      }
      return {
        gravidade: group.gravidade,
        urgencia: group.urgencia,
        count: group.count,
        avgTendencia: group.count > 0 ? group.sumTendencia / group.count : 0,
        avgGutScore: avgGutScore,
        color: color,
        originalData: group.items,
      };
    });
  }, [osList]);

  const lowGutData = processedData.filter(d => d.color === GUT_COLORS.low);
  const mediumGutData = processedData.filter(d => d.color === GUT_COLORS.medium);
  const highGutData = processedData.filter(d => d.color === GUT_COLORS.high);

  if (!processedData || processedData.length === 0) {
    return <p>Não há dados suficientes para exibir a Matriz GUT.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 30, // Increased right margin for legend
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="urgencia"
          name="Urgência"
          domain={[0.5, 5.5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 10 }}
          label={{ value: "Urgência", position: "insideBottom", offset: -10, fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey="gravidade"
          name="Gravidade"
          domain={[0.5, 5.5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 10 }}
          label={{ value: "Gravidade", angle: -90, position: "insideLeft", fontSize: 12 }}
        />
        <ZAxis type="number" dataKey="count" range={[60, 400]} name="Qtd OS" unit=" OS" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltipGUT />} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <ReferenceLine x={3.5} stroke="grey" strokeDasharray="3 3" />
        <ReferenceLine y={3.5} stroke="grey" strokeDasharray="3 3" />
        <Scatter name="GUT Alto (>80)" data={highGutData} fill={GUT_COLORS.high} shape="circle" />
        <Scatter name="GUT Médio (41-80)" data={mediumGutData} fill={GUT_COLORS.medium} shape="circle" />
        <Scatter name="GUT Baixo (1-40)" data={lowGutData} fill={GUT_COLORS.low} shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default MatrizGUTChart;
