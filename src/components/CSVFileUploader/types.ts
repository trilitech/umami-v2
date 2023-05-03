type CSVType = "fa1.2" | "fa2" | "tez";

interface CSVRowBase {
  type: CSVType;
  recipient: string;
  amount: number;
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
