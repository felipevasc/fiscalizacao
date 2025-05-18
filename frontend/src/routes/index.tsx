import { BrowserRouter, Route, Routes } from 'react-router';
import Inicio from '../pages/features/Inicio';
import TipoOrdemServico from '../pages/features/OrdemServico';
import Indicadores from '../pages/features/Indicadores';
import Listagem from '../pages/features/OrdemServico/Listagem';
import OsDetalhe from '../pages/features/OrdemServico/Detalhar';
import AcompanhamentoOS from '../pages/features/OrdemServico/Acompanhamento';

const RotasInternas = () => {
  return (
    <BrowserRouter window={window}>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/os' element={<Listagem />} />
        <Route path='/indicadores' element={<Indicadores />} />
        <Route path='/os/cadastrar' element={<TipoOrdemServico />} />
        <Route path='/os/detalhar/:id' element={<OsDetalhe />} />
        <Route path='/os/editar/:id' element={<TipoOrdemServico />} />
        <Route path="/os/acompanhamento" element={<AcompanhamentoOS />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RotasInternas;
