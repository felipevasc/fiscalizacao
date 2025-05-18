// src/pages/Indicadores.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Divider,
} from '@mui/material';
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
import type { OrdemServico } from '../OrdemServico/types/OrdemServico';

// Estrutura de OS, estenda conforme necessidade
interface OrdemServicoIndicadores extends OrdemServico {
  dataConclusao?: string; // ISO date string
  disponibilidadePercentual?: number; // IDS (99.5%)
  satisfacaoPercentual?: number; // ISA (0–100%)
  tempoAcessoDias?: number; // IDA
  tempoRespostaHoras?: number; // IED
}

interface MonthlyData {
  mes: string;
  pctOnTime: number;
}

export default function Indicadores() {
  const [osList, setOsList] = useState<OrdemServicoIndicadores[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  // Carrega OS do localStorage
  useEffect(() => {
    const raw = localStorage.getItem('sistema_os') || '[]';
    try {
      const list = JSON.parse(raw) as OrdemServicoIndicadores[];
      setOsList(list);
    } catch {
      setOsList([]);
    }
  }, []);

  // Cálculos aglutinados
  const totalOS = osList.length;

  // On‐time: dataConclusao ≤ dataFimPrevista
  const onTimeCount = osList.filter((os) => {
    if (!os.dataConclusao || !os.cronograma.data_fim) return false;
    return new Date(os.dataConclusao) <= new Date(os.cronograma.data_inicio);
  }).length;
  const pctOnTime = totalOS ? Math.round((onTimeCount / totalOS) * 100) : 0;

  // IDS – Disponibilidade média (somente OS com esse campo)
  const availabilityVals = osList
    .map((os) => os.disponibilidadePercentual)
    .filter((v) => v !== undefined) as number[];
  const avgAvailability = availabilityVals.length
    ? Math.round(
        availabilityVals.reduce((a, b) => a + b, 0) / availabilityVals.length
      )
    : 0;

  // ISA – Satisfação média (somente OS de capacitação)
  const satVals = osList
    .map((os) => os.satisfacaoPercentual)
    .filter((v) => v !== undefined) as number[];
  const avgSatisfaction = satVals.length
    ? Math.round(satVals.reduce((a, b) => a + b, 0) / satVals.length)
    : 0;

  // IDA – Tempo médio de atendimento de acesso (dias)
  const acessoVals = osList
    .map((os) => os.tempoAcessoDias)
    .filter((v) => v !== undefined) as number[];
  const avgAcesso = acessoVals.length
    ? Math.round(acessoVals.reduce((a, b) => a + b, 0) / acessoVals.length)
    : undefined;

  // IED – Tempo médio de resposta (horas)
  const respostaVals = osList
    .map((os) => os.tempoRespostaHoras)
    .filter((v) => v !== undefined) as number[];
  const avgResposta = respostaVals.length
    ? Math.round(respostaVals.reduce((a, b) => a + b, 0) / respostaVals.length)
    : undefined;

  // Prepara dados mensais para linha de % on-time
  useEffect(() => {
    const mapMes: Record<string, { total: number; onTime: number }> = {};
    osList.forEach((os) => {
      const d = os.cronograma.data_fim || os.dataConclusao || '';
      if (!d) return;
      const dt = new Date(d);
      const key = `${dt.getFullYear()}/${(dt.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      if (!mapMes[key]) mapMes[key] = { total: 0, onTime: 0 };
      mapMes[key].total++;
      if (
        os.dataConclusao &&
        new Date(os.dataConclusao) <= new Date(os.cronograma.data_fim!)
      )
        mapMes[key].onTime++;
    });
    const arr = Object.entries(mapMes).map(([mes, { total, onTime }]) => ({
      mes,
      pctOnTime: total ? Math.round((onTime / total) * 100) : 0,
    }));
    arr.sort((a, b) => (a.mes > b.mes ? 1 : -1));
    setMonthlyData(arr);
  }, [osList]);

  return (
    <Box p={2}>
      <Typography variant='h4' gutterBottom>
        Dashboard de Indicadores Contratuais
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid>
          <Card>
            <CardContent>
              <Typography variant='subtitle2'>Total de OS</Typography>
              <Typography variant='h5'>{totalOS}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Typography variant='subtitle2'>% OS no Prazo (IAP)</Typography>
              <Typography variant='h5'>{pctOnTime}%</Typography>
              <LinearProgress
                variant='determinate'
                value={pctOnTime}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Typography variant='subtitle2'>
                Disponibilidade Média (IDS)
              </Typography>
              <Typography variant='h5'>{avgAvailability || '—'}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Typography variant='subtitle2'>
                Satisfação Média (ISA)
              </Typography>
              <Typography variant='h5'>{avgSatisfaction || '—'}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Indicadores de Suporte */}
      <Typography variant='h5' gutterBottom>
        Suporte & Eficiência
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid>
          <Card>
            <CardContent>
              <Typography variant='subtitle2'>
                Tempo Médio de Acesso (IDA)
              </Typography>
              <Typography variant='h6'>
                {avgAcesso !== undefined ? `${avgAcesso} dias` : '—'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Typography variant='subtitle2'>
                Tempo Médio de Resposta (IED)
              </Typography>
              <Typography variant='h6'>
                {avgResposta !== undefined ? `${avgResposta} h` : '—'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Linha Temporal de Desempenho */}
      <Typography variant='h5' gutterBottom>
        Desempenho Mensal (IAP)
      </Typography>
      <Box height={300}>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='mes' />
            <YAxis unit='%' />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='pctOnTime'
              name='% no Prazo'
              stroke='#1976d2'
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
