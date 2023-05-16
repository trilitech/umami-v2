import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";

export const mutezToTez = (m: BigNumber) =>
  format("mutez", "tz", m) as BigNumber;

export const prettyTezAmount = (a: BigNumber, isTez = false) =>
  `${String(isTez ? a : format("mutez", "tz", a))} ꜩ`;
