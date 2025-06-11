// frontend/src/pages/features/Indicadores/MonthlyKPIChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface MonthlyChartDataPoint {
  mes: string;
  value?: number; // Value can be undefined if data is missing for a month
}

interface MonthlyKPIChartProps {
  data: MonthlyChartDataPoint[];
  title: string;
  lineName: string;
  lineColor: string;
  yAxisUnit: string;
}

const CustomTooltipContent: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataName = payload[0].name || '';
    const value = payload[0].value;
    // Ensure value is a number before calling toFixed
    const displayValue = typeof value === 'number' ? value.toFixed(dataName.toLowerCase().includes("score") ? 2 : 0) : 'N/A';

    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Mês: {label}</p>
        <p style={{ margin: '4px 0 0 0', color: payload[0].color }}>
          <strong>{dataName}:</strong> {displayValue}
        </p>
      </div>
    );
  }
  return null;
};


const MonthlyKPIChart: React.FC<MonthlyKPIChartProps> = ({
  data,
  title,
  lineName,
  lineColor,
  yAxisUnit,
}) => {
  // Filter out data points where value is undefined for cleaner charting if many leading/trailing undefineds.
  // Recharts can handle sporadic undefined values by creating breaks in the line.
  // However, if all values are undefined, or too many, it might be better to show a message.
  const hasData = data.some(d => d.value !== undefined);

  if (!hasData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <Typography>Não há dados suficientes para este gráfico.</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
              <YAxis unit={yAxisUnit} domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="value"
                name={lineName}
                stroke={lineColor}
                strokeWidth={2}
                connectNulls={false} // Show breaks for undefined data points
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthlyKPIChart;
