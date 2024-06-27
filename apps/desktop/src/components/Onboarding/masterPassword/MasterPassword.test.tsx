import { mockMnemonicAccount } from "@umami/core";
import { addTestAccount } from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { MasterPassword } from "./MasterPassword";
import { render, screen } from "../../../mocks/testUtils";

const onClose = jest.fn(() => {});

const account = mockMnemonicAccount(0);

const fixture = () => {
  const account = {
    type: "mnemonic" as const,
    mnemonic: mnemonic1,
    label: "Some Account",
    derivationPathTemplate: "any",
  };
  return <MasterPassword account={account} onClose={onClose} />;
};

describe("<MasterPassword />", () => {
  test("Display set password", () => {
    render(fixture());

    expect(screen.getByTestId("confirmation")).toBeInTheDocument();
  });

  test("Display enter password", () => {
    addTestAccount(account);
    render(fixture());

    expect(screen.getByTestId("confirmation")).toBeInTheDocument();
  });
});
