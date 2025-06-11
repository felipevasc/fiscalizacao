// frontend/src/pages/features/Indicadores/AccumulatedItemValueChart.tsx
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
import { type AccumulatedItemConsumption } from './types';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface AccumulatedItemValueChartProps {
  data: AccumulatedItemConsumption[];
  title?: string;
}

const AccumulatedItemValueChart: React.FC<AccumulatedItemValueChartProps> = ({ data, title = "Valor Consumido Acumulado por Item vs Total" }) => {
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
    Consumido: item.consumedValue,
    Total: item.totalValue,
  }));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

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
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} />
              <Legend />
              <Bar dataKey="Consumido" fill="#8884d8" name="Valor Consumido" />
              <Bar dataKey="Total" fill="#82ca9d" name="Valor Total Contratado" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccumulatedItemValueChart;
