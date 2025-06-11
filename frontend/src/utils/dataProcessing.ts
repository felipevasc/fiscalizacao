export interface OSItem {
  item: number;
  descricao: string;
  metrica: string;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
}

export interface OSIdentificacao {
  numeroOS: string;
  dataEmissao: string;
  contratoNota: string;
  objetoContrato: string;
  contratada: string;
  cnpj: string;
  preposto: string;
  inicioVigencia: string;
  fimVigencia: string;
  unidade: string;
  solicitante: string;
  email: string;
}

export interface OS {
  id: string;
  identificacao: OSIdentificacao;
  itens: OSItem[];
  // Add other fields from OS_TR.json if necessary for future functions
  // cronograma: any; // Replace 'any' with a more specific type if needed
  // status: string;
  // ... and so on
}

export interface Chart1Data {
  [monthYear: string]: {
    [itemNumber: string]: number;
  };
}

export interface Chart2Data {
  [monthYear: string]: number;
}

export interface Chart3DataItem {
  item: number;
  consumedQuantity: number;
  totalQuantity: number;
  percentageConsumed: number;
}

export interface Chart4DataItem {
  item: number;
  consumedValue: number;
  totalValue: number;
  percentageConsumed: number;
}

export interface IndicatorItemSummary {
  item: number;
  consumedQuantity: number;
  percentageQuantityConsumed: number;
  remainingQuantity: number;
  consumedValue: number;
  remainingValue: number;
}

export interface IndicatorData {
  totalOverallConsumedValue: number;
  itemsSummary: IndicatorItemSummary[];
}

export const processDataForChart1 = (osData: OS[]): Chart1Data => {
  const aggregatedData: Chart1Data = {};

  osData.forEach((os) => {
    const dataEmissao = os.identificacao.dataEmissao;
    const parts = dataEmissao.split('/');
    if (parts.length !== 3) {
      console.warn(`Invalid date format for OS ${os.id}: ${dataEmissao}`);
      return; // Skip this OS if date format is invalid
    }
    const year = parts[2];
    const month = parts[1];
    const monthYear = `${year}-${month}`;

    os.itens.forEach((item) => {
      if (!aggregatedData[monthYear]) {
        aggregatedData[monthYear] = {};
      }
      if (!aggregatedData[monthYear][item.item]) {
        aggregatedData[monthYear][item.item] = 0;
      }
      aggregatedData[monthYear][item.item] += item.quantidade;
    });
  });

  return aggregatedData;
};

export const processDataForChart3 = (osData: OS[]): Chart3DataItem[] => {
  const totalQuantities: { [itemNumber: string]: number } = {
    "1": 2520,
    "2": 2058,
    "3": 300,
  };

  const consumedQuantities: { [itemNumber: string]: number } = {};

  osData.forEach((os) => {
    os.itens.forEach((itemDetail) => {
      const itemNumberStr = String(itemDetail.item);
      if (!consumedQuantities[itemNumberStr]) {
        consumedQuantities[itemNumberStr] = 0;
      }
      consumedQuantities[itemNumberStr] += itemDetail.quantidade;
    });
  });

  const result: Chart3DataItem[] = [];
  for (const itemNumberStr in totalQuantities) {
    if (totalQuantities.hasOwnProperty(itemNumberStr)) {
      const itemNum = parseInt(itemNumberStr, 10);
      const consumed = consumedQuantities[itemNumberStr] || 0; // Default to 0 if no consumption
      const total = totalQuantities[itemNumberStr];
      const percentage = total > 0 ? (consumed / total) * 100 : 0;

      result.push({
        item: itemNum,
        consumedQuantity: consumed,
        totalQuantity: total,
        percentageConsumed: percentage,
      });
    }
  }
  // Sort by item number for consistent output, though not strictly required by prompt
  result.sort((a, b) => a.item - b.item);

  return result;
};

export const processDataForChart4 = (osData: OS[]): Chart4DataItem[] => {
  const totalValues: { [itemNumber: string]: number } = {
    "1": 579600,
    "2": 3807300,
    "3": 123600,
  };

  const consumedValues: { [itemNumber: string]: number } = {};

  osData.forEach((os) => {
    os.itens.forEach((itemDetail) => {
      const itemNumberStr = String(itemDetail.item);
      if (!consumedValues[itemNumberStr]) {
        consumedValues[itemNumberStr] = 0;
      }
      consumedValues[itemNumberStr] += itemDetail.valorTotal;
    });
  });

  const result: Chart4DataItem[] = [];
  for (const itemNumberStr in totalValues) {
    if (totalValues.hasOwnProperty(itemNumberStr)) {
      const itemNum = parseInt(itemNumberStr, 10);
      const consumed = consumedValues[itemNumberStr] || 0; // Default to 0 if no consumption
      const total = totalValues[itemNumberStr];
      const percentage = total > 0 ? (consumed / total) * 100 : 0;

      result.push({
        item: itemNum,
        consumedValue: consumed,
        totalValue: total,
        percentageConsumed: percentage,
      });
    }
  }
  // Sort by item number for consistent output
  result.sort((a, b) => a.item - b.item);

  return result;
};

export const processDataForIndicatorFrames = (osData: OS[]): IndicatorData => {
  const totalQuantities: { [itemNumber: string]: number } = {
    "1": 2520,
    "2": 2058,
    "3": 300,
  };
  const totalValues: { [itemNumber: string]: number } = {
    "1": 579600,
    "2": 3807300,
    "3": 123600,
  };

  let totalOverallConsumedValue = 0;
  const consumedQuantities: { [itemNumber: string]: number } = {};
  const consumedValues: { [itemNumber: string]: number } = {};

  osData.forEach((os) => {
    os.itens.forEach((itemDetail) => {
      const itemNumberStr = String(itemDetail.item);
      totalOverallConsumedValue += itemDetail.valorTotal;

      if (!consumedQuantities[itemNumberStr]) {
        consumedQuantities[itemNumberStr] = 0;
      }
      consumedQuantities[itemNumberStr] += itemDetail.quantidade;

      if (!consumedValues[itemNumberStr]) {
        consumedValues[itemNumberStr] = 0;
      }
      consumedValues[itemNumberStr] += itemDetail.valorTotal;
    });
  });

  const itemsSummary: IndicatorItemSummary[] = [];
  for (const itemNumberStr in totalQuantities) { // Iterate based on defined items
    if (totalQuantities.hasOwnProperty(itemNumberStr)) {
      const itemNum = parseInt(itemNumberStr, 10);

      const currentConsumedQuantity = consumedQuantities[itemNumberStr] || 0;
      const currentTotalQuantity = totalQuantities[itemNumberStr];
      const percentageQtyConsumed = currentTotalQuantity > 0 ? (currentConsumedQuantity / currentTotalQuantity) * 100 : 0;
      const currentRemainingQuantity = currentTotalQuantity - currentConsumedQuantity;

      const currentConsumedValue = consumedValues[itemNumberStr] || 0;
      const currentTotalValue = totalValues[itemNumberStr]; // Assumes totalValues has this item
      const currentRemainingValue = currentTotalValue ? currentTotalValue - currentConsumedValue : 0;


      itemsSummary.push({
        item: itemNum,
        consumedQuantity: currentConsumedQuantity,
        percentageQuantityConsumed: percentageQtyConsumed,
        remainingQuantity: currentRemainingQuantity,
        consumedValue: currentConsumedValue,
        remainingValue: currentRemainingValue,
      });
    }
  }

  // Sort by item number for consistent output
  itemsSummary.sort((a, b) => a.item - b.item);

  return {
    totalOverallConsumedValue,
    itemsSummary,
  };
};

export const processDataForChart2 = (osData: OS[]): Chart2Data => {
  const aggregatedData: Chart2Data = {};

  osData.forEach((os) => {
    // Ensure there is at least one item in the OS
    if (!os.itens || os.itens.length === 0) {
      return; // Skip this OS if it has no items
    }

    const dataEmissao = os.identificacao.dataEmissao;
    const parts = dataEmissao.split('/');
    if (parts.length !== 3) {
      console.warn(`Invalid date format for OS ${os.id}: ${dataEmissao} in processDataForChart2`);
      return; // Skip this OS if date format is invalid
    }
    const year = parts[2];
    const month = parts[1];
    const monthYear = `${year}-${month}`;

    const valorTotalPrimeiroItem = os.itens[0].valorTotal;

    if (!aggregatedData[monthYear]) {
      aggregatedData[monthYear] = 0;
    }
    aggregatedData[monthYear] += valorTotalPrimeiroItem;
  });

  return aggregatedData;
};
