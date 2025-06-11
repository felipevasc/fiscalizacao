// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0054a6', light: '#e8f1f9' },
    secondary: { main: '#008837' },
    background: { default: '#f1f1f1', paper: '#ffffff' },
    text: { primary: '#333333', secondary: '#555555' },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
});


// src/DashboardFrames.tsx

import React from 'react';
import { Card, CardContent, Typography, Box, Paper, useTheme, styled } from '@mui/material';
// O componente Grid não é mais importado

// Interfaces e Ícones
export interface DashboardFramesData {
  totalGeneralValueConsumed: number;
  overallQuantityPercentage: { item1: number; item2: number; item3: number; };
  remainingValueByItem: { item1: number; item2: number; item3: number; };
  remainingQuantityByItem: { item1: number; item2: number; item3: number; };
}
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

interface DashboardFramesProps {
  data: DashboardFramesData | null;
  title?: string;
}

// Componentes Estilizados (sem alterações)
const FramePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.shape.borderRadius,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 56, height: 56, borderRadius: '50%',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold', fontSize: '2rem', color: theme.palette.text.primary,
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem', color: theme.palette.text.secondary,
  fontWeight: 500, marginBottom: theme.spacing(1.5),
}));

const ItemDetail: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" my={0.5}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="body1" component="p" sx={{ color: color || 'text.primary', fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Box>
);

// Componente Principal do Dashboard
const DashboardFrames: React.FC<DashboardFramesProps> = ({ data, title = 'Resumo Geral do Contrato' }) => {
  const theme = useTheme();

  if (!data) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 200px)">
        <Card sx={{ p: 3, maxWidth: 400, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography variant="body2" color="text.secondary">Dados indisponíveis no momento.</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const spacingValue = 3; // Define o espaçamento (24px)

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.background.default, p: { xs: 2, sm: 3 }, minHeight: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
        {title}
      </Typography>
      
      {/* NOVA ABORDAGEM: Container Flexbox Manual */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          // Margem negativa para compensar o padding dos filhos
          margin: theme.spacing(-spacingValue / 2) 
        }}
      >
        {/* Card 1: Envolvido em um Box com largura responsiva e padding */}
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: theme.spacing(spacingValue / 2) }}>
            <FramePaper>
                <Box><IconWrapper><MonetizationOnOutlinedIcon fontSize="large" /></IconWrapper><LabelText>Valor Total Consumido</LabelText></Box>
                <ValueText>{formatCurrency(data.totalGeneralValueConsumed)}</ValueText>
            </FramePaper>
        </Box>

        {/* Card 2 */}
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: theme.spacing(spacingValue / 2) }}>
            <FramePaper>
                <Box><IconWrapper><DonutLargeOutlinedIcon fontSize="large" /></IconWrapper><LabelText>Consumo Qtd. Itens (%)</LabelText></Box>
                <Box sx={{ width: '100%' }}><ItemDetail title="Item 1" value={formatPercentage(data.overallQuantityPercentage.item1)} color={theme.palette.primary.main} /><ItemDetail title="Item 2" value={formatPercentage(data.overallQuantityPercentage.item2)} color={theme.palette.secondary.main}/><ItemDetail title="Item 3" value={formatPercentage(data.overallQuantityPercentage.item3)} color="#f57c00" /></Box>
            </FramePaper>
        </Box>

        {/* Card 3 */}
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: theme.spacing(spacingValue / 2) }}>
            <FramePaper>
                <Box><IconWrapper><AccountBalanceWalletOutlinedIcon fontSize="large" /></IconWrapper><LabelText>Valor Restante por Item</LabelText></Box>
                <Box sx={{ width: '100%' }}><ItemDetail title="Item 1" value={formatCurrency(data.remainingValueByItem.item1)} color={theme.palette.primary.main}/><ItemDetail title="Item 2" value={formatCurrency(data.remainingValueByItem.item2)} color={theme.palette.secondary.main} /><ItemDetail title="Item 3" value={formatCurrency(data.remainingValueByItem.item3)} color="#f57c00"/></Box>
            </FramePaper>
        </Box>

        {/* Card 4 */}
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, padding: theme.spacing(spacingValue / 2) }}>
            <FramePaper>
                <Box><IconWrapper><Inventory2OutlinedIcon fontSize="large" /></IconWrapper><LabelText>Qtd. Restante por Item</LabelText></Box>
                <Box sx={{ width: '100%' }}><ItemDetail title="Item 1" value={data.remainingQuantityByItem.item1.toLocaleString('pt-BR')} color={theme.palette.primary.main}/><ItemDetail title="Item 2" value={data.remainingQuantityByItem.item2.toLocaleString('pt-BR')} color={theme.palette.secondary.main}/><ItemDetail title="Item 3" value={data.remainingQuantityByItem.item3.toLocaleString('pt-BR')} color="#f57c00"/></Box>
            </FramePaper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardFrames;