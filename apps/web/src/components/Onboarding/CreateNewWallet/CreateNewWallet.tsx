import { generate24WordMnemonic } from "@umami/state";

import { SetupPassword } from "../SetupPassword";

export const CreateNewWallet = () => {
  const mnemonic = generate24WordMnemonic();

  return <SetupPassword mnemonic={mnemonic} />;
};
