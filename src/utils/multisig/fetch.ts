import { TezosNetwork } from "@airgap/tezos";
import axios from "axios";
import { tzktUrls } from "../tezos/consts";
import { tzktGetSameContractResponseType } from "../tzkt/types";
import { multisigAddress } from "./consts";

export const getAllMultiSigContracts = async (
  network: TezosNetwork
): Promise<tzktGetSameContractResponseType[]> => {
  try {
    const multisigs = await getSameContractsWithStorage(
      multisigAddress[network],
      network
    );

    return multisigs.map(({ address, balance, storage: { signers } }) => ({
      address,
      balance,
      storage: { signers },
    }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Returns contracts which have the same script as the specified one. Contract scripts are compared by 32-bit hash.
const getSameContractsWithStorage = async (
  contractAddress: string,
  network: TezosNetwork
): Promise<tzktGetSameContractResponseType[]> => {
  try {
    const url = `${tzktUrls[network]}/v1/contracts/${contractAddress}/same?includeStorage=true&limit=1000`;
    const { data } = await axios.get<tzktGetSameContractResponseType[]>(url);
    return data;
  } catch (error: any) {
    throw new Error("Error fetching same contracts from tzkt");
  }
};
