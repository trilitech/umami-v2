import { mnemonic1, mnemonic2 } from "./mockMnemonic";
import { UmamiV1Backup } from "../types/UmamiBackup";

export const umamiBackup: UmamiV1Backup = {
  // password = password !
  version: "1.0",
  derivationPaths: ["m/44'/1729'/?'/0'"],
  recoveryPhrases: [
    {
      salt: "509a1e0caa4127c54ec1b913929b5b077be3feadd5f0ed7e345df598b8af4762",
      iv: "632f562d9bc0618995ba0ae9a803485b",
      data: "2454a24d949ecde4582b1d44f9e8576b16d8e71c8474c2e1947a9ea3a04d758d725c22643333b6524fd8d2613b71c572248c82c4d3cec6f6e75023f7b27f4c573fe3b0a22d9e4576dff50d4d8b4d56886ee3a9a422fe4272a83b8a1f2d63bcedb4ff2bd2e9dd10d8ebbddb53ba488a80b5aaa820bde351a4e5e533ef17b1639a87fe61cc60334b7bde0a58fd92e465b4cc715623aa0fadbdaf11067c50e8a2ecd1afb0dafd6df0b9f6dc5339fa29c1ceda",
    },
    {
      salt: "692b94fdbaf5e65a8363096e2d9759a2d056ddaee19e9cd38b85522bf1e4f165",
      iv: "5d23b4d9957797d9130d1043287fde9c",
      data: "7b0e07d0cca7be9d46dfd6da5a5e7f722994be32d83047cd92fc278573bf2f0501a1ca2b20cfa0ab7e6fafda50be890f08a665f28281a7a39dc7edfbeff962ba792267a3ea602a396596254e7cfad535c8d9daaad717766ca86e7d953f58497dfa49437f9798dd4a7f5a0b6f152d485341f4dc3f492689a53a44d302af6be716aae5eb0501ed3e1f391a69706402bbbb81d6c94074f463736af60572a00126fcda11981d374195d3",
    },
  ],
};

export const recoveredPhrases = [mnemonic2, mnemonic1];
