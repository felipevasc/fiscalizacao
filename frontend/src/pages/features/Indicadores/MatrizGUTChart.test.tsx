// frontend/src/pages/features/Indicadores/MatrizGUTChart.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MatrizGUTChart from './MatrizGUTChart';
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico';

// Mock Recharts
const mockRecharts = {
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="recharts-responsive-container">{children}</div>,
  ScatterChart: jest.fn(({ children }) => <div data-testid="recharts-scatter-chart">{children}</div>),
  XAxis: jest.fn(() => <div data-testid="recharts-xaxis" />),
  YAxis: jest.fn(() => <div data-testid="recharts-yaxis" />),
  ZAxis: jest.fn(() => <div data-testid="recharts-zaxis" />),
  CartesianGrid: jest.fn(() => <div data-testid="recharts-cartesiangrid" />),
  Tooltip: jest.fn(() => <div data-testid="recharts-tooltip" />),
  Legend: jest.fn(() => <div data-testid="recharts-legend" />),
  Scatter: jest.fn(() => <div data-testid="recharts-scatter" />), // Also mock Scatter itself if needed for prop checks on it
  Label: jest.fn(() => <div data-testid="recharts-label" />),
};
jest.mock('recharts', () => mockRecharts);

const baseOsItem: OrdemServicoIndicadores = {
  id: '1',
  identificacao: { identificacao: 'OS-001', data_emissao_os: '2023-01-01T10:00:00Z' },
  status: 'Aberta',
  tipo: 'Corretiva',
  resumo: 'Test OS',
  descricao: 'Detailed description',
  empresaContratada: { id: 'c1', nome: 'Contratada 1' },
  empresaExecutante: { id: 'e1', nome: 'Executante 1' },
  cronograma: { data_inicio: '2023-01-01', data_fim: '2023-01-10', prazo_contratual_dias: 10 },
  localizacao: { id: 'l1', nome: 'Local 1', coordenadas: { latitude: 0, longitude: 0 } },
  requisitante: { id: 'r1', nome: 'Req 1', area: 'Area 1', contato: 'contato@example.com' },
  responsavelTecnico: { id: 'rt1', nome: 'Resp Tech 1', contato: 'resp@example.com' },
  tags: [{ id: 't1', nome: 'Tag1' }],
  complexidade: 'Baixa',
  documentosAnexos: [],
  historicoEventos: [],
  itemsDeManutencao: [],
  criticidade: 'Baixa',
  valorEstimado: { valor: 100, moeda: 'BRL' },
  valorFinal: { valor: 90, moeda: 'BRL' },
};


describe('MatrizGUTChart', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockRecharts.ScatterChart.mockClear();
  });

  describe('Data Processing', () => {
    test('should pass empty array to ScatterChart for empty osList', () => {
      render(<MatrizGUTChart osList={[]} />);
      // Check if the message is shown (component's internal logic for empty processedData)
      expect(screen.getByText('Não há dados suficientes para exibir a Matriz GUT.')).toBeInTheDocument();
      // ScatterChart might not even be called if processedData is empty and component returns early
      // So, let's verify it wasn't called with data, or called at all if that's the case.
      // The component returns early, so ScatterChart's parent (ResponsiveContainer) won't render it.
      // Thus, we can't check props of ScatterChart here directly.
    });

    test('should correctly process valid osList data', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 } }, // G:3, U:4, T:5 -> GUT: 60
        { ...baseOsItem, id: '2', gut: { gravidade: 3, urgencia: 4, tendencia: 3 } }, // G:3, U:4, T:3 -> GUT: 36
        { ...baseOsItem, id: '3', gut: { gravidade: 1, urgencia: 2, tendencia: 3 } }, // G:1, U:2, T:3 -> GUT: 6
      ];
      render(<MatrizGUTChart osList={osList} />);

      const expectedProcessedData = [
        // Note: originalData is not part of the data passed to ScatterChart, it's used internally.
        {
          gravidade: 3, urgencia: 4, count: 2,
          avgTendencia: (5 + 3) / 2, // 4
          avgGutScore: (60 + 36) / 2, // 48
        },
        {
          gravidade: 1, urgencia: 2, count: 1,
          avgTendencia: 3,
          avgGutScore: 6,
        },
      ];

      // Check that the ScatterChart was called and its 'data' prop contains objects matching the expected structure.
      // We need to be careful here, as the order might not be guaranteed.
      expect(mockRecharts.ScatterChart).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining(
            expectedProcessedData.map(expectedItem =>
              expect.objectContaining({
                gravidade: expectedItem.gravidade,
                urgencia: expectedItem.urgencia,
                count: expectedItem.count,
                avgTendencia: expectedItem.avgTendencia,
                avgGutScore: expectedItem.avgGutScore,
                // originalData is not asserted here as it's not directly passed to ScatterChart's data points
              })
            )
          )
        }),
        expect.anything()
      );
      // Also check the length to ensure no extra items
      const MOCK_CALL_ARGS_INDEX = 0;
      const MOCK_CALL_PROPS_INDEX = 0;
      const passedData = mockRecharts.ScatterChart.mock.calls[MOCK_CALL_ARGS_INDEX][MOCK_CALL_PROPS_INDEX].data;
      expect(passedData.length).toBe(expectedProcessedData.length);
    });

    test('should filter out OS with invalid or out-of-range G, U, T values', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 } }, // Valid
        { ...baseOsItem, id: '2', gut: { gravidade: 0, urgencia: 4, tendencia: 5 } }, // Invalid G
        { ...baseOsItem, id: '3', gut: { gravidade: 3, urgencia: 6, tendencia: 5 } }, // Invalid U
        { ...baseOsItem, id: '4', gut: { gravidade: 3, urgencia: 4, tendencia: -1 } }, // Invalid T
        { ...baseOsItem, id: '5', gut: { gravidade: 3, urgencia: 4, tendencia: undefined as any } }, // Invalid T
        { ...baseOsItem, id: '6', gut: undefined }, // No GUT
      ];
      render(<MatrizGUTChart osList={osList} />);

      const expectedProcessedData = [
        { gravidade: 3, urgencia: 4, count: 1, avgTendencia: 5, avgGutScore: 60 },
      ];

      expect(mockRecharts.ScatterChart).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining(
            expectedProcessedData.map(d => expect.objectContaining(d))
          )
        }),
        expect.anything()
      );
    });

    test('should filter out OS with invalid or out-of-range G, U, T values', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 } }, // Valid
        { ...baseOsItem, id: '2', gut: { gravidade: 0, urgencia: 4, tendencia: 5 } }, // Invalid G
        { ...baseOsItem, id: '3', gut: { gravidade: 3, urgencia: 6, tendencia: 5 } }, // Invalid U
        { ...baseOsItem, id: '4', gut: { gravidade: 3, urgencia: 4, tendencia: -1 } }, // Invalid T
        { ...baseOsItem, id: '5', gut: { gravidade: 3, urgencia: 4, tendencia: undefined as any } }, // Invalid T
        { ...baseOsItem, id: '6', gut: undefined }, // No GUT
      ];
      render(<MatrizGUTChart osList={osList} />);

      const expectedProcessedData = [
        { gravidade: 3, urgencia: 4, count: 1, avgTendencia: 5, avgGutScore: 60 },
      ];

      expect(mockRecharts.ScatterChart).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining(
            expectedProcessedData.map(d => expect.objectContaining(d))
          )
        }),
        expect.anything()
      );
    });
  });

  describe('Rendering', () => {
    test('should display "insufficient data" message for empty processed data', () => {
      render(<MatrizGUTChart osList={[]} />);
      expect(screen.getByText('Não há dados suficientes para exibir a Matriz GUT.')).toBeInTheDocument();
    });

    test('should render chart structure with valid data', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 } },
      ];
      render(<MatrizGUTChart osList={osList} />);
      expect(screen.getByTestId('recharts-responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('recharts-scatter-chart')).toBeInTheDocument();
      expect(mockRecharts.XAxis).toHaveBeenCalled();
      expect(mockRecharts.YAxis).toHaveBeenCalled();
      expect(mockRecharts.ZAxis).toHaveBeenCalled();
      expect(mockRecharts.CartesianGrid).toHaveBeenCalled();
      expect(mockRecharts.Tooltip).toHaveBeenCalled();
      expect(mockRecharts.Legend).toHaveBeenCalled();
      expect(mockRecharts.Scatter).toHaveBeenCalled();
    });

    test('matches snapshot with valid data', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 } },
      ];
      const { container } = render(<MatrizGUTChart osList={osList} />);
      expect(container).toMatchSnapshot();
    });

    test('matches snapshot with empty data', () => {
      const { container } = render(<MatrizGUTChart osList={[]} />);
      expect(container).toMatchSnapshot();
    });
  });
});
