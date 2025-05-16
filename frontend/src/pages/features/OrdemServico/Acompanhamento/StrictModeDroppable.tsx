import React from 'react';
import { Droppable, type DroppableProps } from 'react-beautiful-dnd';

/**
 * Componente wrapper para resolver o problema de compatibilidade entre
 * react-beautiful-dnd e React StrictMode
 *
 * No React 18 com StrictMode, componentes são montados, desmontados e remontados
 * durante o desenvolvimento, o que quebra o comportamento do react-beautiful-dnd.
 *
 * Esta solução usa uma abordagem recomendada pela comunidade.
 */
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  // Use useRef para armazenar o estado de habilitado/desabilitado
  const [enabled, setEnabled] = React.useState(false);

  // Usa useEffect para habilitar o Droppable após a montagem
  React.useEffect(() => {
    // Pequeno timeout para permitir que o DOM esteja totalmente pronto
    const timeout = setTimeout(() => {
      setEnabled(true);
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // Só renderiza o Droppable quando habilitado
  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};
