import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

// Interfaces (mantidas do original)
interface LinhaCronograma {
  item: number;
  tarefaEntrega: string;
  inicio: string; // dd/mm/aaaa
  fim: string; // dd/mm/aaaa
}

interface DadosCronograma {
  data_inicio: string; // dd/mm/aaaa
  data_fim: string; // dd/mm/aaaa
  tabela: LinhaCronograma[];
}

interface TimelineProps {
  cronograma: DadosCronograma;
}

// Funções de data (validações e cálculos aprimorados)
const parseData = (dataStr: string): Date | null => {
  if (!dataStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) return null;
  const [dia, mes, ano] = dataStr.split('/');
  const dt = new Date(+ano, +mes - 1, +dia);
  return isNaN(dt.getTime()) ? null : dt;
};

const diffDias = (dt1: Date, dt2: Date): number => {
  // Diferença em milissegundos, convertida para dias, ignorando horas
  const utc1 = Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate());
  const utc2 = Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

const Timeline: React.FC<TimelineProps> = ({ cronograma }) => {
  const { data_inicio, data_fim, tabela } = cronograma;

  const dtInicioProjeto = parseData(data_inicio);
  const dtFimProjeto = parseData(data_fim);

  if (!dtInicioProjeto || !dtFimProjeto || dtFimProjeto < dtInicioProjeto) {
    return (
      <Typography
        color='error.main'
        sx={{
          p: 2,
          backgroundColor: 'rgba(211, 47, 47, 0.05)',
          border: '1px solid rgba(211, 47, 47, 0.3)',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
        Data inválida
      </Typography>
    );
  }

  // Adiciona 1 dia ao total para incluir o último dia no cálculo da largura
  const totalDiasProjeto = Math.max(
    1,
    diffDias(
      dtInicioProjeto,
      new Date(
        dtFimProjeto.getFullYear(),
        dtFimProjeto.getMonth(),
        dtFimProjeto.getDate() + 1
      )
    )
  );

  const calcularPosicaoPercentual = (dataTarefaStr: string): number => {
    const dataTarefa = parseData(dataTarefaStr);
    if (!dataTarefa || !dtInicioProjeto) return 0;
    const diasDesdeInicio = diffDias(dtInicioProjeto, dataTarefa);
    return Math.min(
      Math.max((diasDesdeInicio / totalDiasProjeto) * 100, 0),
      100
    );
  };

  const calcularLarguraPercentual = (
    inicioTarefaStr: string,
    fimTarefaStr: string
  ): number => {
    const dtInicioTarefa = parseData(inicioTarefaStr);
    const dtFimTarefa = parseData(fimTarefaStr);

    if (
      !dtInicioTarefa ||
      !dtFimTarefa ||
      dtFimTarefa < dtInicioTarefa ||
      !dtInicioProjeto
    )
      return 0;

    // Adiciona 1 dia à data fim da tarefa para incluir o dia inteiro na barra
    const dtFimTarefaAjustada = new Date(
      dtFimTarefa.getFullYear(),
      dtFimTarefa.getMonth(),
      dtFimTarefa.getDate() + 1
    );

    const diasDuracaoTarefa = diffDias(dtInicioTarefa, dtFimTarefaAjustada);
    const largura = (diasDuracaoTarefa / totalDiasProjeto) * 100;

    return Math.min(Math.max(largura, 0), 100); // Garante que a largura esteja entre 0 e 100%
  };

  return (
    <Box
      sx={{
        fontFamily: '"Rawline", Arial, sans-serif',
        fontSize: '14px',
        color: '#333',
        width: '100%',
        overflowX: 'auto',
        p: { xs: 0, sm: 1 },
      }}>
      {/* Eixo X com datas principais */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 0 8px 0',
          borderBottom: '1px solid #CDD4DB',
          mb: 2,
        }}>
        <Typography variant='caption' sx={{ color: '#5E6E80' }}>
          Início: {data_inicio}
        </Typography>
        <Typography variant='caption' sx={{ color: '#5E6E80' }}>
          Fim: {data_fim}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', paddingTop: '10px' }}>
        {tabela.map((linha, index) => {
          const leftPercent = calcularPosicaoPercentual(linha.inicio);
          const widthPercent = calcularLarguraPercentual(
            linha.inicio,
            linha.fim
          );

          if (
            widthPercent <= 0 &&
            leftPercent === 0 &&
            !parseData(linha.inicio) &&
            !parseData(linha.fim)
          ) {
            // Pula a renderização se as datas da linha forem inválidas e resultarem em largura zero.
            // Ou pode renderizar uma mensagem de erro para a linha.
            return (
              <Typography
                key={linha.item || index}
                color='error.main'
                variant='caption'
                component='div'
                sx={{ mb: 1 }}>
                Tarefa "{linha.tarefaEntrega}" com datas inválidas.
              </Typography>
            );
          }

          return (
            <Box
              key={linha.item || index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                height: '36px',
              }}>
              <Typography
                variant='body2'
                title={linha.tarefaEntrega}
                sx={{
                  width: { xs: '120px', sm: '180px', md: '220px' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#003366',
                  fontWeight: 500,
                  paddingRight: '12px',
                  flexShrink: 0,
                  maxWidth: '60%',
                }}>
                {linha.tarefaEntrega || '(Tarefa não descrita)'}
              </Typography>

              <Box
                sx={{
                  position: 'relative',
                  height: '18px', // Altura da trilha
                  backgroundColor: '#E9ECEF', // Cinza claro gov.br para trilha
                  flexGrow: 1,
                  borderRadius: '9px', // Bordas arredondadas
                  overflow: 'hidden',
                }}>
                <Tooltip
                  title={`Tarefa: ${linha.tarefaEntrega} | Início: ${linha.inicio} - Fim: ${linha.fim}`}
                  placement='top'>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      minWidth: widthPercent > 0 ? '2px' : '0px', // Garante visibilidade mínima
                      height: '100%',
                      backgroundColor: '#005A9C', // Azul primário gov.br
                      borderRadius: '9px',
                      transition: 'left 0.2s ease-out, width 0.2s ease-out',
                      cursor: 'pointer', // Indica que é clicável/interativo
                      '&:hover': {
                        backgroundColor: '#004080', // Azul mais escuro no hover
                      },
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Box>
      {tabela.length === 0 && (
        <Typography
          sx={{
            color: '#555555',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: 2,
            backgroundColor: '#F8F9FA',
            borderRadius: '4px',
          }}>
          (Nenhuma tarefa cadastrada no cronograma desta OS)
        </Typography>
      )}
    </Box>
  );
};

export default Timeline;
