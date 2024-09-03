import { mockContractContact, mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import {
  type UmamiStore,
  addTestAccount,
  contactsActions,
  makeStore,
  networksActions,
} from "@umami/state";
import { MAINNET } from "@umami/tezos";

import { RenameAccountModal } from "./RenameAccountModal";
import { fireEvent, render, screen, waitFor } from "../../mocks/testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<RenameAccountModal />", () => {
  const setName = (name: string) => {
    fireEvent.change(screen.getByLabelText("Account name"), {
      target: { value: name },
    });
    fireEvent.blur(screen.getByLabelText("Account name"));
  };

  describe("validations", () => {
    it("is required", async () => {
      const account = mockImplicitAccount(0);
      render(<RenameAccountModal account={account} />, { store });

      setName("");

      await waitFor(() =>
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required")
      );
    });

    it("does not allow the same name", async () => {
      const account = mockMnemonicAccount(0);
      addTestAccount(store, account);
      render(<RenameAccountModal account={account} />, { store });

      setName(account.label);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name was not changed");
      });
    });

    it("does not allow existing account name", async () => {
      const account = mockMnemonicAccount(0);
      [account, mockMnemonicAccount(1, { label: "Existing Account Name" })].forEach(account =>
        addTestAccount(store, account)
      );
      render(<RenameAccountModal account={account} />, { store });

      setName("Existing Account Name");

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });

    it("does not allow contact name existing in any networks", async () => {
      store.dispatch(networksActions.setCurrent(MAINNET));
      store.dispatch(
        contactsActions.upsert(mockContractContact(0, "ghostnet", "Existing Contact Name"))
      );
      const account = mockMnemonicAccount(0);
      render(<RenameAccountModal account={account} />, { store });

      setName("Existing Contact Name");

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });
  });
});
