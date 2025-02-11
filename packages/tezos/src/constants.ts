const getTezSymbol = () => {
  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  return isIOS ? "XTZ" : "ꜩ";
};

export const TEZ = getTezSymbol();
export const TEZ_DECIMALS = 6;
export const BLOCK_TIME = 10 * 1000; // 10 seconds

export const verifiedTokens = [
  "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
  "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
  "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
  "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
  "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
  "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
  "KT1Ha4yFVeyzw6KRAdkzq6TxDHB97KG4pZe8",
  "KT1JBNFcB5tiycHNdYGYCtR3kk6JaJysUCi8",
  "KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL",
  "KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX",
  "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
  "KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9",
  "KT1914CUZ7EegAFPbfgQMRkw8Uz5mYkEz2ui",
  "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  "KT19ovJhcsUn4YU8Q5L3BGovKSixfbWcecEA",
  "KT1TgmD7kXQzofpuc9VbTRMdZCS2e6JDuTtc",
  "KT1F1mn2jbqQCJcsNgYKVAQjvenecNMY2oPK",
  "KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF",
  "KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT",
  "KT1AM3PV1cwmGRw28DVTgsjjsjHvmL6z4rGh",
  "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  "KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4",
  "KT1MZg99PxMDEENwB4Fi64xkqAVh5d1rv8Z9",
  "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
  "KT1XTxpQvo7oRCqp85LikEZgAZ22uDxhbWJv",
  "KT1VaEsVNiBoA56eToEK6n6BcPgh1tdx9eXi",
];
