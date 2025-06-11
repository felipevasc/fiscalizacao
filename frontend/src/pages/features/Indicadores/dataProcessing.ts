import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico';

// --- Existing Interfaces (potentially for other charts/KPIs in index.tsx) ---
export interface MonthlyChartData { // Renamed from AccumulatedData for clarity if only used for mes/value
  mes: string;
  value?: number;
}

// --- New Interfaces for Detailed Progress Tracking ---
export interface MonthlyExecutionData {
  month: string;
  item1: number;
  item2: number;
  item3: number;
}

export interface MonthlyTotalValueData {
  month: string;
  totalValue: number;
}

export interface ProgressDetail {
  consumed: number;
  total: number;
  percentage: number;
  remaining: number;
}

export interface AccumulatedProgressData {
  item1: ProgressDetail;
  item2: ProgressDetail;
  item3: ProgressDetail;
}

export interface AccumulatedValueProgressData {
  item1: ProgressDetail;
  item2: ProgressDetail;
  item3: ProgressDetail;
}

export interface DashboardFramesData {
  totalGeneralValueConsumed: number;
  overallQuantityPercentage: { item1: number; item2: number; item3: number };
  remainingValueByItem: { item1: number; item2: number; item3: number };
  remainingQuantityByItem: { item1: number; item2: number; item3: number };
}

// --- Main ProcessedData Interface ---
export interface ProcessedData {
  // New detailed progress data
  monthlyExecution: MonthlyExecutionData[];
  monthlyTotalValue: MonthlyTotalValueData[];
  accumulatedQuantity: AccumulatedProgressData;
  accumulatedValue: AccumulatedValueProgressData;
  dashboardFrames: DashboardFramesData;

  // Existing fields (as per previous subtask, ensure they are still needed by index.tsx)
  monthlyAvgGutScoreData: MonthlyChartData[];
  monthlyNewOSData: MonthlyChartData[];
  monthlyCompletedOSData: MonthlyChartData[];
  acumuladoEntregue: MonthlyChartData[]; // This seems similar to monthlyTotalValue but might be structured differently or used elsewhere
}

// --- Totals Configuration ---
export const TOTALS_QUANTITY = { item1: 2520, item2: 2058, item3: 300 };
export const TOTALS_VALUE = { item1: 579600, item2: 3807300, item3: 123600 };
const ALL_ITEM_KEYS = ['1', '2', '3']; // Assuming item identifiers in data are '1', '2', '3'
const ITEM_MAP: { [key: string]: 'item1' | 'item2' | 'item3' } = {
  '1': 'item1', // Map actual item identifiers from OS data to keys in TOTALS
  '2': 'item2',
  '3': 'item3',
};


export const processDataForCharts = (osList: OrdemServicoIndicadores[]): ProcessedData => {
  // --- Initializations for New Data Structures ---
  const monthlyExecutionMap: Record<string, { item1: number; item2: number; item3: number }> = {};
  const monthlyTotalValueMap: Record<string, number> = {};
  let consumedQuantity = { item1: 0, item2: 0, item3: 0 };
  let consumedValue = { item1: 0, item2: 0, item3: 0 };
  let totalGeneralValueConsumed = 0;

  // --- Initializations for Existing Data Structures (from previous subtask) ---
  const monthlyEvolution: Record<string, {
    sumGutScore: number;
    countGutOs: number;
    newOS: number;
    completedOS: number;
  }> = {};
  const acumuladoEntregueMap: Record<string, number> = {}; // For 'acumuladoEntregue' chart


  osList.forEach(os => {
    let currentMonthKey = '';
    if (os.identificacao?.dataEmissao) {
      try {
        const formattedDate = os.identificacao.dataEmissao.includes('/')
          ? os.identificacao.dataEmissao.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
          : os.identificacao.dataEmissao;
        const emissaoDate = new Date(formattedDate);
        currentMonthKey = `${emissaoDate.getFullYear()}/${(emissaoDate.getMonth() + 1).toString().padStart(2, '0')}`;

        // --- Existing Data Processing (GUT, New OS, Acumulado Entregue) ---
        if (!monthlyEvolution[currentMonthKey]) {
          monthlyEvolution[currentMonthKey] = { sumGutScore: 0, countGutOs: 0, newOS: 0, completedOS: 0 };
        }
        monthlyEvolution[currentMonthKey].newOS++;

        if (os.gravidade && os.urgencia && os.tendencia) {
          const gravidade = Number(os.gravidade);
          const urgencia = Number(os.urgencia);
          const tendencia = Number(os.tendencia);
          if (!isNaN(gravidade) && !isNaN(urgencia) && !isNaN(tendencia)) {
            monthlyEvolution[currentMonthKey].sumGutScore += gravidade * urgencia * tendencia;
            monthlyEvolution[currentMonthKey].countGutOs++;
          }
        }
        const valorTotalItensForAcumulado = os.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0);
        acumuladoEntregueMap[currentMonthKey] = (acumuladoEntregueMap[currentMonthKey] || 0) + valorTotalItensForAcumulado;

      } catch (e) {
        console.error("Error processing OS emission date for GUT/NewOS/Acumulado:", e, os.identificacao?.dataEmissao);
      }
    }

    // Processamento para OS Concluídas (Existing)
    if (os.dataConclusao) {
      try {
        const formattedDate = os.dataConclusao.includes('/')
          ? os.dataConclusao.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
          : os.dataConclusao;
        const conclusaoDate = new Date(formattedDate);
        const conclusionMonthKey = `${conclusaoDate.getFullYear()}/${(conclusaoDate.getMonth() + 1).toString().padStart(2, '0')}`;

        if (!monthlyEvolution[conclusionMonthKey]) {
          monthlyEvolution[conclusionMonthKey] = { sumGutScore: 0, countGutOs: 0, newOS: 0, completedOS: 0 };
        }
        monthlyEvolution[conclusionMonthKey].completedOS++;
      } catch (e) {
        console.error("Error processing OS conclusion date:", e, os.dataConclusao);
      }
    }

    // --- New Data Processing (Execution, Value, Accumulated) ---
    // Assuming 'identificacao.dataEmissao' is the relevant date for these new metrics
    // And that items are processed regardless of OS status for these metrics.
    // If only 'Concluída' OS items should count, add a filter here.
    if (currentMonthKey) { // Ensure month key was set
      if (!monthlyExecutionMap[currentMonthKey]) {
        monthlyExecutionMap[currentMonthKey] = { item1: 0, item2: 0, item3: 0 };
      }
      if (!monthlyTotalValueMap[currentMonthKey]) {
        monthlyTotalValueMap[currentMonthKey] = 0;
      }

      os.itens.forEach(item => {
        const itemKeyMapped = ITEM_MAP[item.item]; // item.item should be '1', '2', or '3'
        if (itemKeyMapped) {
          const quantity = Number(item.quantidade) || 0;
          const value = Number(item.valorTotal) || 0;

          monthlyExecutionMap[currentMonthKey][itemKeyMapped] += quantity;
          monthlyTotalValueMap[currentMonthKey] += value;

          consumedQuantity[itemKeyMapped] += quantity;
          consumedValue[itemKeyMapped] += value;
          totalGeneralValueConsumed += value;
        }
      });
    }
  });

  // --- Formatting New Data Structures ---
  const monthlyExecution: MonthlyExecutionData[] = Object.entries(monthlyExecutionMap)
    .map(([month, items]) => ({ month, ...items }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const monthlyTotalValue: MonthlyTotalValueData[] = Object.entries(monthlyTotalValueMap)
    .map(([month, totalValue]) => ({ month, totalValue }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const calculateProgress = (consumed: number, total: number): ProgressDetail => {
    const percentage = total > 0 ? Math.max(0, Math.min(100, (consumed / total) * 100)) : 0;
    return {
      consumed,
      total,
      percentage,
      remaining: Math.max(0, total - consumed),
    };
  };

  const accumulatedQuantity: AccumulatedProgressData = {
    item1: calculateProgress(consumedQuantity.item1, TOTALS_QUANTITY.item1),
    item2: calculateProgress(consumedQuantity.item2, TOTALS_QUANTITY.item2),
    item3: calculateProgress(consumedQuantity.item3, TOTALS_QUANTITY.item3),
  };

  const accumulatedValue: AccumulatedValueProgressData = {
    item1: calculateProgress(consumedValue.item1, TOTALS_VALUE.item1),
    item2: calculateProgress(consumedValue.item2, TOTALS_VALUE.item2),
    item3: calculateProgress(consumedValue.item3, TOTALS_VALUE.item3),
  };

  const dashboardFrames: DashboardFramesData = {
    totalGeneralValueConsumed,
    overallQuantityPercentage: {
      item1: accumulatedQuantity.item1.percentage,
      item2: accumulatedQuantity.item2.percentage,
      item3: accumulatedQuantity.item3.percentage,
    },
    remainingValueByItem: {
      item1: accumulatedValue.item1.remaining,
      item2: accumulatedValue.item2.remaining,
      item3: accumulatedValue.item3.remaining,
    },
    remainingQuantityByItem: {
      item1: accumulatedQuantity.item1.remaining,
      item2: accumulatedQuantity.item2.remaining,
      item3: accumulatedQuantity.item3.remaining,
    },
  };

  // --- Formatting Existing Data Structures (from previous subtask) ---
  const evolutionArray = Object.entries(monthlyEvolution).map(([mes, data]) => ({
    mes,
    avgGutScore: data.countGutOs > 0 ? Math.round(data.sumGutScore / data.countGutOs) : undefined,
    newOSCount: data.newOS > 0 ? data.newOS : undefined,
    completedOSCount: data.completedOS > 0 ? data.completedOS : undefined,
  })).sort((a, b) => a.mes.localeCompare(b.mes));

  const monthlyAvgGutScoreData = evolutionArray.map(item => ({ mes: item.mes, value: item.avgGutScore }));
  const monthlyNewOSData = evolutionArray.map(item => ({ mes: item.mes, value: item.newOSCount }));
  const monthlyCompletedOSData = evolutionArray.map(item => ({ mes: item.mes, value: item.completedOSCount }));
  const acumuladoEntregue = Object.entries(acumuladoEntregueMap)
    .map(([mes, value]) => ({ mes, value }))
    .sort((a, b) => a.mes.localeCompare(b.mes));

  return {
    // New data
    monthlyExecution,
    monthlyTotalValue,
    accumulatedQuantity,
    accumulatedValue,
    dashboardFrames,
    // Existing data
    monthlyAvgGutScoreData,
    monthlyNewOSData,
    monthlyCompletedOSData,
    acumuladoEntregue,
  };
};
