import { useState } from "react";
import type {
  MensagemStoreType,
  MensagensStoreType,
} from "../types/MensagensStoreType";

const useMensagensHandler = (): MensagensStoreType => {
  const [mensagensErro, setMensagensErro] = useState<MensagemStoreType[]>([]);

  const getIdMessage = (mensagem: MensagemStoreType) =>
    `${mensagem.tipo}|${mensagem.texto}`;

  const removerMensagem = (idMessage: string) =>
    setMensagensErro((msgs) => msgs.filter((m) => m.id !== idMessage));

  const enqueue = (mensagem: MensagemStoreType) => {
    const id = getIdMessage(mensagem);
    removerMensagem(id);
    setMensagensErro((m) => [...m, { ...mensagem, id: id }]);
  };
  const setLida = (idMessage: string) =>
    setMensagensErro((msgs) =>
      msgs.map((m) => (m.id === idMessage ? { ...m, lida: true } : m))
    );
  const exibirMensagens = (mensagens?: any[]) => {
    mensagens?.forEach((m) => {
      enqueue({
        lida: false,
        texto: m.mensagem,
        tipo: m.tipo,
      });
    });
  };

  return {
    getAll: mensagensErro,
    obterProxima: () => mensagensErro.find((m) => !m.lida),
    clear: () => setMensagensErro([]),
    error: (msg) => enqueue({ tipo: "danger", texto: msg, lida: false }),
    setLida,
    removerMensagem,
    enqueue,
    exibirMensagens,
  };
};

export default useMensagensHandler;
