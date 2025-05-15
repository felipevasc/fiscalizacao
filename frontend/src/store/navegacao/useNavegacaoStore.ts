import { useContext } from "react";
import { NavegacaoContext } from "./NavegacaoContext";

const useNavegacaoStore = () => {
  const context = useContext(NavegacaoContext);
  if (!context) {
    throw new Error(
      "useNavegacaoStore deve ser usado dentro do escopo do StoreProvider"
    );
  }
  return context;
};

export default useNavegacaoStore;
