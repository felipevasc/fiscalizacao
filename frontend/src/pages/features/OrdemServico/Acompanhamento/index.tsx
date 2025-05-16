import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  DragDropContext as ContextoArrastarSoltar,
  Draggable as Arrastavel,
  type DropResult as ResultadoArraste,
} from 'react-beautiful-dnd';
import type { OrdemServico, StatusOrdemServico } from '../Listagem';
import { StrictModeDroppable as DroppableModoEstrito } from './StrictModeDroppable';
import Timeline from '../components/Timeline';

interface MedidorPrioridadeProps {
  valor: number;
  max: number;
}

const MedidorPrioridade: React.FC<MedidorPrioridadeProps> = ({
  valor,
  max,
}) => {
  const raio = 40;
  const centro = 50;
  const espessura = 10;
  const interno = raio - espessura / 2;
  const percentual = Math.min(valor / max, 1);

  const angInicio = Math.PI;
  const angFim = Math.PI - percentual * Math.PI;
  const xStart = centro + interno * Math.cos(angInicio);
  const yStart = centro - interno * Math.sin(angInicio);
  const xEnd = centro + interno * Math.cos(angFim);
  const yEnd = centro - interno * Math.sin(angFim);
  const largeArc = percentual > 0.5 ? 1 : 0;

  return (
    <Box
      sx={{
        width: 100,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
      }}>
      <svg width='100' height='60'>
        <defs>
          <linearGradient
            id='gradPrioridade'
            gradientUnits='userSpaceOnUse'
            x1='0'
            y1='50'
            x2='100'
            y2='50'>
            <stop offset='0%' stopColor='#2E7D32' />
            <stop offset='40%' stopColor='#FBC02D' />
            <stop offset='70%' stopColor='#FB8C00' />
            <stop offset='80%' stopColor='#E65100' />
            <stop offset='90%' stopColor='#C62828' />
          </linearGradient>
        </defs>
        <path
          d={`M ${centro - interno} ${centro} A ${interno} ${interno} 0 0 1 ${
            centro + interno
          } ${centro}`}
          fill='none'
          stroke='#eee'
          strokeWidth={espessura}
        />
        {percentual > 0 && (
          <path
            d={`M ${xStart} ${yStart} A ${interno} ${interno} 0 ${largeArc} 1 ${xEnd} ${yEnd}`}
            fill='none'
            stroke='url(#gradPrioridade)'
            strokeWidth={espessura}
            strokeLinecap='round'
          />
        )}
        <text
          x={centro}
          y={centro}
          textAnchor='middle'
          fontSize='17'
          fill='#333'
          fontWeight='bold'>
          {valor}
        </text>
      </svg>
    </Box>
  );
};

const CORES_FUNDO_BAIA = [
  '#E3F2FD',
  '#E8F5E9',
  '#FFF3E0',
  '#F3F5E5',
  '#E1F5FE',
  '#FFFDE7',
  '#FBE9E7',
  '#EDE7F6',
];

const TITULOS_STATUS = [
  'Não Iniciada',
  'Em Análise',
  'Em Execução',
  'Para Aprovação',
  'Verificação',
  'Pendente',
  'Conclusão',
  'Encerrada',
];

function carregarOrdensDoStorage(): (OrdemServico & {
  gravidade: number;
  urgencia: number;
  tendencia: number;
  pontuacaoGUT: number;
})[] {
  const raw = localStorage.getItem('sistema_os');
  if (!raw) return [];
  try {
    const originais: OrdemServico[] = JSON.parse(raw);
    return originais.map((item) => {
      const gravidade = item.gravidade ?? 1;
      const urgencia = item.urgencia ?? 1;
      const tendencia = item.tendencia ?? 1;
      return {
        ...item,
        gravidade,
        urgencia,
        tendencia,
        pontuacaoGUT: gravidade * urgencia * tendencia,
      };
    });
  } catch {
    return [];
  }
}

const AcompanhamentoOrdensServico: React.FC = () => {
  const [ordens, definirOrdens] = useState(carregarOrdensDoStorage());

  useEffect(() => {
    definirOrdens(carregarOrdensDoStorage());
  }, []);

  function aoTerminarArraste(resultado: ResultadoArraste) {
    const { source, destination } = resultado;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const copia = [...ordens];
    const movida = copia.find(
      (o) =>
        o.status === source.droppableId &&
        o.id?.toString() === resultado.draggableId
    );
    if (movida) {
      movida.status = destination.droppableId as StatusOrdemServico;
      definirOrdens(copia);
      localStorage.setItem('sistema_os', JSON.stringify(copia));
    }
  }

  return (
    <ContextoArrastarSoltar onDragEnd={aoTerminarArraste}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          overflowX: 'auto',
          p: 3,
          backgroundColor: '#E9EFF3',
          gap: 2,
        }}>
        {TITULOS_STATUS.map((status, idx) => {
          const ordensNaBaia = ordens
            .filter((o) => o.status === status)
            .sort((a, b) => b.pontuacaoGUT - a.pontuacaoGUT);

          return (
            <DroppableModoEstrito droppableId={status} key={status}>
              {(prov) => (
                <Box
                  ref={prov.innerRef}
                  {...prov.droppableProps}
                  sx={{
                    minWidth: 300,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: CORES_FUNDO_BAIA[idx],
                    boxShadow: 1,
                    flexShrink: 0,
                  }}>
                  <Typography
                    variant='h6'
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: '#003366',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                    {status}
                    <Typography
                      component='span'
                      variant='body2'
                      sx={{
                        bgcolor: '#005EA2',
                        color: '#FFF',
                        px: 1,
                        borderRadius: 1,
                      }}>
                      {ordensNaBaia.length}
                    </Typography>
                  </Typography>

                  {ordensNaBaia.length === 0 ? (
                    <Typography
                      variant='body2'
                      sx={{ fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
                      Sem ordens aqui.
                    </Typography>
                  ) : (
                    ordensNaBaia.map((ordem, i) => (
                      <Arrastavel
                        key={ordem.id ?? i}
                        draggableId={ordem.id?.toString() ?? `${i}`}
                        index={i}>
                        {(prov, snap) => (
                          <Paper
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            sx={{
                              p: 2,
                              mb: 2,
                              borderRadius: 2,
                              boxShadow: snap.isDragging ? 3 : 1,
                              transform: snap.isDragging
                                ? 'scale(1.02)'
                                : 'none',
                              transition: 'all 0.2s',
                            }}>
                            <Typography
                              variant='subtitle2'
                              sx={{ fontWeight: 'bold' }}>
                              OS {ordem.identificacao.numeroOS || ordem.id}
                            </Typography>
                            <Typography variant='body2' sx={{ mb: 1 }}>
                              {ordem.identificacao.unidade}
                            </Typography>
                            <MedidorPrioridade
                              valor={ordem.pontuacaoGUT}
                              max={125}
                            />
                            <Box sx={{ mt: 1 }}>
                              <Timeline cronograma={ordem.cronograma} />
                            </Box>
                          </Paper>
                        )}
                      </Arrastavel>
                    ))
                  )}
                  {prov.placeholder}
                </Box>
              )}
            </DroppableModoEstrito>
          );
        })}
      </Box>
    </ContextoArrastarSoltar>
  );
};

export default AcompanhamentoOrdensServico;
