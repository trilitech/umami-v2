import { UmamiEncrypted } from "./UmamiEncrypted";

type Base = {
  pkh: string;
  pk: string;
};

export type UnencryptedAccount = Base & {
  sk: string;
};

export type Account = Base & {
  seedFingerPrint?: string;
  label?: string;
  esk: UmamiEncrypted;
};
