import React from 'react';
import {
  Box,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Textarea } from '../../../../components';

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
      {/* Gravidade */}
      <Paper variant='outlined' sx={{ mb: 1, p: 1 }}>
        <Typography variant='subtitle1' gutterBottom>
          Qual o impacto se não resolver?
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
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
          {gravidade === '5' && (<div className='br-textarea' style={{ width: '100%', margin: '0 auto', height: '100%' }}>
            <textarea className='br-' placeholder='Justifique' style={{ height: '100%' }} />
          </div>)}
        </div>
      </Paper>

      {/* Urgência */}
      <Paper variant='outlined' sx={{ mb: 2, p: 2 }}>
        <Typography variant='subtitle1' gutterBottom>
          Quando precisa ser resolvido?
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
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
          {urgencia === '5' && (<div className='br-textarea' style={{ width: '100%', margin: '0 auto', height: '100%' }}>
            <textarea className='br-' placeholder='Justifique' style={{ height: '100%' }} />
          </div>)}
        </div>
      </Paper>

      {/* Tendência */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <Paper variant='outlined' sx={{ mb: 2, p: 2 }}>
          <Typography variant='subtitle1' gutterBottom>
            Como evolui com o tempo?
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
        {tendencia === '5' && (<div className='br-textarea' style={{ width: '100%', margin: '0 auto', height: '100%' }}>
          <textarea className='br-' placeholder='Justifique' style={{ height: '100%' }} />
        </div>)}

      </div>

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
