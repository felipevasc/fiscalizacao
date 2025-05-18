import type { ComplexidadeOrdemServico } from './types/ComplexidadeOrdemServico';
import type { OrdemServico } from './types/OrdemServico';
import type { TipoOrdemServico } from './types/TipoOrdemServico';

export const corPorPrioridade = (score: number): string => {
  if (score <= 30) return '#388E3C';
  if (score <= 60) return '#FBC02D';
  if (score <= 90) return '#F57C00';
  return '#D32F2F';
};

export const rotuloPorPrioridade = (score: number): string => {
  if (score <= 30) return 'Baixa';
  if (score <= 60) return 'Média';
  if (score <= 90) return 'Alta';
  return 'Crítica';
};

const TABELA_UDP: Record<
  TipoOrdemServico,
  Record<ComplexidadeOrdemServico, { udp: number; prazo: number }>
> = {
  Desenho: {
    Baixa: { udp: 20, prazo: 60 },
    Média: { udp: 30, prazo: 100 },
    Alta: { udp: 60, prazo: 200 },
    '': { udp: 0, prazo: 0 },
  },
  Melhoria: {
    Baixa: { udp: 15, prazo: 60 },
    Média: { udp: 30, prazo: 100 },
    Alta: { udp: 60, prazo: 200 },
    '': { udp: 0, prazo: 0 },
  },
  Integração: {
    Baixa: { udp: 25, prazo: 60 },
    Média: { udp: 40, prazo: 100 },
    Alta: { udp: 80, prazo: 200 },
    '': { udp: 0, prazo: 0 },
  },
  '': {
    Baixa: { udp: 0, prazo: 0 },
    Média: { udp: 0, prazo: 0 },
    Alta: { udp: 0, prazo: 0 },
    '': { udp: 0, prazo: 0 },
  },
};

export function calcularUdpPrazo(
  tipo: TipoOrdemServico,
  comp: ComplexidadeOrdemServico
) {
  return TABELA_UDP[tipo][comp];
}

export const calcularPrazo = (ordemServico: OrdemServico) => {
  if (Number(ordemServico.itens?.[0]?.item ?? '0') === 1) {
    return 7;
  } else if (Number(ordemServico.itens?.[0]?.item ?? '0') === 2) {
    if (Number(ordemServico.udp ?? '0') < 30) {
      return 60;
    } else if (Number(ordemServico.udp ?? '0') < 60) {
      return 100;
    } else {
      return 200;
    }
  } else if (Number(ordemServico.itens?.[0]?.item ?? '0') === 3) {
    return 22;
  }
};
