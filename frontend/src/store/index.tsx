import NavegacaoProvider from "./navegacao/NavegacaoProvider";
import type { ProviderProps } from "./ProviderProps";

const StoreProvider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <NavegacaoProvider>
      {children}
    </NavegacaoProvider>
  );
};

export default StoreProvider;
