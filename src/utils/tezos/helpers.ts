import { TezosNetwork } from "@airgap/tezos";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { DerivationType, LedgerSigner } from "@taquito/ledger-signer";
import { TransactionOperationParameter } from "@taquito/rpc";
import { Curves, InMemorySigner } from "@taquito/signer";
import { TezosToolkit, TransferParams } from "@taquito/taquito";
import axios from "axios";
import { shuffle } from "lodash";
import { FA12Operation, FA2Operation } from "../../types/RawOperation";
import { SignerConfig, SignerType } from "../../types/SignerConfig";
import { PublicKeyPair } from "../restoreAccounts";
import { RawTzktGetAddressType } from "../tzkt/types";
import { nodeUrls, tzktUrls } from "./consts";
import { DummySigner } from "./dummySigner";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const addressExists = async (
  pkh: string,
  network = TezosNetwork.MAINNET
): Promise<boolean> => {
  try {
    const url = `${tzktUrls[network]}/v1/accounts/${pkh}`;
    const {
      data: { type },
    } = await axios.get<RawTzktGetAddressType>(url);
    return type !== "empty";
  } catch (error: any) {
    throw new Error(`Error fetching account from tzkt ${error.message}`);
  }
};

// Temporary solution for generating fingerprint for seedphrase
// https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
export const getFingerPrint = async (seedPhrase: string): Promise<string> => {
  const utf8 = new TextEncoder().encode(seedPhrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(bytes => bytes.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 8);
  return hashHex;
};

export const curvesToDerivationPath = (curves: Curves): DerivationType => {
  switch (curves) {
    case "ed25519":
      return DerivationType.ED25519;
    case "secp256k1":
      return DerivationType.SECP256K1;
    case "p256":
      return DerivationType.P256;
    case "bip25519":
      throw new Error("bip25519 is not supported in Tezos");
  }
};

export const makeSigner = async (config: SignerConfig) => {
  switch (config.type) {
    case SignerType.SK:
      return new InMemorySigner(config.sk);

    case SignerType.LEDGER: {
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
    }
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

export const getPkAndPkhFromSk = async (sk: string): Promise<PublicKeyPair> => {
  const signer = new InMemorySigner(sk);
  return { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };
};

export const makeFA12TransactionParameter = ({
  sender,
  recipient,
  amount,
}: FA12Operation): TransactionOperationParameter => {
  return {
    entrypoint: "transfer",
    value: {
      prim: "Pair",
      args: [
        {
          string: sender.pkh,
        },
        {
          prim: "Pair",
          args: [
            {
              string: recipient.pkh,
            },
            {
              int: amount,
            },
          ],
        },
      ],
    },
  };
};

export const makeFA2TransactionParameter = ({
  sender,
  recipient,
  tokenId,
  amount,
}: FA2Operation): TransactionOperationParameter => {
  return {
    entrypoint: "transfer",
    value: [
      {
        prim: "Pair",
        args: [
          {
            string: sender.pkh,
          },
          [
            {
              prim: "Pair",
              args: [
                {
                  string: recipient.pkh,
                },
                {
                  prim: "Pair",
                  args: [
                    {
                      int: tokenId,
                    },
                    {
                      int: amount,
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
    ],
  };
};

export const makeTokenTransferParams = (
  operation: FA12Operation | FA2Operation
): TransferParams => {
  return {
    amount: 0,
    to: operation.contract.pkh,
    mutez: false,
    parameter:
      operation.type === "fa1.2"
        ? makeFA12TransactionParameter(operation)
        : makeFA2TransactionParameter(operation),
  };
};

export const makeMultisigProposeMethod = async (
  { lambdaActions, contract }: MultisigProposeMethodArgs,
  toolkit: TezosToolkit
) => {
  const contractInstance = await toolkit.contract.at(contract.pkh);
  return contractInstance.methods.propose(lambdaActions);
};

export const makeMultisigApproveOrExecuteMethod = async (
  { type, contract, operationId }: MultisigApproveOrExecuteMethodArgs,
  toolkit: TezosToolkit
) => {
  const contractInstance = await toolkit.contract.at(contract.pkh);
  return contractInstance.methods[type](operationId);
};

export const selectRandomElements = <T>(
  arr: T[],
  n: number
): {
  index: number;
  value: T;
}[] => {
  return shuffle(arr.map((value, index) => ({ value, index })))
    .slice(0, n)
    .sort((a, b) => a.index - b.index);
};
