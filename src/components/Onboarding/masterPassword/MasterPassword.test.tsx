import {
  TemporaryAccountConfig,
  TemporaryMnemonicAccountConfig,
} from "../useOnboardingModal";
import { render, screen, waitFor } from "@testing-library/react";
import MasterPassword from "./MasterPassword";
import { ReduxStore } from "../../../providers/ReduxStore";
import { mockImplicitAccount } from "../../../mocks/factories";
import { store } from "../../../utils/store/store";
import accountsSlice from "../../../utils/store/accountsSlice";
import { resetAccounts } from "../../../mocks/helpers";

const onClose = jest.fn(() => {});

// TODO refactor mocks
jest.mock("../../../utils/tezos/helpers");

const { add } = accountsSlice.actions;
const account = mockImplicitAccount(0);

const fixture = (config: TemporaryAccountConfig) => (
  <ReduxStore>
    <MasterPassword config={config} onClose={onClose} />
  </ReduxStore>
);

afterAll(() => {
  resetAccounts();
});

describe("<MasterPassword />", () => {
  describe("Form", () => {
    test("Display set password", async () => {
      render(fixture(new TemporaryMnemonicAccountConfig()));
      const confirmation = screen.getByTestId("confirmation");
      await waitFor(() => {
        expect(confirmation).toBeInTheDocument();
      });
    });

    test("Display enter password", async () => {
      store.dispatch(add([account]));
      render(fixture(new TemporaryMnemonicAccountConfig()));
      const confirmation = screen.getByTestId("confirmation");
      await waitFor(() => {
        expect(confirmation).toBeInTheDocument();
      });
    });
  });
});
