import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@govbr-ds/core/dist/core.min.css';
import StoreProvider from './store';
import Layout from './pages/layout';
import { useEffect } from 'react';
import osIniciais from './assets/OS_TR.json';

const CHAVE_STORAGE = 'sistema_os';

function App() {
  useEffect(() => {
    const armazenado = localStorage.getItem(CHAVE_STORAGE);
    if (!armazenado) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(osIniciais));
    }
  }, []);
  return (
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
}

export default App;
