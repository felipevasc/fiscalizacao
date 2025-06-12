import React, { useState, useEffect, type CSSProperties } from 'react';

// Interfaces fornecidas pelo usuário
export interface OrdemServico {
  id?: string;
  numeroOS: string;
  dataEmissao: string;
  dataEntregaRealizada?: string;
  dataEntregaProgramada: string;
  contratoNota: string;
  objetoContrato: string;
  contratada: string;
  cnpj: string;
  preposto: string;
  unidade: string;
  solicitante: string;
  itens: Item[];
  status: StatusOrdemServico;
  tipo: TipoOrdemServico;
  complexidade?: ComplexidadeOrdemServico;
  udp?: number;
  valorTotal: number;
}

export interface Item {
  item: string;
  descricao: string;
  metrica: string;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
}

export type StatusOrdemServico = 'Aberta' | 'Em Execução' | 'Finalizada' | 'Suspensa' | 'Rejeitada';
export type TipoOrdemServico = 'Licenciamento' | 'Automacao' | 'Capacitacao';
export type ComplexidadeOrdemServico = 'Baixa' | 'Média' | 'Alta';


// --- MOCK DATA ---
// Estes dados simulam o conteúdo do localStorage, extraídos dos documentos PDF fornecidos.
// Em um sistema real, estes dados seriam dinâmicos.
const MOCK_ORDENS_SERVICO: OrdemServico[] = [
  {
    id: '1', numeroOS: '1', dataEmissao: '2024-03-18', dataEntregaRealizada: '2024-04-30', dataEntregaProgramada: '2024-04-30', contratoNota: '1/2024', objetoContrato: 'Contratação de Solução BPMS', contratada: 'BPMX-SERVICE LTDA', cnpj: '13.797.698/0001-37', preposto: 'Pepe Rosto', unidade: 'MGI', solicitante: 'Fiscal', tipo: 'Licenciamento', status: 'Finalizada',
    itens: [{ item: '1', descricao: 'Licenciamento de Suíte BPMS', metrica: 'Usuário/mês', valorUnitario: 215.70, quantidade: 20, valorTotal: 4314.00 }], valorTotal: 4314.00
  },
  {
    id: '2', numeroOS: '2', dataEmissao: '2024-03-25', dataEntregaRealizada: '2024-05-10', dataEntregaProgramada: '2024-05-07', contratoNota: '1/2024', objetoContrato: 'Contratação de Solução BPMS', contratada: 'BPMX-SERVICE LTDA', cnpj: '13.797.698/0001-37', preposto: 'Pepe Rosto', unidade: 'MGI', solicitante: 'Fiscal', tipo: 'Automacao', complexidade: 'Média', udp: 10, status: 'Finalizada',
    itens: [{ item: '2', descricao: 'Modelagem de Processo', metrica: 'UDP', valorUnitario: 1812.00, quantidade: 10, valorTotal: 18120.00 }], valorTotal: 18120.00
  },
  {
    id: '4', numeroOS: '4', dataEmissao: '2024-04-01', dataEntregaRealizada: '2024-05-17', dataEntregaProgramada: '2024-05-13', contratoNota: '1/2024', objetoContrato: 'Contratação de Solução BPMS', contratada: 'BPMX-SERVICE LTDA', cnpj: '13.797.698/0001-37', preposto: 'Pepe Rosto', unidade: 'MGI', solicitante: 'Fiscal', tipo: 'Automacao', complexidade: 'Baixa', udp: 30, status: 'Finalizada',
    itens: [{ item: '2', descricao: 'Modelagem de Processo', metrica: 'UDP', valorUnitario: 1812.00, quantidade: 30, valorTotal: 54360.00 }], valorTotal: 54360.00
  },
  {
    id: '7', numeroOS: '7', dataEmissao: '2024-04-15', dataEntregaRealizada: '2024-05-03', dataEntregaProgramada: '2024-04-26', contratoNota: '1/2024', objetoContrato: 'Contratação de Solução BPMS', contratada: 'BPMX-SERVICE LTDA', cnpj: '13.797.698/0001-37', preposto: 'Pepe Rosto', unidade: 'MGI', solicitante: 'Fiscal', tipo: 'Capacitacao', status: 'Finalizada',
    itens: [{ item: '3', descricao: 'Capacitação', metrica: 'Hora/aula', valorUnitario: 360.00, quantidade: 20, valorTotal: 7200.00 }], valorTotal: 7200.00
  },
  {
    id: '12', numeroOS: '12', dataEmissao: '2024-05-08', dataEntregaRealizada: '2024-05-16', dataEntregaProgramada: '2024-05-14', contratoNota: '1/2024', objetoContrato: 'Contratação de Solução BPMS', contratada: 'BPMX-SERVICE LTDA', cnpj: '13.797.698/0001-37', preposto: 'Pepe Rosto', unidade: 'MGI', solicitante: 'Fismino Recking', tipo: 'Capacitacao', status: 'Rejeitada',
    itens: [{ item: '3', descricao: 'Capacitação de Operação', metrica: 'Hora/aula', valorUnitario: 360.00, quantidade: 8, valorTotal: 2880.00 }], valorTotal: 2880.00
  }
];

// Simula o localStorage.setItem para o exemplo. Em uma aplicação real, isso seria feito em outra parte do sistema.
if (!localStorage.getItem('sistema_os')) {
    localStorage.setItem('sistema_os', JSON.stringify(MOCK_ORDENS_SERVICO));
}


const AcompanhamentoComponent: React.FC = () => {
    const [ordensDeServico, setOrdensDeServico] = useState<OrdemServico[]>([]);
    const [indicadores, setIndicadores] = useState<any>({});
    const [multas, setMultas] = useState<any[]>([]);

    // Estilos para facilitar a visualização
    const styles: {[key: string]: CSSProperties} = {
        container: { fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f7f6' },
        card: { backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        title: { color: '#333', borderBottom: '2px solid #0056b3', paddingBottom: '10px' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
        th: { backgroundColor: '#e9ecef', padding: '10px', border: '1px solid #dee2e6', textAlign: 'left' },
        td: { padding: '10px', border: '1px solid #dee2e6' },
        statusCumprido: { color: 'green', fontWeight: 'bold' },
        statusDescumprido: { color: 'red', fontWeight: 'bold' },
        statusParcial: { color: 'orange', fontWeight: 'bold' },
    };

    useEffect(() => {
        // Carrega os dados do localStorage ao montar o componente
        const rawData = localStorage.getItem('sistema_os') || '[]';
        const parsedData: OrdemServico[] = JSON.parse(rawData);
        setOrdensDeServico(parsedData);

        // Processa os dados para gerar os relatórios
        processarDados(parsedData);
    }, []);

    const processarDados = (data: OrdemServico[]) => {
        const apuracaoIndicadores = {
            'Abril/2024': {
                'IDS - Disponibilidade SaaS': { meta: '99,5%', apurado: '99,36%', status: 'Descumprido', obs: 'Penalidade não aplicada (período de ambientação). ' },
                'IDA/IED - Atendimento': { meta: 'Sem atrasos', apurado: '0 atrasos', status: 'Cumprido', obs: 'Nenhuma ocorrência de atraso registrada. ' },
                'IAP - Prazos de Automação': { meta: 'Varia por OS', apurado: 'Atrasos identificados', status: 'Parcialmente Descumprido', obs: 'Penalidades não aplicadas (período de ambientação). ' },
            },
            'Maio/2024': {
                'IDS - Disponibilidade SaaS': { meta: '99,5%', apurado: '99,60%', status: 'Cumprido', obs: 'Serviço operou acima da meta. ' },
                'IAP - Prazos de Automação': { meta: 'Varia por OS', apurado: 'Atrasos identificados (OS 2, 4)', status: 'Parcialmente Descumprido', obs: 'Justificativas da contratada em análise; penalidade não se aplica (ambientação). ' },
                'ISA - Satisfação de Alunos': { meta: '≥ 55%', apurado: '35%', status: 'Descumprido (Rejeição)', obs: 'OS 12 rejeitada. ' },
            }
        };

        setIndicadores(apuracaoIndicadores);

        const apuracaoMultas = [];
        const osRejeitada = data.find(os => os.status === 'Rejeitada');

        if (osRejeitada) {
            const multa = {
                osNumero: osRejeitada.numeroOS,
                motivo: 'Rejeição por descumprimento do Indicador de Satisfação de Alunos (ISA).',
                fundamentacao: 'Item 8.9.4 do Termo de Referência. ',
                valorOS: osRejeitada.valorTotal,
                percentualMulta: '10%',
                valorMulta: osRejeitada.valorTotal * 0.10,
            };
            apuracaoMultas.push(multa);
        }
        setMultas(apuracaoMultas);
    };

    if (ordensDeServico.length === 0) {
        return <div style={styles.container}><p>Nenhuma Ordem de Serviço encontrada no localStorage.</p></div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Acompanhamento Mensal de Indicadores</h2>
                {Object.keys(indicadores).map(mes => (
                    <div key={mes}>
                        <h3>{mes}</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Indicador</th>
                                    <th style={styles.th}>Meta (NMS)</th>
                                    <th style={styles.th}>Apurado</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Observações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(indicadores[mes]).map(indicadorKey => {
                                    const indicador = indicadores[mes][indicadorKey];
                                    const statusStyle = indicador.status.includes('Cumprido') ? styles.statusCumprido :
                                                        indicador.status.includes('Descumprido') ? styles.statusDescumprido :
                                                        styles.statusParcial;
                                    return (
                                        <tr key={indicadorKey}>
                                            <td style={styles.td}>{indicadorKey}</td>
                                            <td style={styles.td}>{indicador.meta}</td>
                                            <td style={styles.td}>{indicador.apurado}</td>
                                            <td style={styles.td}><span style={statusStyle}>{indicador.status}</span></td>
                                            <td style={styles.td}>{indicador.obs}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            <div style={styles.card}>
                <h2 style={styles.title}>Controle de Multas</h2>
                {multas.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>OS</th>
                                <th style={styles.th}>Motivo</th>
                                <th style={styles.th}>Fundamentação Contratual</th>
                                <th style={styles.th}>Valor da Multa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {multas.map((multa, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{multa.osNumero}</td>
                                    <td style={styles.td}>{multa.motivo}</td>
                                    <td style={styles.td}>{multa.fundamentacao}</td>
                                    <td style={styles.td}>{multa.valorMulta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma multa aplicada no período de apuração.</p>
                )}
            </div>
        </div>
    );
};

export default AcompanhamentoComponent;