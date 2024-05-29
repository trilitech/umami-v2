import BigNumber from "bignumber.js";
import { useState } from "react";

import { Estimation } from "../tezos";

type Value = BigNumber | string | number;

type UseExecuteParams = (
  estimation: Estimation
) => [Estimation, (key: keyof Estimation, value: Value) => void];

export const useExecuteParams: UseExecuteParams = estimation => {
  const [executeParams, setExecuteParams] = useState<Estimation>(estimation);

  const updateExecuteParams = (key: keyof Estimation, value: Value) => {
    setExecuteParams(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return [executeParams, updateExecuteParams];
};
