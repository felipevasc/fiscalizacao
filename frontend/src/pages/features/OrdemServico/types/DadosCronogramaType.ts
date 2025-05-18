import type { LinhaCronograma } from "./LinhaCronograma";

export interface DadosCronogramaType {
  data_inicio: string;
  data_fim: string;
  tabela: LinhaCronograma[];
}
