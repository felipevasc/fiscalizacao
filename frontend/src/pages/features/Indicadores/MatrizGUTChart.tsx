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
  osId?: string;
  gravidade: number;
  urgencia: number;
  tendencia: number;
  count: number;
  avgGutScore: number;
  color: string;
  originalData: OrdemServicoIndicadores[];
}

const CustomTooltipGUT: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedGUTData;
    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
        <h4 style={{ padding: 0, margin: 0}}>OS: {data.osId}</h4>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Impacto: {data.avgGutScore}</p>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Esforço: {data.count}</p>
        <p style={{ margin: '4px 0 0 0' }}>Tendência: {data.tendencia.toFixed(2)}</p>
        <p style={{ margin: '4px 0 0 0' }}>Gravidade: {data.gravidade.toFixed(2)}</p>
        <p style={{ margin: '4px 0 0 0' }}>Urgencia: {data.urgencia.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const MatrizGUTChart: React.FC<MatrizGUTChartProps> = ({ osList }) => {
  const processedData = useMemo(() => {
    if (!osList || osList.length === 0) {
      return [];
    }
    return osList.map(group => {
      const avgGutScore = group.gutScore ?? 0;
      let color = GUT_COLORS.low;
      if (avgGutScore > 80) {
        color = GUT_COLORS.high;
      } else if (avgGutScore > 40) {
        color = GUT_COLORS.medium;
      }
      return {
        gravidade: group.gravidade,
        urgencia: group.urgencia,
        tendencia: group.tendencia,
        count: group.itens.map(item => item.quantidade).reduce((a, b) => a + b, 0),
        avgGutScore: avgGutScore,
        color: color,
        originalData: group.itens,
        osId: group.identificacao.numeroOS,
      };
    });
  }, [osList]);

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
          dataKey="avgGutScore"
          name="Impacto"
          tick={{ fontSize: 10 }}
          label={{ value: "Impacto", position: "insideBottom", offset: -10, fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Esforço"
          tick={{ fontSize: 10 }}
          range={[0, 100]} // Adjust range as needed
          label={{ value: "Esforço", angle: -90, position: "insideLeft", fontSize: 12 }}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltipGUT />} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <ReferenceLine x={30} stroke="black" strokeDasharray="3 3" />
        <ReferenceLine y={40} stroke="black" strokeDasharray="3 3" />
        <Scatter name="Despriorizar" data={processedData.filter(d => d.avgGutScore > 30 && d.count > 40)} fill={GUT_COLORS.high} shape="circle" />
        <Scatter name="Complexo" data={processedData.filter(d => d.avgGutScore > 30 && d.count <= 40)} fill={GUT_COLORS.medium} shape="circle" />
        <Scatter name="Analisar" data={processedData.filter(d => d.avgGutScore <= 30 && d.count > 40)} fill={"blue"} shape="circle" />
        <Scatter name="Prioritário" data={processedData.filter(d => d.avgGutScore <= 30 && d.count <= 40)} fill={'green'} shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default MatrizGUTChart;
