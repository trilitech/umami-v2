import { TezosNetwork } from "@airgap/tezos";
import { Curves, InMemorySigner } from "@taquito/signer";
import {
  ContractMethod,
  ContractProvider,
  TezosToolkit,
} from "@taquito/taquito";
import { SignerConfig, SignerType } from "../../types/SignerConfig";
import { nodeUrls } from "./consts";
import { DummySigner } from "./dummySigner";
import { FA12TransferMethodArgs, FA2TransferMethodArgs } from "./types";
import { DerivationType, LedgerSigner } from "@taquito/ledger-signer";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";

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

export const curvesToDerivationPath = (c: Curves): DerivationType => {
  switch (c) {
    case "ed25519":
      return DerivationType.ED25519;
    case "secp256k1":
      return DerivationType.SECP256K1;
    case "p256":
      return DerivationType.P256;
    case "bip25519":
      throw new Error("bip25519 is not supported in Tezos");
    default: {
      const error: never = c;
      throw new Error(error);
    }
  }
};

export const makeSigner = async (config: SignerConfig) => {
  if (config.type === SignerType.SK) {
    return new InMemorySigner(config.sk);
  } else if (config.type === SignerType.LEDGER) {
    // Close existing connections to be able to reinitiate
    const devices = await TransportWebHID.list();
    for (let i = 0; i < devices.length; i++) {
      devices[i].close();
    }
    const transport = await TransportWebHID.create();
    const signer = new LedgerSigner(
      transport,
      config.derivationPath,
      false, // PK Verification not needed
      curvesToDerivationPath(config.derivationType)
    );
    return signer;
  } else {
    const error: never = config;
    throw new Error(error);
  }
};

export const makeToolkitWithSigner = async (config: SignerConfig) => {
  const Tezos = new TezosToolkit(nodeUrls[config.network]);
  const signer = await makeSigner(config);

  Tezos.setProvider({
    signer,
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
  { sender, recipient, tokenId, amount, contract }: FA2TransferMethodArgs,
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
  { sender, recipient, amount, contract }: FA12TransferMethodArgs,
  toolkit: TezosToolkit
): Promise<ContractMethod<ContractProvider>> => {
  const contractInstance = await toolkit.contract.at(contract);
  return contractInstance.methods.transfer(sender, recipient, amount);
};
