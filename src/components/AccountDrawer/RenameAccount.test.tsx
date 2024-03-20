import { Modal } from "@chakra-ui/react";

import { RenameAccountModal } from "./RenameAccountModal";
import { mockContact, mockImplicitAccount, mockMnemonicAccount } from "../../mocks/factories";
import { fireEvent, render, screen, waitFor } from "../../mocks/testUtils";
import { Account } from "../../types/Account";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import { store } from "../../utils/redux/store";

const fixture = (account: Account) => (
  <Modal isOpen={true} onClose={() => {}}>
    <RenameAccountModal account={account} />
  </Modal>
);

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
      render(fixture(account));

      setName("");

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required");
      });
    });

    it("does not allow the same name", async () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));
      render(fixture(account));

      setName(account.label);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name was not changed");
      });
    });

    it("does not allow existing account name", async () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(
        accountsSlice.actions.addMockMnemonicAccounts([
          account,
          mockMnemonicAccount(1, "Existing Account Name"),
        ])
      );
      render(fixture(account));

      setName("Existing Account Name");

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });

    it("does not allow existing contact name", async () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(contactsActions.upsert(mockContact(0, "Existing Contact Name")));
      render(fixture(account));

      setName("Existing Contact Name");

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });
  });
});
