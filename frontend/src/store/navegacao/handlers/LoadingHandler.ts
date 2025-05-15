import { useState } from "react";
import type { LoadingStoreType } from "../types/LoadingStoreType";

const useLoadingHandler = (): LoadingStoreType => {
  const [loading, setLoading] = useState<number>(0);

  return {
    get: loading > 0,
    start: () => setLoading((l) => l + 1),
    end: () => setLoading((l) => (l > 0 ? l - 1 : 0)),
  };
};

export default useLoadingHandler;
