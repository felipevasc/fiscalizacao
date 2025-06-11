// frontend/src/pages/features/Indicadores/MonthlyItemConsumptionChart.tsx
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
import { MonthlyItemConsumption } from './types';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MonthlyItemConsumptionChartProps {
  data: MonthlyItemConsumption[];
  title?: string;
}

const MonthlyItemConsumptionChart: React.FC<MonthlyItemConsumptionChartProps> = ({ data, title = "Execução do Contrato por Mês (Quantidade por Item)" }) => {
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="item1Quantity" name="Item 1" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="item2Quantity" name="Item 2" stroke="#82ca9d" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="item3Quantity" name="Item 3" stroke="#ffc658" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthlyItemConsumptionChart;
