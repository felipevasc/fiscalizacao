import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Listagem from './index';
import { rotuloPorPrioridade } from '../functions'; // To verify priority labels
import type { OrdemServico } from '../types/OrdemServico';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
let store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value.toString();
  },
  clear: () => {
    store = {};
  },
  removeItem: (key: string) => {
    delete store[key];
  },
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const CHAVE_STORAGE = 'sistema_os';

const mockOSData: OrdemServico[] = [
  {
    id: '1',
    identificacao: { numeroOS: 'OS001', dataEmissao: '2023-01-01', objetoContrato: 'Contrato 1' },
    status: 'Aberta',
    gutScore: 75, // Crítica
    udp: 'UnidadeA',
    itens: [{ item: '1', descricao: 'Item 1', quantidade: 1, valorUnitario: 10, valorTotal: 10 }],
    preposto: { nome: 'Preposto 1', email: 'p1@test.com', telefone: '123' },
    localServico: 'Local 1',
    descricaoServico: 'Desc 1',
    documentosAnexos: [],
    observacoes: 'Obs 1',
  },
  {
    id: '2',
    identificacao: { numeroOS: 'OS002', dataEmissao: '2023-01-02', objetoContrato: 'Contrato 2' },
    status: 'Em Andamento',
    gutScore: 50, // Média
    udp: 'UnidadeB',
    itens: [{ item: '2', descricao: 'Item 2', quantidade: 2, valorUnitario: 20, valorTotal: 40 }],
    preposto: { nome: 'Preposto 2', email: 'p2@test.com', telefone: '456' },
    localServico: 'Local 2',
    descricaoServico: 'Desc 2',
    documentosAnexos: [],
    observacoes: 'Obs 2',
  },
  {
    id: '3',
    identificacao: { numeroOS: 'OS003', dataEmissao: '2023-01-03', objetoContrato: 'Contrato 3' },
    status: 'Fechada',
    gutScore: 20, // Baixa
    udp: 'UnidadeA',
    itens: [{ item: '3', descricao: 'Item 3', quantidade: 3, valorUnitario: 30, valorTotal: 90 }],
    preposto: { nome: 'Preposto 3', email: 'p3@test.com', telefone: '789' },
    localServico: 'Local 3',
    descricaoServico: 'Desc 3',
    documentosAnexos: [],
    observacoes: 'Obs 3',
  },
  {
    id: '4',
    identificacao: { numeroOS: 'OS004', dataEmissao: '2023-01-04', objetoContrato: 'Contrato 4' },
    status: 'Aberta',
    gutScore: 95, // Crítica
    udp: undefined, // Test "Unidade Não Especificada"
    itens: [],
    preposto: { nome: 'Preposto 4', email: 'p4@test.com', telefone: '000' },
    localServico: 'Local 4',
    descricaoServico: 'Desc 4',
  }
];

describe('Listagem Component', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockNavigate.mockClear();
  });

  describe('Empty State', () => {
    it('should display "Nenhuma Ordem de Serviço Encontrada" when localStorage is empty', () => {
      render(<Listagem />);
      expect(screen.getByText('Nenhuma Ordem de Serviço Encontrada')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Table Rendering with Data', () => {
    beforeEach(() => {
      mockLocalStorage.setItem(CHAVE_STORAGE, JSON.stringify(mockOSData));
    });

    it('should render the table when data is present in localStorage', () => {
      render(<Listagem />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.queryByText('Nenhuma Ordem de Serviço Encontrada')).not.toBeInTheDocument();
    });

    it('should display the main table headers', () => {
      render(<Listagem />);
      const table = screen.getByRole('table');
      expect(within(table).getByRole('columnheader', { name: 'Número da OS' })).toBeInTheDocument();
      expect(within(table).getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
      expect(within(table).getByRole('columnheader', { name: 'Prioridade Prevista' })).toBeInTheDocument();
      expect(within(table).getByRole('columnheader', { name: 'Ações' })).toBeInTheDocument();
    });
  });

  describe('Grouping Functionality', () => {
    beforeEach(() => {
      mockLocalStorage.setItem(CHAVE_STORAGE, JSON.stringify(mockOSData));
    });

    it('should render group header rows for each unit', () => {
      render(<Listagem />);
      expect(screen.getByText('UnidadeA (Unidade de Origem)')).toBeInTheDocument();
      expect(screen.getByText('UnidadeB (Unidade de Origem)')).toBeInTheDocument();
      expect(screen.getByText('Unidade Não Especificada (Unidade de Origem)')).toBeInTheDocument();
    });

    it('should list OS under their respective group headers', () => {
      render(<Listagem />);
      // Check OS001 and OS003 under UnidadeA
      const unidadeARow = screen.getByText('UnidadeA (Unidade de Origem)').closest('tr');
      expect(unidadeARow).not.toBeNull();
      if (unidadeARow) {
        const os1Row = within(unidadeARow.parentElement!).getByText('OS001').closest('tr');
        expect(os1Row).not.toBeNull();
        const os3Row = within(unidadeARow.parentElement!).getByText('OS003').closest('tr');
        expect(os3Row).not.toBeNull();
      }

      // Check OS002 under UnidadeB
      const unidadeBRow = screen.getByText('UnidadeB (Unidade de Origem)').closest('tr');
      expect(unidadeBRow).not.toBeNull();
      if (unidadeBRow) {
        const os2Row = within(unidadeBRow.parentElement!).getByText('OS002').closest('tr');
        expect(os2Row).not.toBeNull();
      }
       // Check OS004 under Unidade Não Especificada
      const unidadeNaoEspRow = screen.getByText('Unidade Não Especificada (Unidade de Origem)').closest('tr');
      expect(unidadeNaoEspRow).not.toBeNull();
      if (unidadeNaoEspRow) {
        const os4Row = within(unidadeNaoEspRow.parentElement!).getByText('OS004').closest('tr');
        expect(os4Row).not.toBeNull();
      }
    });
  });

  describe('Data Display in Rows', () => {
    beforeEach(() => {
      mockLocalStorage.setItem(CHAVE_STORAGE, JSON.stringify(mockOSData));
    });

    it('should display correct OS details in table cells for a sample OS', () => {
      render(<Listagem />);
      const os1Row = screen.getByText('OS001').closest('tr');
      expect(os1Row).not.toBeNull();

      if (os1Row) {
        // OS Number is already confirmed by getByText('OS001')
        expect(within(os1Row).getByText('Aberta')).toBeInTheDocument(); // Status
        const expectedPriorityOS1 = `${rotuloPorPrioridade(mockOSData[0].gutScore)} (${mockOSData[0].gutScore})`;
        expect(within(os1Row).getByText(expectedPriorityOS1)).toBeInTheDocument(); // Prioridade
      }

      const os2Row = screen.getByText('OS002').closest('tr');
      expect(os2Row).not.toBeNull();
      if (os2Row) {
        expect(within(os2Row).getByText('Em Andamento')).toBeInTheDocument(); // Status
        const expectedPriorityOS2 = `${rotuloPorPrioridade(mockOSData[1].gutScore)} (${mockOSData[1].gutScore})`;
        expect(within(os2Row).getByText(expectedPriorityOS2)).toBeInTheDocument(); // Prioridade
      }
    });
  });

  describe('Action Buttons Functionality', () => {
    beforeEach(() => {
      mockLocalStorage.setItem(CHAVE_STORAGE, JSON.stringify(mockOSData));
    });

    const testActionButtons = (osIdentifier: string, osId: string) => {
      const osRow = screen.getByText(osIdentifier).closest('tr');
      expect(osRow).not.toBeNull();
      if (!osRow) return;

      // Detalhar
      const detalharButton = within(osRow).getByRole('button', { name: /detalhar/i });
      fireEvent.click(detalharButton);
      expect(mockNavigate).toHaveBeenCalledWith(`/os/detalhar/${osId}`);
      mockNavigate.mockClear();

      // Editar
      const editarButton = within(osRow).getByRole('button', { name: /editar/i });
      fireEvent.click(editarButton);
      expect(mockNavigate).toHaveBeenCalledWith(`/os/editar/${osId}`);
      mockNavigate.mockClear();

      // Avaliar
      const avaliarButton = within(osRow).getByRole('button', { name: /avaliar/i });
      fireEvent.click(avaliarButton);
      expect(mockNavigate).toHaveBeenCalledWith(`/os/avaliar/${osId}`);
      mockNavigate.mockClear();
    };

    it('should call navigate with correct paths for OS001 actions', () => {
      render(<Listagem />);
      testActionButtons('OS001', '1');
    });

    it('should call navigate with correct paths for OS002 actions', () => {
      render(<Listagem />);
      testActionButtons('OS002', '2');
    });
  });
});
