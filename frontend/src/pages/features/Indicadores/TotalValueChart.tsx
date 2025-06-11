// src/pages/features/Indicadores/TotalValueChart.tsx
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyTotalValueData } from './dataProcessing'; // Assuming this interface is defined in dataProcessing.ts

interface TotalValueChartProps {
  data: MonthlyTotalValueData[];
  title?: string;
}

const TotalValueChart: React.FC<TotalValueChartProps> = ({
  data,
  title = 'Valor Total Consumido por Mês',
}) => {
  const theme = useTheme();

  // Helper function to format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20, // Adjusted for currency formatting
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalValue"
                name="Valor Total Consumido"
                stroke={theme.palette.info.main} // Using a different theme color
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalValueChart;
