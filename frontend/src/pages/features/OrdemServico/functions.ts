export const corPorPrioridade = (score: number): string => {
  if (score <= 30) return '#388E3C'; // Baixa (verde)
  if (score <= 60) return '#FBC02D'; // Média (amarelo)
  if (score <= 90) return '#F57C00'; // Alta (laranja)
  return '#D32F2F'; // Crítica (vermelho)
};

export const rotuloPorPrioridade = (score: number): string => {
  if (score <= 30) return 'Baixa';
  if (score <= 60) return 'Média';
  if (score <= 90) return 'Alta';
  return 'Crítica';
};
