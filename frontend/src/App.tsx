import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@govbr-ds/core/dist/core.min.css';
import StoreProvider from './store';
import Layout from './pages/layout';

function App() {
  return (
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
}

export default App;
