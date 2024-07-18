import { mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { MasterPassword } from "./MasterPassword";
import { render, screen } from "../../../testUtils";

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

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<MasterPassword />", () => {
  test("Display set password", () => {
    render(fixture(), { store });

    expect(screen.getByTestId("confirmation")).toBeInTheDocument();
  });

  test("Display enter password", () => {
    addTestAccount(store, account);
    render(fixture(), { store });

    expect(screen.getByTestId("confirmation")).toBeInTheDocument();
  });
});
