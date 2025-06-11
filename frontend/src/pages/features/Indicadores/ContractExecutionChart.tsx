// src/pages/features/Indicadores/ContractExecutionChart.tsx
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
import type { MonthlyExecutionData } from './dataProcessing'; // Assuming this interface is defined in dataProcessing.ts

interface ContractExecutionChartProps {
  data: MonthlyExecutionData[];
  title?: string;
}

const ContractExecutionChart: React.FC<ContractExecutionChartProps> = ({
  data,
  title = 'Execução do Contrato por Item (Quantidade Acumulada Mensal)',
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}> {/* Ensure Box takes available space */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="item1"
                name="Item 1"
                stroke={theme.palette.primary.main}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="item2"
                name="Item 2"
                stroke={theme.palette.secondary.main}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="item3"
                name="Item 3"
                stroke={theme.palette.success.main} // Or any other distinct color
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContractExecutionChart;
