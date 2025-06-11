// frontend/src/pages/features/Indicadores/AccumulatedItemQuantityChart.tsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AccumulatedItemConsumption } from './types';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface AccumulatedItemQuantityChartProps {
  data: AccumulatedItemConsumption[];
  title?: string;
}

const AccumulatedItemQuantityChart: React.FC<AccumulatedItemQuantityChartProps> = ({ data, title = "Quantidade Consumida Acumulada por Item vs Total" }) => {
  if (!data || data.length === 0) {
    return (
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>{title}</Typography>
          <Typography variant="body1" align="center">Sem dados disponíveis para exibir o gráfico.</Typography>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    name: `Item ${item.item}`,
    Consumido: item.consumedQuantity,
    Total: item.totalQuantity,
  }));

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Consumido" fill="#8884d8" name="Quantidade Consumida" />
              <Bar dataKey="Total" fill="#82ca9d" name="Quantidade Total Contratada" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccumulatedItemQuantityChart;
