// src/pages/features/Indicadores/AccumulatedProgressChart.tsx
import { Box, Card, CardContent, Typography, LinearProgress, Grid, styled } from '@mui/material';
import type { AccumulatedProgressData } from './dataProcessing'; // Assuming this interface is defined

interface AccumulatedProgressChartProps {
  data: AccumulatedProgressData | null;
  title?: string;
  valueType?: 'quantity' | 'value'; // To distinguish between quantity and monetary value
}

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
}));

const ProgressItem: React.FC<{
  label: string;
  consumed: number;
  total: number;
  percentage: number;
  remaining: number;
  valueType: 'quantity' | 'value';
}> = ({ label, consumed, total, percentage, remaining, valueType }) => {
  const formatValue = (val: number) =>
    valueType === 'value'
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
      : val.toLocaleString('pt-BR');

  return (
    <Box mb={2}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <StyledLinearProgress variant="determinate" value={percentage} />
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="caption" color="textSecondary">
            Consumido: {formatValue(consumed)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption" color="textSecondary">
            Restante: {formatValue(remaining)} / {formatValue(total)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const AccumulatedProgressChart: React.FC<AccumulatedProgressChartProps> = ({
  data,
  title = 'Progresso Acumulado por Item (Quantidade)',
  valueType = 'quantity',
}) => {
  if (!data) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Dados indisponíveis.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const items = [
    { key: 'item1', label: 'Item 1', data: data.item1 },
    { key: 'item2', label: 'Item 2', data: data.item2 },
    { key: 'item3', label: 'Item 3', data: data.item3 },
  ];

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        {items.map((item) => (
          <ProgressItem
            key={item.key}
            label={item.label}
            consumed={item.data.consumed}
            total={item.data.total}
            percentage={item.data.percentage}
            remaining={item.data.remaining}
            valueType={valueType}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AccumulatedProgressChart;
