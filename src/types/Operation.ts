import { IAirGapTransaction } from "@airgap/coinlib-core/interfaces/IAirGapTransaction";

export type Operation = Omit<
  IAirGapTransaction,
  "protocolIdentifier" | "network"
>[];
