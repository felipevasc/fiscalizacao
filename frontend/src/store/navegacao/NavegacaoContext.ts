import { createContext } from "react";
import type { LoadingStoreType } from "./types/LoadingStoreType";
import type { UrlApiStoreType } from "./types/UrlApiType";
import type { MensagensStoreType } from "./types/MensagensStoreType";
import type { MenuStoreType } from "./types/MenuStoreType";

export type NavegacaoContextType = {
  loading: LoadingStoreType;
  urlApi: UrlApiStoreType;
  mensagens: MensagensStoreType;
  menu: MenuStoreType;
};

export const NavegacaoContext = createContext<NavegacaoContextType | null>(
  null
);
