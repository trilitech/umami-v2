import { render, screen, waitFor } from "@testing-library/react";
import MasterPassword from "./MasterPassword";
import { ReduxStore } from "../../../providers/ReduxStore";
import { mockImplicitAccount } from "../../../mocks/factories";
import { store } from "../../../utils/store/store";
import accountsSlice from "../../../utils/store/accountsSlice";
import { resetAccounts } from "../../../mocks/helpers";
import { seedPhrase } from "../../../mocks/seedPhrase";

const onClose = jest.fn(() => {});

// TODO refactor mocks
jest.mock("../../../utils/tezos/helpers");

const { add } = accountsSlice.actions;
const account = mockImplicitAccount(0);

const fixture = () => {
  const account = {
    type: "mnemonic" as const,
    seedphrase: seedPhrase,
    label: "Some Account",
    derivationPath: "any",
  };
  return (
    <ReduxStore>
      <MasterPassword onClose={onClose} account={account} />
    </ReduxStore>
  );
};

afterAll(() => {
  resetAccounts();
});

describe("<MasterPassword />", () => {
  test("Display set password", async () => {
    render(fixture());
    const confirmation = screen.getByTestId("confirmation");
    await waitFor(() => {
      expect(confirmation).toBeInTheDocument();
    });
  });

  test("Display enter password", async () => {
    store.dispatch(add([account]));
    render(fixture());
    const confirmation = screen.getByTestId("confirmation");
    await waitFor(() => {
      expect(confirmation).toBeInTheDocument();
    });
  });
});
