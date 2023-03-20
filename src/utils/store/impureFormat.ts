import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";

export const mutezToTez = (m: BigNumber) =>
  (format("mutez", "tz", m) as BigNumber).toNumber();
