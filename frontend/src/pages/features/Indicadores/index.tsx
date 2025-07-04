// src/pages/Indicadores.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  type SxProps,
  type Theme,
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
import MatrizGUTChart from './MatrizGUTChart';
import ImpactoEsforcoChart from './ImpactoEsforcoChart';
import MonthlyKPIChart from './MonthlyKPIChart'; // Import the new MonthlyKPIChart
import ContractExecutionChart from './ContractExecutionChart'; // Import the new chart
import TotalValueChart from './TotalValueChart'; // Import the TotalValueChart
import AccumulatedProgressChart from './AccumulatedProgressChart'; // Import the AccumulatedProgressChart
import DashboardFrames from './DashboardFrames'; // Import DashboardFrames
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico';
import { carregarOrdensDoStorage } from '../OrdemServico/Acompanhamento';
import { processDataForCharts, type ProcessedData } from './dataProcessing';
import AcompanhamentoComponent from './Acompanhamento';

// Estrutura de OS, estenda conforme necessidade


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
  const commonCardSx: SxProps<Theme> = {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.06), 0px 4px 5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.03)',
    height: '100%', // Ensure cards in the same row stretch to the same height
    display: 'flex',
    flexDirection: 'column',
  };

  const [osList, setOsList] = useState<OrdemServicoIndicadores[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [monthlyKPIEvolutionData, setMonthlyKPIEvolutionData] = useState<MonthlyKPIEvolution[]>([]);
  const [forecastAvgGutScore, setForecastAvgGutScore] = useState<number | undefined>(undefined);
  const [forecastNewOSCount, setForecastNewOSCount] = useState<number | undefined>(undefined);
  const [forecastCompletedOSCount, setForecastCompletedOSCount] = useState<number | undefined>(undefined);
  const [processedChartData, setProcessedChartData] = useState<ProcessedData | null>(null);


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
    if (os.gravidade && os.urgencia && os.tendencia) {
      const gravidade = Number(os.gravidade);
      const urgencia = Number(os.urgencia);
      const tendencia = Number(os.tendencia);
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
      if (!isNaN(udp)) {
        udpValues.push(udp);
      }
    }

    // Prazo Dias Uteis values
    if (os.prazoDiasUteis !== undefined && os.prazoDiasUteis !== null) {
      const prazo = Number(os.prazoDiasUteis);
      if (!isNaN(prazo)) {
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
    // Call processDataForCharts to get all processed chart data
    const chartData = processDataForCharts(osList);
    setProcessedChartData(chartData);

    const mapMes: Record<string, { total: number; onTime: number }> = {};
    osList.forEach((os) => {
      const d = os.dataConclusao || os.identificacao.dataEmissao || '';
      if (!d) return;
      const key = new Date(d.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')).toLocaleString('default', { month: '2-digit', year: 'numeric' });
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
      if (os.identificacao?.dataEmissao) {
        try {
          const emissaoDate = new Date(os.identificacao.dataEmissao);
          const key = `${emissaoDate.getFullYear()}/${(emissaoDate.getMonth() + 1).toString().padStart(2, '0')}`;

          if (!monthlyEvolution[key]) {
            monthlyEvolution[key] = { sumGutScore: 0, countGutOs: 0, newOS: 0, completedOS: 0 };
          }
          monthlyEvolution[key].newOS++;

          if (os.gravidade && os.urgencia && os.tendencia) {
            const gravidade = Number(os.gravidade);
            const urgencia = Number(os.urgencia);
            const tendencia = Number(os.tendencia);
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

  // Data for charts is now derived from processedChartData state
  const monthlyAvgGutScoreData = processedChartData?.monthlyAvgGutScoreData || [];
  const monthlyNewOSData = processedChartData?.monthlyNewOSData || [];
  const monthlyCompletedOSData = processedChartData?.monthlyCompletedOSData || [];
  const acumuladoEntregue = processedChartData?.acumuladoEntregue || [];

  return (
    <>
    
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3, // existing padding, kept
      }}
    >
      <Typography variant='h4' sx={{ mb: 3 }}>
        Acompanhamento do Contrato
      </Typography>
      {/* Dashboard Frames - General Contract Summary */}
      <Grid container>
          <DashboardFrames data={processedChartData?.dashboardFrames || null} />
      </Grid>
      <AcompanhamentoComponent />
      <hr/>
      {/* Top Row Charts - Monthly Execution and Total Value */}
      <Grid container spacing={3}>
          <ContractExecutionChart data={processedChartData?.monthlyExecution || []} />
          
          <TotalValueChart data={processedChartData?.monthlyTotalValue || []} />
          <AccumulatedProgressChart
            data={processedChartData?.accumulatedQuantity || null}
            valueType="quantity"
            // Title will use default from component
          />
          <AccumulatedProgressChart
            data={processedChartData?.accumulatedValue || null}
            title="Progresso Acumulado por Item (Valor)"
            valueType="value"
          />
      </Grid>
      <hr />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', justifyContent: 'space-around' }}>
        <Grid style={{ width: '40%' }}>
          <MatrizGUTChart osList={osList} />
        </Grid>
        <Grid style={{ width: '40%' }}>
          <MonthlyKPIChart
            data={monthlyAvgGutScoreData}
            title="Evolução Mensal - Avg. GUT Score"
            lineName="Avg. GUT Score"
            lineColor="#8884d8"
            yAxisUnit=""
          />
        </Grid>
        <Grid style={{ width: '40%' }}>
          <MonthlyKPIChart
            data={monthlyNewOSData}
            title="Evolução Mensal - Novas OS Criadas"
            lineName="Nº Novas OS"
            lineColor="#82ca9d"
            yAxisUnit=""
          />
        </Grid>
        <Grid style={{ width: '40%' }}>
          <MonthlyKPIChart
            data={monthlyCompletedOSData}
            title="Evolução Mensal - OS Concluídas"
            lineName="Nº OS Concluídas"
            lineColor="#ffc658"
            yAxisUnit=""
          />
        </Grid>
        <Grid style={{ width: '40%' }}>
          <MonthlyKPIChart
            data={acumuladoEntregue}
            title="Entregue"
            lineName="Nº OS Concluídas"
            lineColor="#ffc658"
            yAxisUnit=""
          />
        </Grid>

      </div>
      

      
      
      {/* New Row for Accumulated Progress Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
          
      </Grid>
      <Divider sx={{ my: 3 }} /> {/* Added Divider */}
      
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ flexGrow: 4, overflowY: 'auto', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Grid>
          <Card sx={commonCardSx}>
            <CardContent>
              <Typography variant='subtitle1' color="textSecondary">Total de OS</Typography>
              <Typography variant='h5' component="div" data-testid="totalOS-value">{totalOS}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={commonCardSx}>
            <CardContent>
              <Typography variant='subtitle1' color="textSecondary">% OS no Prazo (IAP)</Typography>
              <Typography variant='h5' component="div" data-testid="pctOnTime-value">{pctOnTime}%</Typography>
              <LinearProgress variant='determinate' value={pctOnTime} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={commonCardSx}>
            <CardContent>
              <Typography variant='subtitle1' color="textSecondary">Disponibilidade Média (IDS)</Typography>
              <Typography variant='h5' component="div" data-testid="avgAvailability-value">{avgAvailability || '—'}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={commonCardSx}>
            <CardContent>
              <Typography variant='subtitle1' color="textSecondary">Satisfação Média (ISA)</Typography>
              <Typography variant='h5' component="div" data-testid="avgSatisfaction-value">{avgSatisfaction || '—'}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Row 2: Efficiency & Support KPIs */}
        <Typography variant='h5' sx={{ mt: 4, mb: 3 }}>
          Eficiência & Suporte
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent>
                <Typography variant='subtitle1' color="textSecondary">Tempo Médio de Acesso (IDA)</Typography>
                <Typography variant='h6' component="div" data-testid="avgAcesso-value">{avgAcesso !== undefined ? `${avgAcesso} dias` : '—'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent>
                <Typography variant='subtitle1' color="textSecondary">Tempo Médio de Resposta (IED)</Typography>
                <Typography variant='h6' component="div" data-testid="avgResposta-value">{avgResposta !== undefined ? `${avgResposta} h` : '—'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent>
                <Typography variant='subtitle1' color="textSecondary">Média UDP</Typography>
                <Typography variant='h6' component="div" data-testid="udpStatsAvg-value">{udpStats.avg !== undefined ? udpStats.avg.toFixed(2) : '—'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent>
                <Typography variant='subtitle1' color="textSecondary">Média Prazo Dias Úteis</Typography>
                <Typography variant='h6' component="div" data-testid="prazoDiasUteisStatsAvg-value">{prazoDiasUteisStats.avg !== undefined ? prazoDiasUteisStats.avg.toFixed(0) : '—'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* GUT Analysis Section */}
        <Typography variant='h5' sx={{ mt: 4, mb: 3 }}>
          Análise GUT
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent>
                <Typography variant='subtitle1' color="textSecondary">Score GUT Médio</Typography>
                <Typography variant='h6' component="div" data-testid="avgGutScore-value">{avgGutScore || '—'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent data-testid="gutScoreDistribution-value">
                <Typography variant='subtitle1' color="textSecondary" gutterBottom>Distribuição GUT</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Baixo (1-40): {gutScoreDistribution.Low}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Médio (41-80): {gutScoreDistribution.Medium}</Typography>
                <Typography variant="body2">Alto (81-125): {gutScoreDistribution.High}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid> {/* Adjusted md for potentially larger chart */}
            <Card sx={commonCardSx}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle1' color="textSecondary" gutterBottom>
                  Matriz GUT (Gravidade x Urgência)
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* OS Characteristics Section */}
        <Typography variant='h5' sx={{ mt: 4, mb: 3 }}>
          Características das OS
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent data-testid="osByType-values">
                <Typography variant='subtitle1' color="textSecondary" gutterBottom>OS por Tipo</Typography>
                {Object.entries(osByType).length > 0 ? Object.entries(osByType).map(([tipo, count]) => (
                  <Typography key={tipo} variant="body2" sx={{ mb: 0.5 }}>{tipo}: {count}</Typography>
                )) : <Typography variant="body2">N/A</Typography>}
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent data-testid="osByComplexity-values">
                <Typography variant='subtitle1' color="textSecondary" gutterBottom>OS por Complexidade</Typography>
                {Object.entries(osByComplexity).length > 0 ? Object.entries(osByComplexity).map(([complexidade, count]) => (
                  <Typography key={complexidade} variant="body2" sx={{ mb: 0.5 }}>{complexidade}: {count}</Typography>
                )) : <Typography variant="body2">N/A</Typography>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Monthly Evolution & Forecasts Section */}
        <Typography variant='h5' sx={{ mt: 4, mb: 3 }}>
          Evolução Mensal e Previsões
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <Card sx={commonCardSx}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', '& .recharts-responsive-container': { flexGrow: 1 } }}>
                <Typography variant='subtitle1' color="textSecondary" gutterBottom>Desempenho Mensal (IAP %)</Typography>
                <Box sx={{ height: 300, mt: 2, flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis unit="%" tick={{ fontSize: 10 }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="pctOnTime" name="% no Prazo" stroke="#1976d2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            {/* This Grid item can contain the forecast cards */}
            <Grid container spacing={2}>
              <Grid>
                <Card sx={commonCardSx}>
                  <CardContent>
                    <Typography variant='subtitle1' color="textSecondary" align="center">Previsão GUT Médio</Typography>
                    <Typography variant='h6' align="center" data-testid="forecastAvgGutScore-value">{forecastAvgGutScore !== undefined ? forecastAvgGutScore.toFixed(0) : '—'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid>
                <Card sx={commonCardSx}>
                  <CardContent>
                    <Typography variant='subtitle1' color="textSecondary" align="center">Previsão Novas OS</Typography>
                    <Typography variant='h6' align="center" data-testid="forecastNewOSCount-value">{forecastNewOSCount !== undefined ? forecastNewOSCount.toFixed(0) : '—'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid>
                <Card sx={commonCardSx}>
                  <CardContent>
                    <Typography variant='subtitle1' color="textSecondary" align="center">Previsão OS Concluídas</Typography>
                    <Typography variant='h6' align="center" data-testid="forecastCompletedOSCount-value">{forecastCompletedOSCount !== undefined ? forecastCompletedOSCount.toFixed(0) : '—'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Impact x Effort Analysis Section */}
        <Typography variant='h5' sx={{ mt: 4, mb: 3 }}>
          Análise Impacto x Esforço
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid> {/* This chart can take full width */}
            <Card sx={commonCardSx}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle1' color="textSecondary" gutterBottom>
                  Matriz Impacto x Esforço (GUT Score x UDP)
                </Typography>
                <ImpactoEsforcoChart osList={osList} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box> {/* Closing the new scrollable Box */}
    </Box>
    </>
  );
}
