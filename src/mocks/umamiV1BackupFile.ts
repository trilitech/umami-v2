import { UmamiBackup } from "../types/UmamiEncrypted";

export const umamiBackup: UmamiBackup = {
  // password = password !
  version: "1.0",
  derivationPaths: ["m/44'/1729'/?'/0'"],
  recoveryPhrases: [
    {
      salt: "509a1e0caa4127c54ec1b913929b5b077be3feadd5f0ed7e345df598b8af4762",
      iv: "632f562d9bc0618995ba0ae9a803485b",
      data: "2454a24d949ecde4582b1d44f9e8576b16d8e71c8474c2e1947a9ea3a04d758d725c22643333b6524fd8d2613b71c572248c82c4d3cec6f6e75023f7b27f4c573fe3b0a22d9e4576dff50d4d8b4d56886ee3a9a422fe4272a83b8a1f2d63bcedb4ff2bd2e9dd10d8ebbddb53ba488a80b5aaa820bde351a4e5e533ef17b1639a87fe61cc60334b7bde0a58fd92e465b4cc715623aa0fadbdaf11067c50e8a2ecd1afb0dafd6df0b9f6dc5339fa29c1ceda",
    },
  ],
};
