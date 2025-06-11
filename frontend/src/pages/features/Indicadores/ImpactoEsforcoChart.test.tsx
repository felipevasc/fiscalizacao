// frontend/src/pages/features/Indicadores/ImpactoEsforcoChart.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ImpactoEsforcoChart from './ImpactoEsforcoChart';
import type { OrdemServicoIndicadores } from '../OrdemServico/types/OrdemServico';

// Mock Recharts
const mockRecharts = {
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="recharts-responsive-container">{children}</div>,
  ScatterChart: jest.fn(({ children }) => <div data-testid="recharts-scatter-chart">{children}</div>),
  XAxis: jest.fn(() => <div data-testid="recharts-xaxis" />),
  YAxis: jest.fn(() => <div data-testid="recharts-yaxis" />),
  CartesianGrid: jest.fn(() => <div data-testid="recharts-cartesiangrid" />),
  Tooltip: jest.fn(() => <div data-testid="recharts-tooltip" />),
  Legend: jest.fn(() => <div data-testid="recharts-legend" />),
  Scatter: jest.fn(() => <div data-testid="recharts-scatter" />),
  Label: jest.fn(() => <div data-testid="recharts-label" />),
  ReferenceLine: jest.fn(() => <div data-testid="recharts-referenceline" />),
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

describe('ImpactoEsforcoChart', () => {
  beforeEach(() => {
    mockRecharts.ScatterChart.mockClear();
  });

  describe('Data Processing', () => {
    test('should display "insufficient data" message for empty osList', () => {
      render(<ImpactoEsforcoChart osList={[]} />);
      expect(screen.getByText('Não há dados suficientes para exibir a Matriz Impacto x Esforço.')).toBeInTheDocument();
    });

    test('should correctly process valid osList data', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', identificacao: {...baseOsItem.identificacao, identificacao: "OS-1"}, gut: { gravidade: 3, urgencia: 4, tendencia: 5 }, udp: 50 }, // Impact: 60, Effort: 50
        { ...baseOsItem, id: '2', identificacao: {...baseOsItem.identificacao, identificacao: "OS-2"}, gut: { gravidade: 1, urgencia: 2, tendencia: 3 }, udp: 20 }, // Impact: 6, Effort: 20
        { ...baseOsItem, id: '3', identificacao: {...baseOsItem.identificacao, identificacao: "OS-3"}, gut: { gravidade: 5, urgencia: 5, tendencia: 5 }, udp: 150 }, // Impact: 125, Effort: 150
      ];
      render(<ImpactoEsforcoChart osList={osList} />);

      const expectedProcessedData = [
        { id: '1', identificacaoOs: "OS-1", impact: 60, effort: 50 },
        { id: '2', identificacaoOs: "OS-2", impact: 6, effort: 20 },
        { id: '3', identificacaoOs: "OS-3", impact: 125, effort: 150 },
      ];

      expect(mockRecharts.ScatterChart).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining(
            expectedProcessedData.map(d => expect.objectContaining(d))
          )
        }),
        expect.anything()
      );
       const MOCK_CALL_ARGS_INDEX = 0;
       const MOCK_CALL_PROPS_INDEX = 0;
       const passedData = mockRecharts.ScatterChart.mock.calls[MOCK_CALL_ARGS_INDEX][MOCK_CALL_PROPS_INDEX].data;
       expect(passedData.length).toBe(expectedProcessedData.length);
    });

    test('should filter out OS with invalid gutScore or udp values', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 }, udp: 50 }, // Valid
        { ...baseOsItem, id: '2', gut: { gravidade: 0, urgencia: 4, tendencia: 5 }, udp: 50 }, // Invalid G (impact 0)
        { ...baseOsItem, id: '3', gut: { gravidade: 3, urgencia: 4, tendencia: 5 }, udp: 0 },    // Invalid UDP (effort 0)
        { ...baseOsItem, id: '4', gut: { gravidade: 3, urgencia: 4, tendencia: 5 }, udp: undefined }, // Missing UDP
        { ...baseOsItem, id: '5', gut: undefined, udp: 50 }, // Missing GUT
      ];
      render(<ImpactoEsforcoChart osList={osList} />);

      const expectedProcessedData = [
        { id: '1', impact: 60, effort: 50 },
      ];

      expect(mockRecharts.ScatterChart).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining(
            expectedProcessedData.map(d => expect.objectContaining(d))
          )
        }),
        expect.anything()
      );
      const MOCK_CALL_ARGS_INDEX = 0;
      const MOCK_CALL_PROPS_INDEX = 0;
      const passedData = mockRecharts.ScatterChart.mock.calls[MOCK_CALL_ARGS_INDEX][MOCK_CALL_PROPS_INDEX].data;
      expect(passedData.length).toBe(expectedProcessedData.length);
    });
  });

  describe('Rendering', () => {
    test('should display "insufficient data" message for empty processed data', () => {
      render(<ImpactoEsforcoChart osList={[]} />);
      expect(screen.getByText('Não há dados suficientes para exibir a Matriz Impacto x Esforço.')).toBeInTheDocument();
    });

    test('should render chart structure with valid data', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 }, udp: 10 },
      ];
      render(<ImpactoEsforcoChart osList={osList} />);
      expect(screen.getByTestId('recharts-responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('recharts-scatter-chart')).toBeInTheDocument();
      expect(mockRecharts.XAxis).toHaveBeenCalled();
      expect(mockRecharts.YAxis).toHaveBeenCalled();
      expect(mockRecharts.CartesianGrid).toHaveBeenCalled();
      expect(mockRecharts.Tooltip).toHaveBeenCalled();
      expect(mockRecharts.Legend).toHaveBeenCalled();
      expect(mockRecharts.Scatter).toHaveBeenCalled();
      expect(mockRecharts.ReferenceLine).toHaveBeenCalledTimes(2); // For quadrants
    });

    test('matches snapshot with valid data', () => {
      const osList: OrdemServicoIndicadores[] = [
        { ...baseOsItem, id: '1', gut: { gravidade: 3, urgencia: 4, tendencia: 5 }, udp: 10 },
      ];
      const { container } = render(<ImpactoEsforcoChart osList={osList} />);
      expect(container).toMatchSnapshot();
    });

    test('matches snapshot with empty data', () => {
      const { container } = render(<ImpactoEsforcoChart osList={[]} />);
      expect(container).toMatchSnapshot();
    });
  });
});
