import { TransactionValues } from "../../components/sendForm/types";
import { makeContract, makeToolkitWithSigner } from "./helpers";
import { transactionValuesToWalletParams } from "./params";
import { FA2TokenTransferParams } from "./types";
import { SignerConfig } from "../../types/SignerConfig";

export const delegate = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  return Tezos.contract.setDelegate({
    source: senderPkh,
    delegate: bakerPkh,
  });
};

export const transferFA2Token = async (
  params: FA2TokenTransferParams,
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  const contractInstance = await makeContract(params, Tezos);
  return contractInstance.send();
};

export const transferTez = async (
  recipient: string,
  amount: number,
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  return Tezos.contract.transfer({ to: recipient, amount });
};

export const submitBatch = async (
  transactions: TransactionValues[],
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  const params = await transactionValuesToWalletParams(transactions, Tezos);
  return Tezos.wallet.batch(params).send();
};