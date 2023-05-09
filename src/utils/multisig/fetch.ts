import { TezosNetwork } from "@airgap/tezos";
import axios from "axios";
import { tzktUrls } from "../tezos/consts";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { multisigAddress } from "./consts";

export const getAllMultiSigContracts = async (
  network: TezosNetwork
): Promise<tzktGetSameMultisigsResponseType> => {
  try {
    const contractAddress = multisigAddress[network];
    const url = `${tzktUrls[network]}/v1/contracts/${contractAddress}/same?includeStorage=true&limit=1000`;
    const { data } = await axios.get<tzktGetSameMultisigsResponseType>(url);

    return data.map(({ address, balance, storage: { signers } }) => ({
      address,
      balance,
      storage: {
        signers,
      },
    }));
  } catch (error: any) {
    throw new Error(
      `Error fetching same contracts from tzkt: ${error.message}`
    );
  }
};
