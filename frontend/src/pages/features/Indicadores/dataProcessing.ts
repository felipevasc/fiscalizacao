// frontend/src/pages/features/Indicadores/dataProcessing.ts
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico'; // Assuming this is the type for OS_TR.json items
import { type Item } from '../OrdemServico/types/Item'; // Import Item type
import {
  type MonthlyItemConsumption,
  type TotalMonthlyConsumption,
  type AccumulatedItemConsumption,
  type ConsumptionSummary,
  type DashboardData,
} from './types';

// Totals provided in the issue description
const TOTALS = {
  item1: { quantity: 2520, value: 579600 },
  item2: { quantity: 2058, value: 3807300 },
  item3: { quantity: 300, value: 123600 },
};

// Helper function to parse dd/mm/yyyy to yyyy/mm
const parseDateToYearMonth = (dateString: string): string => {
  try {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1].padStart(2, '0')}`;
    }
  } catch (e) {
    console.error(`Error parsing date: ${dateString}`, e);
  }
  return 'Unknown Date'; // Fallback for invalid dates
};

// Helper function to get the main item category (1, 2, or 3)
const getMainItemCategory = (itemString: string): number | null => {
  try {
    const mainCategory = parseInt(itemString.split('.')[0], 10);
    if (mainCategory >= 1 && mainCategory <= 3) {
      return mainCategory;
    }
  } catch (e) {
    console.error(`Error parsing item string: ${itemString}`, e);
  }
  return null; // Fallback for invalid item strings
};

export const processDashboardData = (osList: OrdemServicoIndicadores[]): DashboardData => {
  const monthlyItemConsumptionMap = new Map<string, { item1: number; item2: number; item3: number }>();
  const totalMonthlyConsumptionMap = new Map<string, number>();

  let consumedQuantityItem1 = 0;
  let consumedQuantityItem2 = 0;
  let consumedQuantityItem3 = 0;
  let consumedValueItem1 = 0;
  let consumedValueItem2 = 0;
  let consumedValueItem3 = 0;

  osList.forEach(os => {
    const monthYear = parseDateToYearMonth(os.identificacao.dataEmissao);

    // Initialize maps if monthYear is new
    if (!monthlyItemConsumptionMap.has(monthYear)) {
      monthlyItemConsumptionMap.set(monthYear, { item1: 0, item2: 0, item3: 0 });
    }
    if (!totalMonthlyConsumptionMap.has(monthYear)) {
      totalMonthlyConsumptionMap.set(monthYear, 0);
    }

    let osTotalValue = 0;

    os.itens.forEach((itemEntry: Item) => { // Added Item type here
      const currentItemConsumption = monthlyItemConsumptionMap.get(monthYear)!;
      const mainCategory = getMainItemCategory(itemEntry.item);

      if (mainCategory === 1) {
        currentItemConsumption.item1 += itemEntry.quantidade;
        consumedQuantityItem1 += itemEntry.quantidade;
        consumedValueItem1 += itemEntry.valorTotal;
      } else if (mainCategory === 2) {
        currentItemConsumption.item2 += itemEntry.quantidade;
        consumedQuantityItem2 += itemEntry.quantidade;
        consumedValueItem2 += itemEntry.valorTotal;
      } else if (mainCategory === 3) {
        currentItemConsumption.item3 += itemEntry.quantidade;
        consumedQuantityItem3 += itemEntry.quantidade;
        consumedValueItem3 += itemEntry.valorTotal;
      }
      osTotalValue += itemEntry.valorTotal;
    });

    totalMonthlyConsumptionMap.set(monthYear, totalMonthlyConsumptionMap.get(monthYear)! + osTotalValue);
  });

  // Convert maps to arrays and sort by monthYear
  const monthlyItemConsumptionData: MonthlyItemConsumption[] = Array.from(monthlyItemConsumptionMap.entries())
    .map(([monthYear, data]) => ({
      monthYear,
      item1Quantity: data.item1,
      item2Quantity: data.item2,
      item3Quantity: data.item3,
    }))
    .sort((a, b) => a.monthYear.localeCompare(b.monthYear));

  const totalMonthlyConsumptionData: TotalMonthlyConsumption[] = Array.from(totalMonthlyConsumptionMap.entries())
    .map(([monthYear, totalValue]) => ({
      monthYear,
      totalValue,
    }))
    .sort((a, b) => a.monthYear.localeCompare(b.monthYear));

  const accumulatedItemConsumptionData: AccumulatedItemConsumption[] = [
    {
      item: 1,
      consumedQuantity: consumedQuantityItem1,
      totalQuantity: TOTALS.item1.quantity,
      consumedValue: consumedValueItem1,
      totalValue: TOTALS.item1.value,
    },
    {
      item: 2,
      consumedQuantity: consumedQuantityItem2,
      totalQuantity: TOTALS.item2.quantity,
      consumedValue: consumedValueItem2,
      totalValue: TOTALS.item2.value,
    },
    {
      item: 3,
      consumedQuantity: consumedQuantityItem3,
      totalQuantity: TOTALS.item3.quantity,
      consumedValue: consumedValueItem3,
      totalValue: TOTALS.item3.value,
    },
  ];

  const totalValueConsumed = consumedValueItem1 + consumedValueItem2 + consumedValueItem3;

  const consumptionSummaryData: ConsumptionSummary = {
    totalValueConsumed,
    item1ConsumedPercent: TOTALS.item1.quantity > 0 ? (consumedQuantityItem1 / TOTALS.item1.quantity) * 100 : 0,
    item2ConsumedPercent: TOTALS.item2.quantity > 0 ? (consumedQuantityItem2 / TOTALS.item2.quantity) * 100 : 0,
    item3ConsumedPercent: TOTALS.item3.quantity > 0 ? (consumedQuantityItem3 / TOTALS.item3.quantity) * 100 : 0,
    item1RemainingQuantity: TOTALS.item1.quantity - consumedQuantityItem1,
    item2RemainingQuantity: TOTALS.item2.quantity - consumedQuantityItem2,
    item3RemainingQuantity: TOTALS.item3.quantity - consumedQuantityItem3,
    item1RemainingValue: TOTALS.item1.value - consumedValueItem1,
    item2RemainingValue: TOTALS.item2.value - consumedValueItem2,
    item3RemainingValue: TOTALS.item3.value - consumedValueItem3,
  };

  return {
    monthlyItemConsumptionData,
    totalMonthlyConsumptionData,
    accumulatedItemConsumptionData,
    consumptionSummaryData,
  };
};
