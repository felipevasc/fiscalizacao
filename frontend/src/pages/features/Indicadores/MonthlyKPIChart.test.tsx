// frontend/src/pages/features/Indicadores/MonthlyKPIChart.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MonthlyKPIChart from './MonthlyKPIChart';

// Mock Recharts
const mockRecharts = {
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="recharts-responsive-container">{children}</div>,
  LineChart: jest.fn(({ children }) => <div data-testid="recharts-line-chart">{children}</div>),
  XAxis: jest.fn(() => <div data-testid="recharts-xaxis" />),
  YAxis: jest.fn(() => <div data-testid="recharts-yaxis" />),
  CartesianGrid: jest.fn(() => <div data-testid="recharts-cartesiangrid" />),
  Tooltip: jest.fn((props) => <div data-testid="recharts-tooltip" />), // Mock Tooltip, can check props if needed
  Legend: jest.fn(() => <div data-testid="recharts-legend" />),
  Line: jest.fn(() => <div data-testid="recharts-line" />),
};
jest.mock('recharts', () => mockRecharts);

describe('MonthlyKPIChart', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockRecharts.LineChart.mockClear();
    mockRecharts.Line.mockClear();
  });

  const mockData = [
    { mes: '2023/01', value: 10 },
    { mes: '2023/02', value: 15 },
    { mes: '2023/03', value: undefined }, // Test undefined value
    { mes: '2023/04', value: 20 },
  ];

  const chartProps = {
    data: mockData,
    title: 'Test Monthly KPI',
    lineName: 'Test KPI Value',
    lineColor: '#ff0000',
    yAxisUnit: 'units',
  };

  describe('Props and Rendering', () => {
    test('should render the title correctly', () => {
      render(<MonthlyKPIChart {...chartProps} />);
      expect(screen.getByText(chartProps.title)).toBeInTheDocument();
    });

    test('should pass correct props to LineChart and Line components', () => {
      render(<MonthlyKPIChart {...chartProps} />);

      expect(mockRecharts.LineChart).toHaveBeenCalledWith(
        expect.objectContaining({
          data: chartProps.data,
        }),
        expect.anything()
      );

      expect(mockRecharts.Line).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'monotone',
          dataKey: 'value',
          name: chartProps.lineName,
          stroke: chartProps.lineColor,
          connectNulls: false,
        }),
        expect.anything()
      );
    });

    test('should render "no data" message with empty data array', () => {
      render(<MonthlyKPIChart {...chartProps} data={[]} />);
      expect(screen.getByText('Não há dados suficientes para este gráfico.')).toBeInTheDocument();
    });

    test('should render "no data" message if all data values are undefined', () => {
      const allUndefinedData = [
        { mes: '2023/01', value: undefined },
        { mes: '2023/02', value: undefined },
      ];
      render(<MonthlyKPIChart {...chartProps} data={allUndefinedData} />);
      expect(screen.getByText('Não há dados suficientes para este gráfico.')).toBeInTheDocument();
    });

    test('should render chart structure with valid data (some undefined)', () => {
      render(<MonthlyKPIChart {...chartProps} />);
      expect(screen.getByTestId('recharts-responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
      expect(mockRecharts.XAxis).toHaveBeenCalled();
      expect(mockRecharts.YAxis).toHaveBeenCalledWith(expect.objectContaining({ unit: chartProps.yAxisUnit }), expect.anything());
      expect(mockRecharts.CartesianGrid).toHaveBeenCalled();
      expect(mockRecharts.Tooltip).toHaveBeenCalled();
      expect(mockRecharts.Legend).toHaveBeenCalled();
      expect(mockRecharts.Line).toHaveBeenCalled();
    });

    test('should render chart structure with all defined data', () => {
      const allDefinedData = [
        { mes: '2023/01', value: 10 },
        { mes: '2023/02', value: 20 },
      ];
      render(<MonthlyKPIChart {...chartProps} data={allDefinedData} />);
      expect(screen.getByTestId('recharts-responsive-container')).toBeInTheDocument();
      // ... other checks as above
      expect(mockRecharts.Line).toHaveBeenCalled();
    });

    test('matches snapshot with valid data', () => {
      const { container } = render(<MonthlyKPIChart {...chartProps} />);
      expect(container).toMatchSnapshot();
    });

    test('matches snapshot with empty data', () => {
      const { container } = render(<MonthlyKPIChart {...chartProps} data={[]} />);
      expect(container).toMatchSnapshot();
    });

    test('matches snapshot with all undefined data', () => {
      const allUndefinedData = [
        { mes: '2023/01', value: undefined },
        { mes: '2023/02', value: undefined },
      ];
      const { container } = render(<MonthlyKPIChart {...chartProps} data={allUndefinedData} />);
      expect(container).toMatchSnapshot();
    });
  });
});
