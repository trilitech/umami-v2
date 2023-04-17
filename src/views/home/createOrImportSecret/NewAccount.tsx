import React from "react";
import { UmamiEncrypted } from "../../../types/UmamiEncrypted";

type mode =
  | {
      from: "newSecret";
      seedPhrase: string;
    }
  | {
      from: "existingSeedphrase";
      encryptedSeedphrase: UmamiEncrypted;
      index: number;
    }
  | {
      from: "social";
      pkh: string;
    };

type Props = {
  mode: mode;
};

export const NewAccount: React.FC<Props> = () => {
  return <div>hello</div>;
};
