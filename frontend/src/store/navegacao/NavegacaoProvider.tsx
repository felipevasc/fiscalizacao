import { useMemo } from "react";
import { NavegacaoContext, type NavegacaoContextType } from "./NavegacaoContext";
import useMensagensHandler from "./handlers/MensagensHandler";
import useLoadingHandler from "./handlers/LoadingHandler";
import useUrlApiHandler from "./handlers/UrlApiHandler";
import type { ProviderProps } from "../ProviderProps";
import useMenuHandler from "./handlers/MenuHandler";


const NavegacaoProvider: React.FC<ProviderProps> = ({ children }) => {
  const mensagensHandler = useMensagensHandler();
  const loadingHandler = useLoadingHandler();
  const urlApiHandler = useUrlApiHandler();
  const menuHandler = useMenuHandler();

  const valuesProps: NavegacaoContextType = useMemo(
    () => ({
      loading: loadingHandler,
      urlApi: urlApiHandler,
      mensagens: mensagensHandler,
      menu: menuHandler,
    }),
    [loadingHandler, urlApiHandler, mensagensHandler, menuHandler]
  );

  return (
    <NavegacaoContext.Provider value={valuesProps}>
      {children}
    </NavegacaoContext.Provider>
  );
};

export default NavegacaoProvider;
