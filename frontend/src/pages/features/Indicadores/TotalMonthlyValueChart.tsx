// frontend/src/pages/features/Indicadores/TotalMonthlyValueChart.tsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { type TotalMonthlyConsumption } from './types';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface TotalMonthlyValueChartProps {
  data: TotalMonthlyConsumption[];
  title?: string;
}

const TotalMonthlyValueChart: React.FC<TotalMonthlyValueChartProps> = ({ data, title = "Valor Total Consumido por Mês" }) => {
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

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value)
                }
              />
              <Legend />
              <Line type="monotone" dataKey="totalValue" name="Valor Total Consumido" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalMonthlyValueChart;
