import React from 'react';
import {
  Box,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

// Perguntas e opções para inferir GUT
const gravidadeOptions = [
  { value: '1', label: 'Nenhum impacto relevante' },
  { value: '2', label: 'Pouca consequência' },
  { value: '3', label: 'Atrasos pontuais' },
  { value: '4', label: 'Risco elevado' },
  { value: '5', label: 'Crise institucional' },
];
const urgenciaOptions = [
  { value: '1', label: 'Sem prazo imediato' },
  { value: '2', label: 'Prazo flexível (até 1 semana)' },
  { value: '3', label: 'Curto prazo (até 3 dias)' },
  { value: '4', label: 'Até 24 horas' },
  { value: '5', label: 'Imediato / paralisação' },
];
const tendenciaOptions = [
  { value: '1', label: 'Estável' },
  { value: '2', label: 'Subida gradual' },
  { value: '3', label: 'Piora moderada' },
  { value: '4', label: 'Escalonamento rápido' },
  { value: '5', label: 'Emergência iminente' },
];

type MatrizGUTProps = {
  gravidade?: string;
  urgencia?: string;
  tendencia?: string;
  setGravidade: (val?: string) => void;
  setUrgencia: (val?: string) => void;
  setTendencia: (val?: string) => void;
};

const MatrizGUT: React.FC<MatrizGUTProps> = ({
  gravidade,
  urgencia,
  tendencia,
  setGravidade,
  setUrgencia,
  setTendencia,
}) => {
  const pontuacao =
    gravidade && urgencia && tendencia
      ? Number(gravidade) * Number(urgencia) * Number(tendencia)
      : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h5' gutterBottom>
        Prioridade - Matriz GUT
      </Typography>

      {/* Gravidade */}
      <Paper variant='outlined' sx={{ mb: 2, p: 2 }}>
        <Typography variant='subtitle1' gutterBottom>
          1) Qual o impacto se não resolver?
        </Typography>
        <ToggleButtonGroup
          value={gravidade || null}
          exclusive
          onChange={(_, val) => setGravidade(val)}
          sx={{ flexWrap: 'wrap' }}>
          {gravidadeOptions.map((opt) => (
            <ToggleButton
              key={opt.value}
              value={opt.value}
              sx={{ m: 0.5, flex: '1 1 40%' }}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      {/* Urgência */}
      <Paper variant='outlined' sx={{ mb: 2, p: 2 }}>
        <Typography variant='subtitle1' gutterBottom>
          2) Quando precisa ser resolvido?
        </Typography>
        <ToggleButtonGroup
          value={urgencia || null}
          exclusive
          onChange={(_, val) => setUrgencia(val)}
          sx={{ flexWrap: 'wrap' }}>
          {urgenciaOptions.map((opt) => (
            <ToggleButton
              key={opt.value}
              value={opt.value}
              sx={{ m: 0.5, flex: '1 1 40%' }}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      {/* Tendência */}
      <Paper variant='outlined' sx={{ mb: 2, p: 2 }}>
        <Typography variant='subtitle1' gutterBottom>
          3) Como evolui com o tempo?
        </Typography>
        <ToggleButtonGroup
          value={tendencia || null}
          exclusive
          onChange={(_, val) => setTendencia(val)}
          sx={{ flexWrap: 'wrap' }}>
          {tendenciaOptions.map((opt) => (
            <ToggleButton
              key={opt.value}
              value={opt.value}
              sx={{ m: 0.5, flex: '1 1 40%' }}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      {/* Resultado */}
      {pontuacao !== null && (
        <Paper variant='outlined' sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant='h6'>Pontuação GUT: {pontuacao}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MatrizGUT;
