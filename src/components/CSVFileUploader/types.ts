type CSVRowType = "fa1.2" | "fa2" | "tez";

interface CSVRowBase {
  type: CSVRowType;
  recipient: string;
  prettyAmount: string; // the format of "prettyAmount" is "tez" for tez transfer.
}

interface CSVTezTransferRow extends CSVRowBase {
  type: "tez";
}

interface CSVFA12TransferRow extends CSVRowBase {
  type: "fa1.2";
  contract: string;
}

interface CSVFA2TransferRow extends CSVRowBase {
  type: "fa2";
  contract: string;
  tokenId: number;
}

export type CSVRow = CSVTezTransferRow | CSVFA12TransferRow | CSVFA2TransferRow;
