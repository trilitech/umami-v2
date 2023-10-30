import { Modal } from "@chakra-ui/react";

import { fireEvent, render, screen, waitFor } from "../../mocks/testUtils";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { RenameAccountModal } from "./RenameAccountModal";
import { Account } from "../../types/Account";
import { mockContact, mockImplicitAccount, mockMnemonicAccount } from "../../mocks/factories";
import store from "../../utils/redux/store";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";

const fixture = (account: Account) => (
  <Modal isOpen={true} onClose={() => {}}>
    <RenameAccountModal account={account} />
  </Modal>
);

describe("<RenameAccountModal />", () => {
  describe("validations", () => {
    it("is required", async () => {
      const account = mockImplicitAccount(0);
      render(fixture(account));

      fireEvent.change(screen.getByLabelText("Account name"), {
        target: { value: "" },
      });

      fireEvent.blur(screen.getByLabelText("Account name"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required");
      });
    });

    it("does not allow existing account name", async () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));
      render(fixture(account));

      fireEvent.change(screen.getByLabelText("Account name"), {
        target: { value: account.label },
      });

      fireEvent.blur(screen.getByLabelText("Account name"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name already used in accounts");
      });
    });

    it("does not allow existing contact name", async () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(contactsActions.upsert(mockContact(0)));
      render(fixture(account));

      fireEvent.change(screen.getByLabelText("Account name"), {
        target: { value: mockContact(0).name },
      });

      fireEvent.blur(screen.getByLabelText("Account name"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name already registered in address book"
        );
      });
    });
  });
});
