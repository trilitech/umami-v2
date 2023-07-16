import { TezosNetwork } from "@airgap/tezos";
import { Curves, InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { buildLedgerSigner, nodeUrls } from "../utils/tezos";
import { DummySigner } from "../utils/tezos/dummySigner";

export type ToolkitConfigType = "ledger" | "secretKey" | "fake";

export type ToolkitConfig = SecretkeyToolkitConfig | LedgerToolkitConfig | FakeToolkitConfig;

type BaseToolkitConfig = {
  type: ToolkitConfigType;
  network: TezosNetwork;
};

export type SecretkeyToolkitConfig = BaseToolkitConfig & {
  type: "secretKey";
  sk: string;
};

export type LedgerToolkitConfig = BaseToolkitConfig & {
  type: "ledger";
  derivationPath: string;
  derivationType: Curves;
};

export type FakeToolkitConfig = BaseToolkitConfig & {
  type: "fake";
  pk: string;
  pkh: string;
};

export const makeToolkit = async (config: ToolkitConfig): Promise<TezosToolkit> => {
  const toolkit = new TezosToolkit(nodeUrls[config.network]);
  switch (config.type) {
    case "secretKey":
      toolkit.setProvider({ signer: new InMemorySigner(config.sk) });
      break;
    case "ledger":
      toolkit.setProvider({ signer: await buildLedgerSigner(config) });
      break;
    case "fake":
      toolkit.setProvider({
        signer: new DummySigner(config),
      });
      break;
  }

  return toolkit;
};
