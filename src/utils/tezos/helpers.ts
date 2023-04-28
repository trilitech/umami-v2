import { TezosNetwork } from "@airgap/tezos";
import { InMemorySigner } from "@taquito/signer";
import {
  ContractMethod,
  ContractProvider,
  TezosToolkit,
} from "@taquito/taquito";
import { nodeUrls } from "./consts";
import { DummySigner } from "./dummySigner";
import { FA12TokenTransferParams, FA2TokenTransferParams } from "./types";

export const addressExists = async (
  pkh: string,
  network = TezosNetwork.MAINNET
): Promise<boolean> => {
  // Temporary solution to check address existence
  const Tezos = new TezosToolkit(nodeUrls[network]);
  const balance = await Tezos.tz.getBalance(pkh);
  return !balance.isZero();
};

// Temporary solution for generating fingerprint for seedphrase
// https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
export const getFingerPrint = async (seedPhrase: string): Promise<string> => {
  const utf8 = new TextEncoder().encode(seedPhrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 8);
  return hashHex;
};

export const makeToolkitWithSigner = async (
  sk: string,
  network: TezosNetwork
): Promise<TezosToolkit> => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new InMemorySigner(sk),
  });
  return Tezos;
};

export const makeToolkitWithDummySigner = (
  pk: string,
  pkh: string,
  network: TezosNetwork
): TezosToolkit => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new DummySigner(pk, pkh),
  });
  return Tezos;
};

export const getPkAndPkhFromSk = async (
  sk: string
): Promise<{
  pk: string;
  pkh: string;
}> => {
  const signer = new InMemorySigner(sk);
  return { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };
};

export const makeFA2TransferMethod = async (
  { sender, recipient, tokenId, amount, contract }: FA2TokenTransferParams,
  toolkit: TezosToolkit
): Promise<ContractMethod<ContractProvider>> => {
  const michelson = [
    {
      from_: sender,
      txs: [
        {
          to_: recipient,
          token_id: tokenId,
          amount: amount,
        },
      ],
    },
  ];

  const contractInstance = await toolkit.contract.at(contract);
  return contractInstance.methods.transfer(michelson);
};

export const makeFA12TransferMethod = async (
  { sender, recipient, amount, contract }: FA12TokenTransferParams,
  toolkit: TezosToolkit
): Promise<ContractMethod<ContractProvider>> => {
  const contractInstance = await toolkit.contract.at(contract);
  return contractInstance.methods.transfer(sender, recipient, amount);
};
