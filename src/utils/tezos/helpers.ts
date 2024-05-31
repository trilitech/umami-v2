import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { DerivationType, LedgerSigner } from "@taquito/ledger-signer";
import { Parser } from "@taquito/michel-codec";
import { OpKind } from "@taquito/rpc";
import { Curves, InMemorySigner } from "@taquito/signer";
import { ParamsWithKind, TezosToolkit, WalletParamsWithKind } from "@taquito/taquito";
import axios from "axios";
import BigNumber from "bignumber.js";
import { shuffle } from "lodash";

import { Estimation } from "./estimate";
import { FakeSigner } from "./fakeSigner";
import { AccountOperations } from "../../types/AccountOperations";
import { Network } from "../../types/Network";
import {
  Operation,
  makeFA12TransactionParameter,
  makeFA2TransactionParameter,
  makeMultisigProposeOperation,
} from "../../types/Operation";
import { SignerConfig } from "../../types/SignerConfig";
import { RawTzktGetAddressType } from "../tzkt/types";

export type PublicKeyPair = {
  pk: string;
  pkh: string;
};

export type AdvancedAccountOperations = AccountOperations & {
  executeParams?: Partial<Estimation>;
};

export const addressExists = async (pkh: string, network: Network): Promise<boolean> => {
  try {
    const url = `${network.tzktApiUrl}/v1/accounts/${pkh}`;
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
    case "social":
    case "mnemonic":
    case "secret_key":
      return new InMemorySigner(config.secretKey);
    case "ledger": {
      // Close existing connections to be able to re-initiate
      const devices = await TransportWebUSB.list();
      for (let i = 0; i < devices.length; i++) {
        devices[i].close();
      }
      const transport = await TransportWebUSB.create();
      const signer = new LedgerSigner(
        transport,
        config.account.derivationPath,
        false, // PK Verification not needed
        curvesToDerivationPath(config.account.curve)
      );
      return signer;
    }
    case "fake":
      return new FakeSigner(config.signer.pk, config.signer.address.pkh);
  }
};

export const makeToolkit = async (config: SignerConfig) => {
  const toolkit = new TezosToolkit(config.network.rpcUrl);
  const signer = await makeSigner(config);
  toolkit.setSignerProvider(signer);
  return toolkit;
};

export const getPublicKeyPairFromSk = async (sk: string): Promise<PublicKeyPair> => {
  const signer = new InMemorySigner(sk);
  return { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };
};

export const derivePublicKeyPair = async (
  mnemonic: string,
  derivationPath: string,
  curve: Curves = "ed25519"
): Promise<PublicKeyPair> =>
  deriveSecretKey(mnemonic, derivationPath, curve).then(getPublicKeyPairFromSk);

export const deriveSecretKey = (mnemonic: string, derivationPath: string, curve: Curves) =>
  InMemorySigner.fromMnemonic({
    mnemonic,
    derivationPath,
    curve,
  }).secretKey();

export const selectRandomElements = <T>(
  arr: T[],
  n: number
): {
  index: number;
  value: T;
}[] =>
  shuffle(arr.map((value, index) => ({ value, index })))
    .slice(0, n)
    .sort((a, b) => a.index - b.index);

// for tez it will return tez, for mutez - mutez
export const sumTez = (items: string[]): number =>
  items.reduce((acc, curr) => acc.plus(curr), new BigNumber(0)).toNumber();

export const operationToTaquitoOperation = (operation: Operation): ParamsWithKind => {
  let taquitoOperation = {} as ParamsWithKind;

  switch (operation.type) {
    case "tez":
      taquitoOperation = {
        kind: OpKind.TRANSACTION,
        to: operation.recipient.pkh,
        amount: parseInt(operation.amount),
        mutez: true,
      };
      break;
    case "contract_call":
      taquitoOperation = {
        kind: OpKind.TRANSACTION,
        to: operation.contract.pkh,
        amount: parseInt(operation.amount),
        mutez: true,
        parameter: { entrypoint: operation.entrypoint, value: operation.args },
      };
      break;

    case "delegation":
      taquitoOperation = {
        kind: OpKind.DELEGATION,
        source: operation.sender.pkh,
        delegate: operation.recipient.pkh,
      };
      break;
    case "undelegation":
      taquitoOperation = {
        kind: OpKind.DELEGATION,
        source: operation.sender.pkh,
        delegate: undefined,
      };
      break;
    case "fa1.2":
      taquitoOperation = {
        kind: OpKind.TRANSACTION,
        amount: 0,
        to: operation.contract.pkh,
        parameter: makeFA12TransactionParameter(operation),
      };
      break;
    case "fa2":
      taquitoOperation = {
        kind: OpKind.TRANSACTION,
        amount: 0,
        to: operation.contract.pkh,
        parameter: makeFA2TransactionParameter(operation),
      };
      break;
    case "contract_origination": {
      // if storage is a valid Michelson we need to pass it in as init, not the storage
      if (isValidMichelson(operation.storage)) {
        return {
          kind: OpKind.ORIGINATION,
          code: operation.code,
          init: operation.storage,
        };
      }
      return {
        kind: OpKind.ORIGINATION,
        code: operation.code,
        storage: operation.storage,
      };
      break;
    }
  }

  return { ...taquitoOperation, ...operation.executeParams };
};

const isValidMichelson = (rawStorage: any): boolean => {
  try {
    new Parser().parseJSON(rawStorage);
    return true;
  } catch {
    return false;
  }
};

export const operationsToBatchParams = ({
  type: operationsType,
  operations: originalOperations,
  sender,
  executeParams,
}: AdvancedAccountOperations): ParamsWithKind[] => {
  let operations: Operation[] = [];

  if (operationsType === "implicit") {
    operations = originalOperations;
  }
  if (operationsType === "implicit" && originalOperations.length === 1) {
    operations = [{ ...originalOperations[0], executeParams }];
  }
  if (operationsType === "proposal") {
    operations = [
      {
        ...makeMultisigProposeOperation(sender.address, originalOperations),
        executeParams,
      },
    ];
  }

  return operations.map(operationToTaquitoOperation);
};

export const operationsToWalletParams = operationsToBatchParams as (
  operations: AdvancedAccountOperations
) => WalletParamsWithKind[];
