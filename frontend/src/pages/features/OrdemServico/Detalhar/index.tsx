import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import IconeVoltar from '@mui/icons-material/ArrowBack';

import { BrButton, BrTag } from '@govbr-ds/react-components';

import Timeline from '../components/Timeline';
import type { OrdemServico, StatusOrdemServico } from '../Listagem';

const CHAVE_STORAGE = 'sistema_os';

const obterTipoTagPorStatus = (status: StatusOrdemServico): 'info' | 'success' | 'warning' | 'danger' | 'primary' | undefined => {
  switch (status) {
    case 'Nova': return 'info';
    case 'Em Andamento': return 'primary';
    case 'Pendente': return 'warning';
    case 'Concluída': return 'success';
    case 'Cancelada': return 'danger';
    default: return undefined;
  }
};

const estiloCardSecao = {
  marginBottom: 3,
  padding: { xs: 2, md: 3 },
  backgroundColor: '#fff',
  border: '1px solid #DFE3E8',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const estiloTituloSecao = {
  fontWeight: 600,
  color: '#1F4C73',
  fontSize: { xs: '1.1rem', md: '1.25rem' },
  marginBottom: 2,
  borderBottom: '2px solid #005A9C',
  paddingBottom: 1,
};

const DetalheOS = () => {
  const { id } = useParams<{ id: string }>();
  const navegar = useNavigate();

  const [os, setOs] = useState<OrdemServico | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id) {
      navegar('/os');
      return;
    }
    const armazenado = localStorage.getItem(CHAVE_STORAGE);
    if (!armazenado) {
      setCarregando(false);
      return;
    }
    try {
      const lista: OrdemServico[] = JSON.parse(armazenado);
      const encontrada = lista.find((o) => o.id === id);
      setOs(encontrada || null);
    } catch {
      setOs(null);
    }
    setCarregando(false);
  }, [id, navegar]);

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', p: 3 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, color: '#333' }}>Carregando dados da Ordem de Serviço...</Typography>
      </Box>
    );
  }

  if (!os) {
    return (
      <Box sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
        <Paper sx={{ ...estiloCardSecao, padding: { xs: 3, md: 4 }, display: 'inline-block', textAlign: 'center' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#D32F2F' }}>
            Ordem de Serviço Não Encontrada
          </Typography>
          <Typography sx={{ color: '#555', mb: 3 }}>
            A Ordem de Serviço que você está tentando acessar não foi encontrada. Pode ter sido removida ou o ID é inválido.
          </Typography>
          <BrButton variant="primary" onClick={() => navegar('/os')}>
            Voltar para a Listagem
          </BrButton>
        </Paper>
      </Box>
    );
  }

  const { identificacao, itens, cronograma, instrucoes, status } = os;

  const ItemInfo: React.FC<{ rotulo: string, valor?: string | null }> = ({ rotulo, valor }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="body2" component="div" sx={{ color: '#5E6E80', mb: 0.5, fontSize: '0.875rem' }}>
        {rotulo}:
      </Typography>
      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500, color: '#212529', wordBreak: 'break-word' }}>
        {valor || <span style={{ fontStyle: 'italic', color: '#757575' }}>Não informado</span>}
      </Typography>
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: { xs: 2, md: 3 }, backgroundColor: '#EBF0F5' }}>
      <BrButton
        type="button"
        variant="text"
        density="small"
        onClick={() => navegar(-1)}
        style={{ marginBottom: '24px', color: '#005A9C' }}
      >
        <IconeVoltar fontSize="small" sx={{ mr: 0.5 }} />
        Voltar para lista
      </BrButton>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1F4C73', mr: 2 }}>
          Detalhes da OS Nº {identificacao.numeroOS || os.id}
        </Typography>
        {status && <BrTag type={obterTipoTagPorStatus(status)}>{status}</BrTag>}
      </Box>

      <Paper sx={estiloCardSecao} elevation={0}>
        <Typography sx={estiloTituloSecao} component="h2">Identificação da OS</Typography>
        <Grid container spacing={3}>
          <ItemInfo rotulo="Data de Emissão" valor={identificacao.dataEmissao} />
          <ItemInfo rotulo="Contratada" valor={identificacao.contratada} />
          <ItemInfo rotulo="Objeto do Contrato" valor={identificacao.objetoContrato} />
          <ItemInfo rotulo="Solicitante" valor={identificacao.solicitante} />
          <ItemInfo rotulo="Unidade Solicitante" valor={identificacao.unidade} />
          <ItemInfo rotulo="E-mail do Solicitante" valor={identificacao.email} />
        </Grid>
      </Paper>

      <Paper sx={estiloCardSecao} elevation={0}>
        <Typography sx={estiloTituloSecao} component="h2">Itens da OS</Typography>
        {itens.length === 0 ? (
          <Typography sx={{ color: '#555555', fontStyle: 'italic' }}>(Nenhum item cadastrado para esta OS)</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" aria-label="Itens da Ordem de Serviço" sx={{
              '& .MuiTableHead-root': { backgroundColor: '#F0F3F5' },
              '& .MuiTableCell-head': { fontWeight: 'bold', color: '#343A40', padding: '10px 12px' },
              '& .MuiTableCell-body': { padding: '10px 12px', color: '#333' },
              '& .MuiTableRow-root:nth-of-type(even)': { backgroundColor: '#F8F9FA' },
              minWidth: '600px',
            }}>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Métrica</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor Unitário</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itens.map((item, idx) => (
                  <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{item.descricao}</TableCell>
                    <TableCell>{item.metrica}</TableCell>
                    <TableCell align="right">{item.quantidade}</TableCell>
                    <TableCell align="right">{item.valorUnitario?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '-'}</TableCell>
                    <TableCell align="right">{item.valorTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Paper sx={estiloCardSecao} elevation={0}>
        <Typography sx={estiloTituloSecao} component="h2">Instruções / Especificações Complementares</Typography>
        {instrucoes ? (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#333333', lineHeight: 1.7, backgroundColor: '#F8F9FA', p: 2, borderRadius: '4px', border: '1px solid #E0E0E0' }}>
            {instrucoes}
          </Typography>
        ) : (
          <Typography sx={{ color: '#555555', fontStyle: 'italic' }}>(Nenhuma instrução complementar fornecida)</Typography>
        )}
      </Paper>

      <Paper sx={estiloCardSecao} elevation={0}>
        <Typography sx={estiloTituloSecao} component="h2">Cronograma da OS</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <ItemInfo rotulo="Data de Início Prevista" valor={cronograma.data_inicio} />
          <ItemInfo rotulo="Data de Fim Prevista" valor={cronograma.data_fim} />
        </Grid>
        <Timeline cronograma={cronograma} />
      </Paper>
    </Box>
  );
};

export default DetalheOS;
