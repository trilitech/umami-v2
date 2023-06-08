export type Address = string;

export type AddressType = "contract" | "user";

export const addressType = (addressType: string): AddressType => {
  if (addressType.match(/^tz[1234]/)) {
    return "user";
  }
  if (addressType.startsWith("KT")) {
    return "contract";
  }
  throw new Error(`Unknown address type: ${addressType}`);
};
