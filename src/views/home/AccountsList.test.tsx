import { AccountsList } from "./AccountsList";
import {
  mockAccountLabel,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockMultisigWithOperations,
  mockPk,
  mockSocialAccount,
} from "../../mocks/factories";
import { act, render, screen, userEvent, waitFor, within } from "../../mocks/testUtils";
import { MnemonicAccount } from "../../types/Account";
import { getDefaultDerivationPath } from "../../utils/account/derivationPathUtils";
import * as cryptoFunctionsToMock from "../../utils/crypto/AES";
import { formatPkh } from "../../utils/format";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { multisigsSlice } from "../../utils/redux/slices/multisigsSlice";
import { store } from "../../utils/redux/store";
import { derivePublicKeyPair } from "../../utils/tezos";

const { addAccount, addMockMnemonicAccounts } = accountsSlice.actions;

const GOOGLE_ACCOUNT_LABEL1 = "my google account 1";
const GOOGLE_ACCOUNT_LABEL2 = "my google account 2";
const MOCK_FINGERPRINT1 = "mockFin1";
const MOCK_FINGERPRINT2 = "mockFin2";

describe("<AccountsList />", () => {
  describe("deleting account", () => {
    it("shows removal message (for mnemonic & social)", async () => {
      const user = userEvent.setup();
      const mnemonic = mockMnemonicAccount(0);
      const social = mockSocialAccount(1);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mnemonic]));
      store.dispatch(accountsSlice.actions.addAccount(social));
      render(<AccountsList />);

      const [mnemonicPopover, socialPopover] = screen.getAllByTestId("popover-cta");
      const [removeMnemonic, removeSocial] = screen.getAllByTestId("popover-remove");

      await act(() => user.click(mnemonicPopover));
      await act(() => user.click(removeMnemonic));

      expect(screen.getByTestId("description")).toHaveTextContent(
        "Are you sure you want to remove all accounts derived from Seedphrase mockPrint?"
      );

      await act(() => user.click(socialPopover));
      await act(() => user.click(removeSocial));

      expect(screen.getByTestId("description")).toHaveTextContent(
        "Are you sure you want to remove all of your Social Accounts?"
      );
    });

    it("removes all accounts linked to a given mnemonic", async () => {
      const user = userEvent.setup();
      restore();
      render(<AccountsList />);

      expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(2);
      const seedPhrase1 = screen.getAllByTestId(/account-group-seedphrase/i)[0];

      const { getByTestId, getByRole } = within(seedPhrase1);
      const cta = getByTestId(/^popover-cta$/i);
      await act(() => user.click(cta));
      await waitFor(() => expect(getByRole("dialog")).toHaveTextContent("Remove"));

      const removeBtn = getByRole("button", { name: /^remove$/i });

      await act(() => user.click(removeBtn));

      expect(
        screen.getByText(
          `Are you sure you want to remove all accounts derived from Seedphrase ${MOCK_FINGERPRINT1}?`
        )
      ).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "Remove All" });

      await act(() => user.click(confirmBtn));

      expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(1);
      expect(
        screen.queryByText(
          `Are you sure you want to remove all accounts derived from Seedphrase ${MOCK_FINGERPRINT1}?`
        )
      ).not.toBeInTheDocument();
    });

    it("shows offboarding message for last accounts", async () => {
      const user = userEvent.setup();
      const social1 = mockSocialAccount(0);
      const social2 = mockSocialAccount(1);
      store.dispatch(accountsSlice.actions.addAccount(social1));
      store.dispatch(accountsSlice.actions.addAccount(social2));

      render(<AccountsList />);

      await act(() => user.click(screen.getByTestId("popover-cta")));
      await act(() => user.click(screen.getByTestId("popover-remove")));

      expect(screen.getByTestId("description")).toHaveTextContent(
        "Removing all your accounts will off-board you from Umami. " +
          "This will remove or reset all customized settings to their defaults. " +
          "Personal data (including saved contacts, password and accounts) won't be affected."
      );
    });
  });

  it("displays accounts in store with label and formated pkh", () => {
    store.dispatch(
      addMockMnemonicAccounts([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
        mockMnemonicAccount(2),
      ])
    );

    render(<AccountsList />);

    const results = screen.getAllByTestId("account-tile-container");
    expect(results).toHaveLength(3);

    results.forEach((result, i) => {
      const { getByTestId } = within(result);
      const identifiers = getByTestId("account-identifier");

      expect(identifiers).toHaveTextContent(mockAccountLabel(i));
      expect(identifiers).toHaveTextContent(formatPkh(mockImplicitAddress(i).pkh));
    });
  });

  it("displays accounts by group (case mnemonic social and multisig)", () => {
    restore();
    render(<AccountsList />);
    expect(screen.getAllByTestId("account-tile-container")).toHaveLength(7);
    expect(screen.getAllByTestId(/account-group-title/)).toHaveLength(4);

    const socialAccounts = screen.getByTestId(/account-group-social/i);
    expect(within(socialAccounts).getAllByTestId("account-tile-container")).toHaveLength(2);
    expect(socialAccounts).toHaveTextContent("Social Accounts");
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);

    const seedPhrase1 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGERPRINT1}`);
    expect(within(seedPhrase1).getAllByTestId("account-tile-container")).toHaveLength(2);
    expect(seedPhrase1).toHaveTextContent(`Seedphrase ${MOCK_FINGERPRINT1}`);
    expect(seedPhrase1).toHaveTextContent("Mnemonic 1.1");
    expect(seedPhrase1).toHaveTextContent("Mnemonic 1.2");

    const seedPhrase2 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGERPRINT2}`);
    expect(within(seedPhrase2).getAllByTestId("account-tile-container")).toHaveLength(1);
    expect(seedPhrase2).toHaveTextContent(`Seedphrase ${MOCK_FINGERPRINT2}`);
    expect(seedPhrase2).toHaveTextContent("Mnemonic 2");

    const multisigAccounts = screen.getByTestId(/account-group-multisig/i);
    expect(within(multisigAccounts).getAllByTestId("account-tile-container")).toHaveLength(2);
    expect(multisigAccounts).toHaveTextContent(/multisig account 0/i);
    expect(multisigAccounts).toHaveTextContent(/multisig account 1/i);
  });

  it("allows to derive a new account for a mnemonic", async () => {
    const user = userEvent.setup();
    const account = mockImplicitAccount(2, undefined, MOCK_FINGERPRINT1);
    jest.spyOn(cryptoFunctionsToMock, "decrypt").mockResolvedValue("mockSeedPhrase");
    const derivePublicKeyPairMock = jest.mocked(derivePublicKeyPair).mockResolvedValue({
      pkh: account.address.pkh,
      pk: account.pk,
    });
    const LABEL = "my label";
    restore();
    render(<AccountsList />);

    // Open actions dialog for Mnemonic Group 1
    const seedPhrase1 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGERPRINT1}`);
    const { getByTestId, getByRole } = within(seedPhrase1);
    const cta = getByTestId(/^popover-cta$/i);
    await act(() => user.click(cta));
    // Click "create" button
    expect(await screen.findByRole("dialog")).toHaveTextContent("Create");
    const createBtn = getByRole("button", { name: "Create" });
    // Input account label
    await act(() => user.click(createBtn));
    const nameInput = screen.getByLabelText("Account name");
    await act(() => user.type(nameInput, LABEL));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));
    // Input password
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    const passwordInput = screen.getByLabelText(/password/i);
    await act(() => user.type(passwordInput, "myPassword"));
    // Submit
    const submitBtn = screen.getByRole("button", { name: "Submit" });
    expect(submitBtn).toBeEnabled();

    await act(() => user.click(submitBtn));

    expect(derivePublicKeyPairMock).toHaveBeenCalledWith(
      "mockSeedPhrase",
      getDefaultDerivationPath(2)
    );
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();

    {
      const seedPhrase1 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGERPRINT1}`);

      const tiles = within(seedPhrase1).getAllByTestId("account-tile-container");
      expect(tiles).toHaveLength(3);

      expect(tiles[2]).toHaveTextContent(LABEL);
    }
  });
});

const restore = () => {
  store.dispatch(
    accountsSlice.actions.addMnemonicAccounts({
      seedFingerprint: MOCK_FINGERPRINT1,
      accounts: [
        mockImplicitAccount(0, undefined, MOCK_FINGERPRINT1, "Mnemonic 1.1"),
        mockImplicitAccount(1, undefined, MOCK_FINGERPRINT1, "Mnemonic 1.2"),
      ] as MnemonicAccount[],
      encryptedMnemonic: { mock: "encrypted 1" } as any,
    })
  );
  store.dispatch(
    accountsSlice.actions.addMnemonicAccounts({
      seedFingerprint: MOCK_FINGERPRINT2,
      accounts: [
        mockImplicitAccount(4, undefined, MOCK_FINGERPRINT2, "Mnemonic 2"),
      ] as MnemonicAccount[],
      encryptedMnemonic: { mock: "encrypted 2" } as any,
    })
  );

  store.dispatch(
    addAccount({
      type: "social",
      idp: "google",
      address: mockImplicitAddress(6),
      pk: mockPk(6),
      label: GOOGLE_ACCOUNT_LABEL1,
    })
  );

  store.dispatch(
    addAccount({
      type: "social",
      idp: "google",
      address: mockImplicitAddress(7),
      pk: mockPk(7),
      label: GOOGLE_ACCOUNT_LABEL2,
    })
  );

  store.dispatch(
    multisigsSlice.actions.setMultisigs([
      mockMultisigWithOperations(0),
      mockMultisigWithOperations(1),
    ])
  );
};
