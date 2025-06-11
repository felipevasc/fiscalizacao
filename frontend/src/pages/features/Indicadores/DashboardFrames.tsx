// src/pages/features/Indicadores/DashboardFrames.tsx
import { Card, CardContent, Typography, Grid, Box, Paper, useTheme, styled } from '@mui/material';
import type { DashboardFramesData } from './dataProcessing'; // Assuming this interface is defined

interface DashboardFramesProps {
  data: DashboardFramesData | null;
  title?: string;
}

const FramePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // Futuristic/Modern Styling
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[900]})`, // Darker gradient
  color: theme.palette.common.white, // White text for contrast
  borderRadius: '10px', // Rounded corners
  boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)', // Cyan glow effect
  border: `1px solid ${theme.palette.primary.light}`,
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem', // Larger font for main values
  color: theme.palette.primary.light, // Bright color for emphasis
  marginBottom: theme.spacing(0.5),
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.grey[400], // Lighter grey for labels
  textTransform: 'uppercase',
}));

const ItemDetail: React.FC<{ title: string; value: string | number; subValue?: string; color?: string }> = ({ title, value, subValue, color }) => (
  <Box my={1}>
    <LabelText>{title}</LabelText>
    <Typography variant="h6" component="p" sx={{ color: color || 'inherit', fontWeight: 'medium' }}>
      {value}
    </Typography>
    {subValue && <Typography variant="caption" display="block">{subValue}</Typography>}
  </Box>
);


const DashboardFrames: React.FC<DashboardFramesProps> = ({
  data,
  title = 'Resumo Geral do Contrato',
}) => {
  const theme = useTheme();

  if (!data) {
    return (
      <Card sx={{ mt: 3, backgroundColor: theme.palette.grey[800] }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.common.white }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
            Dados indisponíveis.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <Card sx={{ mt: 3, borderRadius: '12px', background: `linear-gradient(145deg, ${theme.palette.grey[800]}, ${theme.palette.grey[900]})`, boxShadow: theme.shadows[5] }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.common.white, textAlign: 'center', mb: 3 }}>
          {title}
        </Typography>
        <Grid container spacing={3}>
          {/* Total General Value Consumed */}
          <Grid item xs={12} sm={6} md={3}>
            <FramePaper elevation={3}>
              <LabelText>Valor Total Consumido</LabelText>
              <ValueText>{formatCurrency(data.totalGeneralValueConsumed)}</ValueText>
            </FramePaper>
          </Grid>

          {/* Overall Quantity Percentage by Item */}
          <Grid item xs={12} sm={6} md={3}>
            <FramePaper elevation={3}>
              <LabelText>Consumo Qtd. Itens</LabelText>
              <Box sx={{ width: '100%', textAlign: 'left', pl:1, pr:1 }}>
                 <ItemDetail title="Item 1" value={formatPercentage(data.overallQuantityPercentage.item1)} color={theme.palette.primary.light} />
                 <ItemDetail title="Item 2" value={formatPercentage(data.overallQuantityPercentage.item2)} color={theme.palette.secondary.light}/>
                 <ItemDetail title="Item 3" value={formatPercentage(data.overallQuantityPercentage.item3)} color={theme.palette.success.light}/>
              </Box>
            </FramePaper>
          </Grid>

          {/* Remaining Value by Item */}
          <Grid item xs={12} sm={6} md={3}>
            <FramePaper elevation={3}>
              <LabelText>Valor Restante</LabelText>
               <Box sx={{ width: '100%', textAlign: 'left', pl:1, pr:1 }}>
                <ItemDetail title="Item 1" value={formatCurrency(data.remainingValueByItem.item1)} color={theme.palette.primary.light}/>
                <ItemDetail title="Item 2" value={formatCurrency(data.remainingValueByItem.item2)} color={theme.palette.secondary.light} />
                <ItemDetail title="Item 3" value={formatCurrency(data.remainingValueByItem.item3)} color={theme.palette.success.light}/>
              </Box>
            </FramePaper>
          </Grid>

          {/* Remaining Quantity by Item */}
          <Grid item xs={12} sm={6} md={3}>
            <FramePaper elevation={3}>
              <LabelText>Qtd. Restante</LabelText>
              <Box sx={{ width: '100%', textAlign: 'left', pl:1, pr:1 }}>
                <ItemDetail title="Item 1" value={data.remainingQuantityByItem.item1.toLocaleString('pt-BR')} color={theme.palette.primary.light}/>
                <ItemDetail title="Item 2" value={data.remainingQuantityByItem.item2.toLocaleString('pt-BR')} color={theme.palette.secondary.light}/>
                <ItemDetail title="Item 3" value={data.remainingQuantityByItem.item3.toLocaleString('pt-BR')} color={theme.palette.success.light}/>
              </Box>
            </FramePaper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DashboardFrames;
