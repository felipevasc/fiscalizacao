import type { ComplexidadeOrdemServico } from './ComplexidadeOrdemServico';
import type { DadosCronogramaType } from './DadosCronogramaType';
import type { IdentificacaoData } from './IdentificacaoData';
import type { Item } from './Item';
import type { StatusOrdemServico } from './StatusOrdemServico';
import type { TipoOrdemServico } from './TipoOrdemServico';

export interface OrdemServico {
  id?: string;
  identificacao: IdentificacaoData;
  itens: Item[];
  cronograma: DadosCronogramaType;
  instrucoes?: string;
  status: StatusOrdemServico;
  gravidade: number;
  urgencia: number;
  tendencia: number;
  gutScore: number;
  tipo?: TipoOrdemServico;
  complexidade?: ComplexidadeOrdemServico;
  udp?: number;
  prazoDiasUteis?: number;
}
