import { Operation } from "@taquito/taquito";
import axios from "axios";

export const addressExists = (pkh: string, network = "mainnet") => {
  // TODO replace this method of checking
  const url = `https://${network}.umamiwallet.com/accounts/${pkh}/exists`;
  return axios.get(url);
};

export const getOperations = (): Promise<Operation[]> => {
  return Promise.resolve([]);
};
