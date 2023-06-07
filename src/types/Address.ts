export type Address = string;

export type AddressType = "contract" | "user";

export const addressType = (addressType: string): AddressType => {
  if (
    addressType.startsWith("tz1") ||
    addressType.startsWith("tz2") ||
    addressType.startsWith("tz3")
  ) {
    return "user";
  }
  if (addressType.startsWith("KT")) {
    return "contract";
  }
  throw new Error(`Unknown address type: ${addressType}`);
};
