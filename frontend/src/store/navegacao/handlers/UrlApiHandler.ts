import { useState } from "react";
import type { UrlApiStoreType } from "../types/UrlApiType";

const useUrlApiHandler = (): UrlApiStoreType => {
  const [urlApi, setUrlApi] = useState<string>("");

  return {
    get: urlApi,
    set: setUrlApi,
  };
};

export default useUrlApiHandler;
