import { TezosNetwork } from "@airgap/tezos";
import { DerivationType } from '@taquito/ledger-signer';

export enum SignerType {
    SK = "sk",
    LEDGER = "ledger",
}

type BaseSignerConfig = {
    type: SignerType;
    network: TezosNetwork;
};

export type SkSignerConfig = BaseSignerConfig & {
    type: SignerType.SK;
    sk: string;
};

export type LedgerSignerConfig = BaseSignerConfig & {
    type: SignerType.LEDGER;
    account: 1;
    derivationType: DerivationType.ED25519;
};

export type SignerConfig = SkSignerConfig | LedgerSignerConfig;
