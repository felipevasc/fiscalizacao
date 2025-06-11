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
import MatrizGUTChart from './MatrizGUTChart';
import ImpactoEsforcoChart from './ImpactoEsforcoChart';
import MonthlyKPIChart from './MonthlyKPIChart'; // Import the new MonthlyKPIChart

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

interface MonthlyKPIEvolution {
  mes: string;
  avgGutScore?: number;
  newOSCount?: number;
  completedOSCount?: number;
}

export default function Indicadores() {
  const [osList, setOsList] = useState<OrdemServicoIndicadores[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [monthlyKPIEvolutionData, setMonthlyKPIEvolutionData] = useState<MonthlyKPIEvolution[]>([]);
  const [forecastAvgGutScore, setForecastAvgGutScore] = useState<number | undefined>(undefined);
  const [forecastNewOSCount, setForecastNewOSCount] = useState<number | undefined>(undefined);
  const [forecastCompletedOSCount, setForecastCompletedOSCount] = useState<number | undefined>(undefined);


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

  // Novos KPIs - Cálculo
  const osByStatus: Record<string, number> = {};
  let sumGutScore = 0;
  const gutScoreDistribution = { Low: 0, Medium: 0, High: 0 };
  const osByType: Record<string, number> = {};
  const osByComplexity: Record<string, number> = {};
  const udpValues: number[] = [];
  const prazoDiasUteisValues: number[] = [];

  osList.forEach((os) => {
    // Count of OS by status
    if (os.status) {
      osByStatus[os.status] = (osByStatus[os.status] || 0) + 1;
    }

    // GUT score calculations
    if (os.gut && os.gut.gravidade && os.gut.urgencia && os.gut.tendencia) {
      const gravidade = Number(os.gut.gravidade);
      const urgencia = Number(os.gut.urgencia);
      const tendencia = Number(os.gut.tendencia);
      if (!isNaN(gravidade) && !isNaN(urgencia) && !isNaN(tendencia)) {
        const gutScore = gravidade * urgencia * tendencia;
        sumGutScore += gutScore;
        if (gutScore >= 1 && gutScore <= 40) {
          gutScoreDistribution.Low++;
        } else if (gutScore >= 41 && gutScore <= 80) {
          gutScoreDistribution.Medium++;
        } else if (gutScore >= 81 && gutScore <= 125) {
          gutScoreDistribution.High++;
        }
      }
    }

    // Count of OS by type
    if (os.tipo) {
      osByType[os.tipo] = (osByType[os.tipo] || 0) + 1;
    }

    // Count of OS by complexity
    if (os.complexidade) {
      osByComplexity[os.complexidade] = (osByComplexity[os.complexidade] || 0) + 1;
    }

    // UDP values
    if (os.udp !== undefined && os.udp !== null) {
      const udp = Number(os.udp);
      if(!isNaN(udp)) {
        udpValues.push(udp);
      }
    }

    // Prazo Dias Uteis values
    if (os.prazoDiasUteis !== undefined && os.prazoDiasUteis !== null) {
      const prazo = Number(os.prazoDiasUteis);
      if(!isNaN(prazo)) {
        prazoDiasUteisValues.push(prazo);
      }
    }
  });

  const avgGutScore = totalOS > 0 && sumGutScore > 0 ? Math.round(sumGutScore / totalOS) : 0;

  const calculateStats = (values: number[]) => {
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0 };
    }
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { avg, min, max };
  };

  const udpStats = calculateStats(udpValues);
  const prazoDiasUteisStats = calculateStats(prazoDiasUteisValues);

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

  // Calcula evolução mensal de KPIs e previsões
  useEffect(() => {
    const monthlyEvolution: Record<string, {
      sumGutScore: number;
      countGutOs: number;
      newOS: number;
      completedOS: number;
    }> = {};

    osList.forEach(os => {
      // Processamento para Novas OS e GUT Score Médio Mensal
      if (os.identificacao?.data_emissao_os) {
        try {
          const emissaoDate = new Date(os.identificacao.data_emissao_os);
          const key = `${emissaoDate.getFullYear()}/${(emissaoDate.getMonth() + 1).toString().padStart(2, '0')}`;

          if (!monthlyEvolution[key]) {
            monthlyEvolution[key] = { sumGutScore: 0, countGutOs: 0, newOS: 0, completedOS: 0 };
          }
          monthlyEvolution[key].newOS++;

          if (os.gut?.gravidade && os.gut?.urgencia && os.gut?.tendencia) {
            const gravidade = Number(os.gut.gravidade);
            const urgencia = Number(os.gut.urgencia);
            const tendencia = Number(os.gut.tendencia);
            if (!isNaN(gravidade) && !isNaN(urgencia) && !isNaN(tendencia)) {
              monthlyEvolution[key].sumGutScore += gravidade * urgencia * tendencia;
              monthlyEvolution[key].countGutOs++;
            }
          }
        } catch (e) {
          console.error("Error processing OS emission date or GUT score:", e);
        }
      }

      // Processamento para OS Concluídas
      if (os.dataConclusao) {
         try {
          const conclusaoDate = new Date(os.dataConclusao);
          const key = `${conclusaoDate.getFullYear()}/${(conclusaoDate.getMonth() + 1).toString().padStart(2, '0')}`;

          if (!monthlyEvolution[key]) {
             // Initialize if not already done by new OS processing
            monthlyEvolution[key] = { sumGutScore: 0, countGutOs: 0, newOS: 0, completedOS: 0 };
          }
          monthlyEvolution[key].completedOS++;
        } catch (e) {
          console.error("Error processing OS conclusion date:", e);
        }
      }
    });

    const evolutionArray = Object.entries(monthlyEvolution).map(([mes, data]) => ({
      mes,
      avgGutScore: data.countGutOs > 0 ? Math.round(data.sumGutScore / data.countGutOs) : undefined,
      newOSCount: data.newOS > 0 ? data.newOS : undefined,
      completedOSCount: data.completedOS > 0 ? data.completedOS : undefined,
    })).sort((a, b) => a.mes.localeCompare(b.mes));

    setMonthlyKPIEvolutionData(evolutionArray);

    // Calcular Previsões (Média Móvel de 3 meses)
    if (evolutionArray.length > 0) {
      const lastN = 3;
      const relevantDataForForecast = evolutionArray.slice(-lastN);

      const sumForecastGut = relevantDataForForecast.reduce((acc, curr) => acc + (curr.avgGutScore || 0), 0);
      const countForecastGut = relevantDataForForecast.filter(d => d.avgGutScore !== undefined).length;
      setForecastAvgGutScore(countForecastGut > 0 ? Math.round(sumForecastGut / countForecastGut) : undefined);

      const sumForecastNewOS = relevantDataForForecast.reduce((acc, curr) => acc + (curr.newOSCount || 0), 0);
      const countForecastNewOS = relevantDataForForecast.filter(d => d.newOSCount !== undefined).length;
      setForecastNewOSCount(countForecastNewOS > 0 ? Math.round(sumForecastNewOS / countForecastNewOS) : undefined);

      const sumForecastCompletedOS = relevantDataForForecast.reduce((acc, curr) => acc + (curr.completedOSCount || 0), 0);
      const countForecastCompletedOS = relevantDataForForecast.filter(d => d.completedOSCount !== undefined).length;
      setForecastCompletedOSCount(countForecastCompletedOS > 0 ? Math.round(sumForecastCompletedOS / countForecastCompletedOS) : undefined);

    } else {
      setForecastAvgGutScore(undefined);
      setForecastNewOSCount(undefined);
      setForecastCompletedOSCount(undefined);
    }
  }, [osList]);

  // Prepare data for new monthly charts
  const monthlyAvgGutScoreData = monthlyKPIEvolutionData.map(item => ({
    mes: item.mes,
    value: item.avgGutScore,
  }));
  const monthlyNewOSData = monthlyKPIEvolutionData.map(item => ({
    mes: item.mes,
    value: item.newOSCount,
  }));
  const monthlyCompletedOSData = monthlyKPIEvolutionData.map(item => ({
    mes: item.mes,
    value: item.completedOSCount,
  }));

  return (
    <Box p={3}> {/* Increased padding for overall layout */}
      <Typography variant='h4' gutterBottom sx={{ mb: 2 }}>
        Dashboard de Indicadores Contratuais
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Row 1: Overview KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Total de OS</Typography>
              <Typography variant='h5' component="div" data-testid="totalOS-value">{totalOS}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">% OS no Prazo (IAP)</Typography>
              <Typography variant='h5' component="div" data-testid="pctOnTime-value">{pctOnTime}%</Typography>
              <LinearProgress variant='determinate' value={pctOnTime} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Disponibilidade Média (IDS)</Typography>
              <Typography variant='h5' component="div" data-testid="avgAvailability-value">{avgAvailability || '—'}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Satisfação Média (ISA)</Typography>
              <Typography variant='h5' component="div" data-testid="avgSatisfaction-value">{avgSatisfaction || '—'}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Efficiency & Support KPIs */}
      <Typography variant='h5' gutterBottom sx={{ mt: 4, mb: 2 }}>
        Eficiência & Suporte
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Tempo Médio de Acesso (IDA)</Typography>
              <Typography variant='h6' component="div" data-testid="avgAcesso-value">{avgAcesso !== undefined ? `${avgAcesso} dias` : '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Tempo Médio de Resposta (IED)</Typography>
              <Typography variant='h6' component="div" data-testid="avgResposta-value">{avgResposta !== undefined ? `${avgResposta} h` : '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Média UDP</Typography>
              <Typography variant='h6' component="div" data-testid="udpStatsAvg-value">{udpStats.avg !== undefined ? udpStats.avg.toFixed(2) : '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Média Prazo Dias Úteis</Typography>
              <Typography variant='h6' component="div" data-testid="prazoDiasUteisStatsAvg-value">{prazoDiasUteisStats.avg !== undefined ? prazoDiasUteisStats.avg.toFixed(0) : '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* GUT Analysis Section */}
      <Typography variant='h5' gutterBottom sx={{ mt: 4, mb: 2 }}>
        Análise GUT
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary">Score GUT Médio</Typography>
              <Typography variant='h6' component="div" data-testid="avgGutScore-value">{avgGutScore || '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent data-testid="gutScoreDistribution-value">
              <Typography variant='subtitle2' color="textSecondary">Distribuição GUT</Typography>
              <Typography component="div">Baixo (1-40): {gutScoreDistribution.Low}</Typography>
              <Typography component="div">Médio (41-80): {gutScoreDistribution.Medium}</Typography>
              <Typography component="div">Alto (81-125): {gutScoreDistribution.High}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}> {/* Adjusted md for potentially larger chart */}
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary" gutterBottom>
                Matriz GUT (Gravidade x Urgência)
              </Typography>
              <MatrizGUTChart osList={osList} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* OS Characteristics Section */}
      <Typography variant='h5' gutterBottom sx={{ mt: 4, mb: 2 }}>
        Características das OS
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent data-testid="osByType-values">
              <Typography variant='subtitle2' color="textSecondary" gutterBottom>OS por Tipo</Typography>
              {Object.entries(osByType).length > 0 ? Object.entries(osByType).map(([tipo, count]) => (
                <Typography key={tipo} component="div">{tipo}: {count}</Typography>
              )) : <Typography component="div">N/A</Typography>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent data-testid="osByComplexity-values">
              <Typography variant='subtitle2' color="textSecondary" gutterBottom>OS por Complexidade</Typography>
              {Object.entries(osByComplexity).length > 0 ? Object.entries(osByComplexity).map(([complexidade, count]) => (
                <Typography key={complexidade} component="div">{complexidade}: {count}</Typography>
              )) : <Typography component="div">N/A</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Evolution & Forecasts Section */}
      <Typography variant='h5' gutterBottom sx={{ mt: 4, mb: 2 }}>
        Evolução Mensal e Previsões
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
         <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='subtitle2' color="textSecondary" gutterBottom>Desempenho Mensal (IAP %)</Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="pctOnTime" name="% no Prazo" stroke="#1976d2" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={6}>
            {/* This Grid item can contain the forecast cards */}
            <Grid container spacing={2}>
                 <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant='subtitle2' color="textSecondary" align="center">Previsão GUT Médio</Typography>
                            <Typography variant='h6' align="center" data-testid="forecastAvgGutScore-value">{forecastAvgGutScore !== undefined ? forecastAvgGutScore.toFixed(0) : '—'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                     <Card>
                        <CardContent>
                            <Typography variant='subtitle2' color="textSecondary" align="center">Previsão Novas OS</Typography>
                            <Typography variant='h6' align="center" data-testid="forecastNewOSCount-value">{forecastNewOSCount !== undefined ? forecastNewOSCount.toFixed(0) : '—'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                     <Card>
                        <CardContent>
                            <Typography variant='subtitle2' color="textSecondary" align="center">Previsão OS Concluídas</Typography>
                            <Typography variant='h6' align="center" data-testid="forecastCompletedOSCount-value">{forecastCompletedOSCount !== undefined ? forecastCompletedOSCount.toFixed(0) : '—'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
      </Grid>

      {/* Row for New Monthly Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <MonthlyKPIChart
            data={monthlyAvgGutScoreData}
            title="Evolução Mensal - Avg. GUT Score"
            lineName="Avg. GUT Score"
            lineColor="#8884d8"
            yAxisUnit=""
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthlyKPIChart
            data={monthlyNewOSData}
            title="Evolução Mensal - Novas OS Criadas"
            lineName="Nº Novas OS"
            lineColor="#82ca9d"
            yAxisUnit=""
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthlyKPIChart
            data={monthlyCompletedOSData}
            title="Evolução Mensal - OS Concluídas"
            lineName="Nº OS Concluídas"
            lineColor="#ffc658"
            yAxisUnit=""
          />
        </Grid>
        {/* Add an empty Grid item to balance the row if only 3 charts, or add another chart */}
        <Grid item xs={12} md={6} />
      </Grid>

      {/* Impact x Effort Analysis Section */}
      <Typography variant='h5' gutterBottom sx={{ mt: 4, mb: 2 }}>
        Análise Impacto x Esforço
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}> {/* This chart can take full width */}
          <Card>
            <CardContent>
              <Typography variant='subtitle2' color="textSecondary" gutterBottom>
                Matriz Impacto x Esforço (GUT Score x UDP)
              </Typography>
              <ImpactoEsforcoChart osList={osList} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
