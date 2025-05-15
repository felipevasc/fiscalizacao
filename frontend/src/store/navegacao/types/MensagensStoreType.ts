export type TipoAlertMessage = "danger" | "info" | "warning" | "success";

export type MensagemStoreType = {
  tipo: TipoAlertMessage;
  texto: string;
  lida: boolean;
  id?: string;
};

/**
 * Representa a estrutura de uma fila de mensagens.
 *
 * @property getAll - Retorna todas as mensagens da fila.
 * @property obterProxima - Retorna a primeira mensagem da fila sem removê-la.
 * @property clear - Remove todas as mensagens da fila, esvaziando-a completamente.
 */
export type MensagensStoreType = {
  getAll: MensagemStoreType[];
  obterProxima: () => MensagemStoreType | undefined;
  clear: () => void;
  error: (mensagem: string) => void;
  setLida: (idMessage: string) => void;
  removerMensagem: (idMessage: string) => void;
  enqueue: (mensagem: MensagemStoreType) => void;
  exibirMensagens: (mensagens?: any[]) => void;
};
