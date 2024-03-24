export type Contact = {
  name: string;
  pkh: string;
};

export type StoredContactInfo = Contact & { network: string | undefined };
