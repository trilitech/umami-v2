import { Modal } from "@chakra-ui/react";
import {
  type Account,
  mockContractContact,
  mockImplicitAccount,
  mockMnemonicAccount,
} from "@umami/core";
import { addTestAccount, contactsActions, networksActions, store } from "@umami/state";
import { MAINNET } from "@umami/tezos";

import { RenameAccountModal } from "./RenameAccountModal";
import { fireEvent, render, screen, waitFor } from "../../mocks/testUtils";

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
      addTestAccount(account);
      render(fixture(account));

      setName(account.label);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name was not changed");
      });
    });

    it("does not allow existing account name", async () => {
      const account = mockMnemonicAccount(0);
      [account, mockMnemonicAccount(1, "Existing Account Name")].forEach(addTestAccount);
      render(fixture(account));

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
