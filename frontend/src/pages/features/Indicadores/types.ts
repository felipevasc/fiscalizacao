// frontend/src/pages/features/Indicadores/types.ts

// Interface for monthly consumption per item (Chart 1)
export interface MonthlyItemConsumption {
  monthYear: string; // Format: "YYYY/MM"
  item1Quantity: number;
  item2Quantity: number;
  item3Quantity: number;
}

// Interface for total monthly consumption (Chart 2)
export interface TotalMonthlyConsumption {
  monthYear: string; // Format: "YYYY/MM"
  totalValue: number;
}

// Interface for accumulated item consumption (Chart 3 & 4)
export interface AccumulatedItemConsumption {
  item: number; // 1, 2, or 3
  consumedQuantity: number;
  totalQuantity: number;
  consumedValue: number;
  totalValue: number;
}

// Interface for summary indicators (Section 5)
export interface ConsumptionSummary {
  totalValueConsumed: number;
  item1ConsumedPercent: number;
  item2ConsumedPercent: number;
  item3ConsumedPercent: number;
  item1RemainingQuantity: number;
  item2RemainingQuantity: number;
  item3RemainingQuantity: number;
  item1RemainingValue: number;
  item2RemainingValue: number;
  item3RemainingValue: number;
}

// Interface to extend OrdemServico for indicators if needed
// This can be based on the existing OrdemServicoIndicadores
// and extended if new processed fields are added directly to OS objects
// For now, we'll assume processing happens separately.

// You might also want a consolidated type for all new chart/indicator data
export interface DashboardData {
  monthlyItemConsumptionData: MonthlyItemConsumption[];
  totalMonthlyConsumptionData: TotalMonthlyConsumption[];
  accumulatedItemConsumptionData: AccumulatedItemConsumption[];
  consumptionSummaryData: ConsumptionSummary;
}
