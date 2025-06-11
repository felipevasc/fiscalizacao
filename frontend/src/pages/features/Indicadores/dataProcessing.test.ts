// frontend/src/pages/features/Indicadores/dataProcessing.test.ts
import { processDataForCharts } from './dataProcessing';
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico'; // Adjust path as needed
import {
  TOTALS_QUANTITY,
  TOTALS_VALUE
} from './dataProcessing'; // Assuming these are exported or accessible

// Mock data for testing
const mockOsList: OrdemServicoIndicadores[] = [
  {
    id: '1',
    identificacao: {
      numeroOS: 'OS001',
      dataEmissao: '01/01/2023', // Jan 2023
      // ... other required fields
    },
    itens: [
      { item: 1, quantidade: 10, valorTotal: 1000 },
      { item: 2, quantidade: 5, valorTotal: 500 },
    ],
    // ... other OS fields
  },
  {
    id: '2',
    identificacao: {
      numeroOS: 'OS002',
      dataEmissao: '15/01/2023', // Jan 2023
      // ...
    },
    itens: [
      { item: 1, quantidade: 20, valorTotal: 2000 },
      { item: 3, quantidade: 8, valorTotal: 800 },
    ],
    // ...
  },
  {
    id: '3',
    identificacao: {
      numeroOS: 'OS003',
      dataEmissao: '05/02/2023', // Feb 2023
      // ...
    },
    itens: [
      { item: 1, quantidade: 15, valorTotal: 1500 },
    ],
    // ...
  },
    {
    id: '4',
    identificacao: {
      numeroOS: 'OS004',
      dataEmissao: '05/02/2023', // Feb 2023
      // ...
    },
    itens: [ // This OS has multiple items in its 'itens' array, which is different from others
      { item: 2, quantidade: 10, valorTotal: 1000, descricao: "Service X", metrica: "Und", valorUnitario: 100 },
      { item: 3, quantidade: 3, valorTotal: 300, descricao: "Service Y", metrica: "Und", valorUnitario: 100 },
    ],
    // ...
  },
];

// Simplified mock for fields not directly tested for new charts, but required by type
const commonOsFields = {
  identificacao: {
    contratoNota: 'CN-001',
    objetoContrato: 'Test Contract',
    contratada: 'Test Inc.',
    cnpj: '00.000.000/0001-00',
    preposto: 'John Doe',
    inicioVigencia: '01/01/2023',
    fimVigencia: '31/12/2023',
    unidade: 'Test Unit',
    solicitante: 'Jane Doe',
    email: 'jane@test.com',
  },
  cronograma: { data_inicio: '01/01/2023', data_fim: '31/01/2023', tabela: [] },
  status: 'Em Execução',
  gravidade: 1, urgencia: 1, tendencia: 1, gutScore:1,
  tipo: 'Desenho', complexidade: 'Baixa', udp:10
};

const testOsList: OrdemServicoIndicadores[] = [
  {
    id: '1',
    identificacao: { numeroOS: 'OS001', dataEmissao: '01/03/2024', ...commonOsFields.identificacao },
    itens: [{ item: 1, descricao: 'Item 1', metrica: 'HORA', quantidade: 100, valorUnitario: 20, valorTotal: 2000 }],
    ...commonOsFields
  },
  {
    id: '2',
    identificacao: { numeroOS: 'OS002', dataEmissao: '15/03/2024', ...commonOsFields.identificacao },
    itens: [{ item: 2, descricao: 'Item 2', metrica: 'HORA', quantidade: 50, valorUnitario: 15, valorTotal: 750 }],
     ...commonOsFields
  },
  {
    id: '3',
    identificacao: { numeroOS: 'OS003', dataEmissao: '01/04/2024', ...commonOsFields.identificacao },
    itens: [{ item: 1, descricao: 'Item 1', metrica: 'HORA', quantidade: 80, valorUnitario: 20, valorTotal: 1600 }],
     ...commonOsFields
  },
  {
    id: '4',
    identificacao: { numeroOS: 'OS004', dataEmissao: '10/04/2024', ...commonOsFields.identificacao },
    itens: [{ item: 3, descricao: 'Item 3', metrica: 'HORA', quantidade: 20, valorUnitario: 40, valorTotal: 800 }],
    ...commonOsFields
  },
  { // Multiple items in one OS, ensure valorTotal for monthlyTotalValue is from the first item, and quantities are summed per item type
    id: '5',
    identificacao: { numeroOS: 'OS005', dataEmissao: '12/04/2024', ...commonOsFields.identificacao },
    itens: [
        { item: 1, descricao: 'Item 1 part A', metrica: 'HORA', quantidade: 30, valorUnitario: 20, valorTotal: 600 },
        { item: 2, descricao: 'Item 2 part A', metrica: 'HORA', quantidade: 20, valorUnitario: 15, valorTotal: 300 }
    ],
    ...commonOsFields
  },
];


describe('processDataForCharts', () => {
  const processedData = processDataForCharts(testOsList);

  // Test for Monthly Execution Data (Chart 1)
  describe('monthlyExecution', () => {
    it('should correctly sum quantities for each item by month', () => {
      const marchData = processedData.monthlyExecution.find(d => d.month === '2024/03');
      const aprilData = processedData.monthlyExecution.find(d => d.month === '2024/04');

      expect(marchData?.item1).toBe(100);
      expect(marchData?.item2).toBe(50);
      expect(marchData?.item3).toBe(0); // No item 3 in March

      expect(aprilData?.item1).toBe(80 + 30); // 80 from OS3, 30 from OS5
      expect(aprilData?.item2).toBe(20);    // 20 from OS5
      expect(aprilData?.item3).toBe(20);    // 20 from OS4
    });
  });

  // Test for Monthly Total Value Data (Chart 2)
  describe('monthlyTotalValue', () => {
    it('should correctly sum os.itens[any].valorTotal by month', () => { // Corrected: sum all items' valorTotal
      const marchData = processedData.monthlyTotalValue.find(d => d.month === '2024/03');
      const aprilData = processedData.monthlyTotalValue.find(d => d.month === '2024/04');

      // March: OS1 (2000) + OS2 (750)
      expect(marchData?.totalValue).toBe(2000 + 750);
      // April: OS3 (1600) + OS4 (800) + OS5 (600 + 300)
      expect(aprilData?.totalValue).toBe(1600 + 800 + 600 + 300);
    });
  });

  // Test for Accumulated Quantity Progress (Chart 3)
  describe('accumulatedQuantity', () => {
    it('should correctly calculate consumed, total, percentage, and remaining quantities for each item', () => {
      const { item1, item2, item3 } = processedData.accumulatedQuantity;

      // Item 1: 100 (OS1) + 80 (OS3) + 30 (OS5) = 210
      expect(item1.consumed).toBe(210);
      expect(item1.total).toBe(TOTALS_QUANTITY.item1);
      expect(item1.percentage).toBeCloseTo((210 / TOTALS_QUANTITY.item1) * 100);
      expect(item1.remaining).toBe(TOTALS_QUANTITY.item1 - 210);

      // Item 2: 50 (OS2) + 20 (OS5) = 70
      expect(item2.consumed).toBe(70);
      expect(item2.total).toBe(TOTALS_QUANTITY.item2);
      expect(item2.percentage).toBeCloseTo((70 / TOTALS_QUANTITY.item2) * 100);
      expect(item2.remaining).toBe(TOTALS_QUANTITY.item2 - 70);

      // Item 3: 20 (OS4)
      expect(item3.consumed).toBe(20);
      expect(item3.total).toBe(TOTALS_QUANTITY.item3);
      expect(item3.percentage).toBeCloseTo((20 / TOTALS_QUANTITY.item3) * 100);
      expect(item3.remaining).toBe(TOTALS_QUANTITY.item3 - 20);
    });
  });

  // Test for Accumulated Value Progress (Chart 4)
  describe('accumulatedValue', () => {
     it('should correctly calculate consumed, total, percentage, and remaining values for each item', () => {
      const { item1, item2, item3 } = processedData.accumulatedValue;

      // Item 1: 2000 (OS1) + 1600 (OS3) + 600 (OS5) = 4200
      expect(item1.consumed).toBe(4200);
      expect(item1.total).toBe(TOTALS_VALUE.item1);
      expect(item1.percentage).toBeCloseTo((4200 / TOTALS_VALUE.item1) * 100);
      expect(item1.remaining).toBe(TOTALS_VALUE.item1 - 4200);

      // Item 2: 750 (OS2) + 300 (OS5) = 1050
      expect(item2.consumed).toBe(1050);
      expect(item2.total).toBe(TOTALS_VALUE.item2);
      expect(item2.percentage).toBeCloseTo((1050 / TOTALS_VALUE.item2) * 100);
      expect(item2.remaining).toBe(TOTALS_VALUE.item2 - 1050);

      // Item 3: 800 (OS4)
      expect(item3.consumed).toBe(800);
      expect(item3.total).toBe(TOTALS_VALUE.item3);
      expect(item3.percentage).toBeCloseTo((800 / TOTALS_VALUE.item3) * 100);
      expect(item3.remaining).toBe(TOTALS_VALUE.item3 - 800);
    });
  });

  // Test for Dashboard Frames Data (Indicator 5)
  describe('dashboardFrames', () => {
    it('should calculate totalGeneralValueConsumed correctly', () => {
      // Sum of all os.itens[any].valorTotal:
      // OS1: 2000
      // OS2: 750
      // OS3: 1600
      // OS4: 800
      // OS5: 600 (item 1) + 300 (item 2) = 900
      // Total = 2000 + 750 + 1600 + 800 + 900 = 6050
      expect(processedData.dashboardFrames.totalGeneralValueConsumed).toBe(6050);
    });

    it('should calculate overallQuantityPercentage correctly', () => {
      const { item1, item2, item3 } = processedData.dashboardFrames.overallQuantityPercentage;
      // Percentages are based on the consumed amounts calculated for accumulatedQuantity
      expect(item1).toBeCloseTo((210 / TOTALS_QUANTITY.item1) * 100);
      expect(item2).toBeCloseTo((70 / TOTALS_QUANTITY.item2) * 100);
      expect(item3).toBeCloseTo((20 / TOTALS_QUANTITY.item3) * 100);
    });

    it('should calculate remainingValueByItem correctly', () => {
      const { item1, item2, item3 } = processedData.dashboardFrames.remainingValueByItem;
      expect(item1).toBe(TOTALS_VALUE.item1 - (2000 + 1600 + 600)); // 4200
      expect(item2).toBe(TOTALS_VALUE.item2 - (750 + 300));    // 1050
      expect(item3).toBe(TOTALS_VALUE.item3 - 800);
    });

    it('should calculate remainingQuantityByItem correctly', () => {
      const { item1, item2, item3 } = processedData.dashboardFrames.remainingQuantityByItem;
      expect(item1).toBe(TOTALS_QUANTITY.item1 - (100 + 80 + 30)); // 210
      expect(item2).toBe(TOTALS_QUANTITY.item2 - (50 + 20));    // 70
      expect(item3).toBe(TOTALS_QUANTITY.item3 - 20);
    });
  });
});
