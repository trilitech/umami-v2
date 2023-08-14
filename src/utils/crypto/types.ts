export type Hex = string;

export type EncryptedData = {
  iv: Hex;
  salt: Hex;
  data: Hex;
};
