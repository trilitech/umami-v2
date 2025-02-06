export * from "./types";

import * as webKDF from "./KDF";
import * as webAES from "./AES";

import * as mobileKDF from "./mobile/KDF";
import * as mobileAES from "./mobile/AES";

const isMobile = () => {
  try {
    // Check if we're in a React Native environment
    return !!require("react-native");
  } catch (e) {
    return false;
  }
};

export const { encrypt, decrypt } = isMobile() ? mobileAES : webAES;
export const { derivePasswordBasedKeyV1, derivePasswordBasedKeyV2 } = isMobile()
  ? mobileKDF
  : webKDF;
