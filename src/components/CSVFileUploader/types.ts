type CSVTezTransfer = {
  recipient: string;
  amount: number;
};

type CSVFA2Transfer = {
  recipient: string;
  amount: number;
  contract: string;
  tokenId: number;
};

type CSVFA12Transfer = Omit<CSVFA2Transfer, "tokenId">;

export type CSVParsedRow = CSVTezTransfer | CSVFA12Transfer | CSVFA2Transfer;
