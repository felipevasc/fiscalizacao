// frontend/src/pages/features/Indicadores/ConsumptionSummaryCards.tsx
import { Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';
import { type ConsumptionSummary } from './types';

interface ConsumptionSummaryCardsProps {
  data: ConsumptionSummary | null;
  title?: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const SummaryCard: React.FC<{ title: string; value: string | number; subValue?: string; progress?: number }> = ({ title, value, subValue, progress }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        {subValue && (
          <Typography variant="body2" color="textSecondary">
            {subValue}
          </Typography>
        )}
        {progress !== undefined && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: '4px' }} />
          </Box>
        )}
      </CardContent>
    </Card>
  </Grid>
);

const ConsumptionSummaryCards: React.FC<ConsumptionSummaryCardsProps> = ({ data, title = "Resumo Geral do Consumo" }) => {
  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <Typography variant="body1" align="center">Sem dados de resumo para exibir.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        <SummaryCard
          title="Total Geral Consumido (Valor)"
          value={formatCurrency(data.totalValueConsumed)}
        />

        <SummaryCard
          title="% Consumido Item 1 (Qtd)"
          value={`${data.item1ConsumedPercent.toFixed(2)}%`}
          progress={data.item1ConsumedPercent}
        />
        <SummaryCard
          title="% Consumido Item 2 (Qtd)"
          value={`${data.item2ConsumedPercent.toFixed(2)}%`}
          progress={data.item2ConsumedPercent}
        />
        <SummaryCard
          title="% Consumido Item 3 (Qtd)"
          value={`${data.item3ConsumedPercent.toFixed(2)}%`}
          progress={data.item3ConsumedPercent}
        />

        <SummaryCard
          title="Restante Item 1 (Qtd)"
          value={data.item1RemainingQuantity.toLocaleString('pt-BR')}
          subValue={`Valor: ${formatCurrency(data.item1RemainingValue)}`}
        />
        <SummaryCard
          title="Restante Item 2 (Qtd)"
          value={data.item2RemainingQuantity.toLocaleString('pt-BR')}
          subValue={`Valor: ${formatCurrency(data.item2RemainingValue)}`}
        />
        <SummaryCard
          title="Restante Item 3 (Qtd)"
          value={data.item3RemainingQuantity.toLocaleString('pt-BR')}
          subValue={`Valor: ${formatCurrency(data.item3RemainingValue)}`}
        />
      </Grid>
    </Box>
  );
};

export default ConsumptionSummaryCards;
