import React from 'react';
import OS_DATA from '../../assets/OS_TR.json';
import {
  processDataForChart1,
  processDataForChart2,
  processDataForChart3,
  processDataForChart4,
  processDataForIndicatorFrames,
  type OS,
  type Chart1Data,
  type Chart2Data,
  type Chart4DataItem,
  type IndicatorData,
  type Chart1Data as ProcessedChart1Data, // Rename to avoid conflict if Nivo has Chart1Data
  type Chart3DataItem, // Ensure Chart3DataItem is imported for processedChart3Data typing
} from '../../utils/dataProcessing';
import './DashboardPage.css';
import { ResponsiveLine,  type Serie } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar'; // Import ResponsiveBar

const DashboardPage: React.FC = () => {
  // Process data
  const osList = OS_DATA as OS[];
  const processedChart1Data: ProcessedChart1Data = processDataForChart1(osList);
  const chart2Data: Chart2Data = processDataForChart2(osList);
  const chart3Data: Chart3DataItem[] = processDataForChart3(osList);
  const chart4Data: Chart4DataItem[] = processDataForChart4(osList);
  const indicatorData: IndicatorData = processDataForIndicatorFrames(osList);

  // TODO: Replace console logs with actual chart components and KPI displays
  console.log('Chart 1 Data (Processed):', processedChart1Data);
  console.log('Chart 2 Data:', chart2Data);
  console.log('Chart 3 Data:', chart3Data);
  console.log('Chart 4 Data:', chart4Data);
  console.log('Indicator Data:', indicatorData);

  // Helper for formatting currency
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Helper for formatting percentage
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  // Transform data for Nivo Line Chart (Chart 1)
  const nivoChart1Data: Serie[] = React.useMemo(() => {
    if (!processedChart1Data) return [];
    const itemIds = new Set<string>();
    Object.values(processedChart1Data).forEach(monthData => {
      if (monthData) Object.keys(monthData).forEach(itemId => itemIds.add(itemId));
    });

    const sortedItemIds = Array.from(itemIds).sort(); // Sort item IDs for consistent line order

    const series: Serie[] = sortedItemIds.map(itemId => ({
      id: `Item ${itemId}`,
      data: Object.entries(processedChart1Data)
        .map(([monthYear, itemData]) => ({
          x: monthYear,
          y: itemData[itemId] || 0, // Default to 0 if item not present in a month
        }))
        .sort((a, b) => a.x.localeCompare(b.x)), // Sort data points by monthYear
    }));
    return series;
  }, [processedChart1Data]);

  // Transform data for Nivo Line Chart (Chart 2)
  const nivoChart2Data: Serie[] = React.useMemo(() => {
    if (!chart2Data) return [];
    const dataPoints = Object.entries(chart2Data)
      .map(([monthYear, totalValue]) => ({
        x: monthYear,
        y: totalValue,
      }))
      .sort((a, b) => a.x.localeCompare(b.x)); // Sort by monthYear

    return [{ id: 'Valor Total Consumido', data: dataPoints }];
  }, [chart2Data]);

  // Transform data for Nivo Bar Chart (Chart 3)
  const nivoChart3Data = React.useMemo(() => {
    if (!chart3Data) return [];
    return chart3Data.map((item: Chart3DataItem) => ({
      item: `Item ${item.item}`,
      Consumido: item.consumedQuantity,
      Total: item.totalQuantity,
      _percentageConsumed: item.percentageConsumed,
    }));
  }, [chart3Data]);

  // Transform data for Nivo Bar Chart (Chart 4)
  const nivoChart4Data = React.useMemo(() => {
    if (!chart4Data) return [];
    return chart4Data.map((item: Chart4DataItem) => ({
      item: `Item ${item.item}`,
      'Consumido (R$)': item.consumedValue,
      'Total (R$)': item.totalValue,
      _percentageConsumed: item.percentageConsumed, // For tooltip
    }));
  }, [chart4Data]);

  // Count of OS on time
  const onTimeCount = osList.filter((os) => {
    if (!os.dataConclusao || !os.cronograma.data_fim) return false;
    return new Date(os.dataConclusao) <= new Date(os.cronograma.data_fim); // Corrigido: comparar com data_fim
  }).length;


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard de Análise de OS</h1>
      </header>

      <section className="kpi-container">
        <div className="kpi-card">
          <h3>Valor Total Consumido Geral</h3>
          <p>{formatCurrency(indicatorData.totalOverallConsumedValue)}</p>
        </div>
        {indicatorData.itemsSummary.map((itemSummary) => (
          <React.Fragment key={`item-summary-${itemSummary.item}`}>
            <div className="kpi-card">
              <h3>Item {itemSummary.item} - % Qtd. Consumida</h3>
              <p>{formatPercentage(itemSummary.percentageQuantityConsumed)}</p>
              <p className="sub-text">de {itemSummary.consumedQuantity + itemSummary.remainingQuantity} unidades</p>
            </div>
            <div className="kpi-card">
              <h3>Item {itemSummary.item} - Qtd. Restante</h3>
              <p>{itemSummary.remainingQuantity.toLocaleString('pt-BR')} unidades</p>
            </div>
            <div className="kpi-card">
              <h3>Item {itemSummary.item} - Valor Restante</h3>
              <p>{formatCurrency(itemSummary.remainingValue)}</p>
            </div>
          </React.Fragment>
        ))}
      </section>

      <section className="charts-container">
        <div className="chart-wrapper" id="chart1-container">
          <h2>Contrato Execução por Mês (Quantidade por Item)</h2>
          <ResponsiveLine
            data={nivoChart1Data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f" // Format Y-axis values
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Mês/Ano',
              legendOffset: 45,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Quantidade Consumida',
              legendOffset: -50,
              legendPosition: 'middle',
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>

        <div className="chart-wrapper" id="chart2-container">
          <h2>Valor Total Consumido por Mês</h2>
          <ResponsiveLine
            data={nivoChart2Data}
            margin={{ top: 50, right: 60, bottom: 50, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false,
            }}
            yFormat={value => formatCurrency(Number(value))} // Format Y-axis as currency
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Mês/Ano',
              legendOffset: 45,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Valor Total Consumido (R$)',
              legendOffset: -70,
              legendPosition: 'middle',
              format: value => formatCurrency(Number(value)), // Ensure axis ticks are also formatted
            }}
            colors={['#007bff']} // Example: A single blue color
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            useMesh={true}
            enableSlices="x"
            sliceTooltip={({ slice }) => (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                }}
              >
                <div>Mês/Ano: {slice.points[0].data.xFormatted}</div>
                <div>Valor: {formatCurrency(slice.points[0].data.yFormatted as number)}</div>
              </div>
            )}
          />
        </div>

        <div className="chart-row-2">
          <div className="chart-wrapper" id="chart3-container">
            <h2>Quantidade Consumida Acumulada por Item</h2>
            <ResponsiveBar
              data={nivoChart3Data}
              keys={['Consumido', 'Total']} // Order might matter for visual layering if not careful
              indexBy="item"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              groupMode="grouped" // To show 'Consumed' and 'Total' side-by-side per item
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }} // Or ['#5cb85c', '#f0ad4e'] etc.
              defs={[
                // Optional: for patterns or gradients
              ]}
              fill={[
                // Optional: for patterns
              ]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Item',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Quantidade',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [{ on: 'hover', style: { itemOpacity: 1 } }],
                },
              ]}
              tooltip={({ id, value, data }) => (
                <div style={{ background: 'white', padding: '5px 10px', border: '1px solid #ccc' }}>
                  <strong>{data.item}</strong><br />
                  {id}: {value}<br />
                  {id === 'Consumido' && data._percentageConsumed !== undefined && (
                    `(${formatPercentage(data._percentageConsumed as number)} do total contratado)`
                  )}
                   {id === 'Total' && data._percentageConsumed !== undefined && (
                    `(${formatPercentage( ( (data.Consumido as number)/(data.Total as number) )*100 )} consumido)`
                  )}
                </div>
              )}
              role="application"
              ariaLabel="Nivo bar chart demo" // More descriptive label
              barAriaLabel={e => `${e.id}: ${e.formattedValue} in item: ${e.indexValue}`}
            />
          </div>

          <div className="chart-wrapper" id="chart4-container">
            <h2>Valor Consumido Acumulado por Item</h2>
            <ResponsiveBar
              data={nivoChart4Data}
              keys={['Consumido (R$)', 'Total (R$)']}
              indexBy="item"
              margin={{ top: 50, right: 130, bottom: 50, left: 90 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'pastel1' }} // Different color scheme
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Item',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Valor (R$)',
                legendPosition: 'middle',
                legendOffset: -80, // Adjusted for wider labels
                format: value => formatCurrency(Number(value)), // Format Y-axis ticks as currency
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [{ on: 'hover', style: { itemOpacity: 1 } }],
                },
              ]}
              tooltip={({ id, value, data, indexValue }) => (
                <div style={{ background: 'white', padding: '5px 10px', border: '1px solid #ccc' }}>
                  <strong>{indexValue}</strong><br /> {/* Use indexValue for item name */}
                  {id}: {formatCurrency(value as number)}<br />
                  {/* Show percentage consumed for this item, it's stored in data */}
                  {(id === 'Consumido (R$)' || id === 'Total (R$)') && data._percentageConsumed !== undefined && (
                     `(${formatPercentage( ( (data['Consumido (R$)'] as number)/(data['Total (R$)'] as number) )*100 )} consumido)`
                  )}
                </div>
              )}
              role="application"
              ariaLabel="Nivo bar chart for accumulated value"
              barAriaLabel={e => `${e.id}: ${formatCurrency(e.formattedValue as number)} in item: ${e.indexValue}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

// Correção - adicionar função helper
const parseDate = (dateStr: string) => {
  if (!dateStr) return null;
  // Converte DD/MM/YYYY para YYYY-MM-DD
  return new Date(dateStr.split('/').reverse().join('-'));
};

// Correção para validação de GUT Score
const calculateGutScore = (os: OrdemServicoIndicadores): number | null => {
  const { gravidade, urgencia, tendencia } = os;
  if (!gravidade || !urgencia || !tendencia) return null;
  
  const g = Number(gravidade);
  const u = Number(urgencia);
  const t = Number(tendencia);
  
  if (isNaN(g) || isNaN(u) || isNaN(t)) return null;
  if (g < 1 || g > 5 || u < 1 || u > 5 || t < 1 || t > 5) return null;
  
  return g * u * t;
};

// Função helper para cálculo seguro de médias
const calculateAverage = (values: number[]): number => {
  const validValues = values.filter(v => typeof v === 'number' && !isNaN(v));
  return validValues.length > 0 
    ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
    : 0;
};

// Correção no agrupamento mensal
const processMonthlyData = (osList: OrdemServicoIndicadores[]) => {
  const monthlyData: Record<string, {
    sumGutScore: number;
    countGutOs: number;
    newOS: number;
    completedOS: number;
    totalOS: number;
    onTimeOS: number;
  }> = {};

  osList.forEach(os => {
    const emissaoDate = parseDate(os.identificacao.dataEmissao);
    if (!emissaoDate) return;

    const monthKey = `${emissaoDate.getFullYear()}/${String(emissaoDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        sumGutScore: 0,
        countGutOs: 0,
        newOS: 0,
        completedOS: 0,
        totalOS: 0,
        onTimeOS: 0
      };
    }

    monthlyData[monthKey].totalOS++;
    monthlyData[monthKey].newOS++;

    const gutScore = calculateGutScore(os);
    if (gutScore !== null) {
      monthlyData[monthKey].sumGutScore += gutScore;
      monthlyData[monthKey].countGutOs++;
    }

    if (os.dataConclusao) {
      monthlyData[monthKey].completedOS++;
      if (parseDate(os.dataConclusao)! <= parseDate(os.cronograma.data_fim)!) {
        monthlyData[monthKey].onTimeOS++;
      }
    }
  });

  return monthlyData;
};

// Nova função para cálculo de previsão
const calculateForecast = (monthlyData: MonthlyKPIEvolution[]): {
  avgGutScore?: number;
  newOSCount?: number;
  completedOSCount?: number;
} => {
  if (monthlyData.length === 0) return {};

  // Usar apenas os últimos 3 meses para previsão
  const last3Months = monthlyData.slice(-3);
  
  const calculateAverage = (key: keyof MonthlyKPIEvolution) => {
    const values = last3Months
      .map(m => m[key])
      .filter((v): v is number => v !== undefined);
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : undefined;
  };

  return {
    avgGutScore: calculateAverage('avgGutScore'),
    newOSCount: calculateAverage('newOSCount'),
    completedOSCount: calculateAverage('completedOSCount')
  };
};

const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

const validateNumber = (value: any): number | null => {
  const num = Number(value);
  return !isNaN(num) ? num : null;
};
