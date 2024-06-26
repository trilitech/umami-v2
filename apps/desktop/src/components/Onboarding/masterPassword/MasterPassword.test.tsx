import { mnemonic1, mockMnemonicAccount } from "@umami/test-utils";

import { MasterPassword } from "./MasterPassword";
import { addAccount } from "../../../mocks/helpers";
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
    addAccount(account);
    render(fixture());

    expect(screen.getByTestId("confirmation")).toBeInTheDocument();
  });
});
