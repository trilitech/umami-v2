import "@testing-library/jest-dom";
import {
  mockImplicitAccount,
  mockAccountLabel,
  mockMultisigWithOperations,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockPk,
} from "../../mocks/factories";
import { formatPkh } from "../../utils/format";
import { store } from "../../utils/redux/store";
import { AccountsList } from "./AccountsList";

import { fakeRestoreFromMnemonic } from "../../mocks/helpers";
import { fireEvent, render, screen, waitFor, within } from "../../mocks/testUtils";
import { MnemonicAccount } from "../../types/Account";
import { fakeExtraArguments } from "../../mocks/fakeExtraArgument";
import { multisigsSlice } from "../../utils/redux/slices/multisigsSlice";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";

const { addAccount, addMockMnemonicAccounts } = accountsSlice.actions;

const GOOGLE_ACCOUNT_LABEL1 = "my google account 1";
const GOOGLE_ACCOUNT_LABEL2 = "my google account 2";
const MOCK_FINGETPRINT1 = "mockFin1";
const MOCK_FINGETPRINT2 = "mockFin2";

describe("<AccountList />", () => {
  test("Displays accounts in store with label and formated pkh", async () => {
    store.dispatch(
      addMockMnemonicAccounts([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
        mockMnemonicAccount(2),
      ])
    );

    render(<AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />);

    const results = screen.getAllByTestId(/account-tile/);
    expect(results).toHaveLength(3);

    results.forEach((result, i) => {
      const { getByTestId } = within(result);
      const identifiers = getByTestId("account-identifier");

      expect(identifiers).toHaveTextContent(mockAccountLabel("mnemonic", i));
      expect(identifiers).toHaveTextContent(formatPkh(mockImplicitAddress(i).pkh));
    });
  });

  it("Accounts are displayed by group (case mnemonic social and multisig)", async () => {
    await restore();
    render(<AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />);
    expect(screen.getAllByTestId(/account-tile/)).toHaveLength(7);
    expect(screen.getAllByTestId(/account-group/)).toHaveLength(4);

    const socialAccounts = screen.getByTestId(/account-group-social/i);
    expect(within(socialAccounts).getAllByTestId(/account-tile/)).toHaveLength(2);
    expect(socialAccounts).toHaveTextContent("Social Accounts");
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);

    const seedPhrase1 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGETPRINT1}`);
    expect(within(seedPhrase1).getAllByTestId(/account-tile/)).toHaveLength(2);
    expect(seedPhrase1).toHaveTextContent(`Seedphrase ${MOCK_FINGETPRINT1}`);
    expect(seedPhrase1).toHaveTextContent("Account 0");
    expect(seedPhrase1).toHaveTextContent("Account 1");

    const seedPhrase2 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGETPRINT2}`);
    expect(within(seedPhrase2).getAllByTestId(/account-tile/)).toHaveLength(1);
    expect(seedPhrase2).toHaveTextContent(`Seedphrase ${MOCK_FINGETPRINT2}`);
    expect(seedPhrase2).toHaveTextContent("Account");

    const multisigAccounts = screen.getByTestId(/account-group-multisig/i);
    expect(within(multisigAccounts).getAllByTestId(/account-tile/)).toHaveLength(2);
    expect(multisigAccounts).toHaveTextContent(/multisig account 0/i);
    expect(multisigAccounts).toHaveTextContent(/multisig account 1/i);
  });

  test("All accounts linked to a given mnemonic can be deleted by a CTA action and confirmation modal", async () => {
    await restore();
    render(<AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />);

    expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(2);
    const seedPhrase1 = screen.getAllByTestId(/account-group-seedphrase/i)[0];

    const { getByTestId, getByRole } = within(seedPhrase1);
    const cta = getByTestId(/^popover-cta$/i);
    fireEvent.click(cta);

    await waitFor(() => {
      expect(getByRole("dialog")).toHaveTextContent("Remove");
    });

    const removeBtn = getByRole("button", { name: /^remove$/i });

    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          `Are you sure you want to remove all accounts derived from Seedphrase ${MOCK_FINGETPRINT1}?`
        )
      ).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole("button", { name: /^confirm$/i });

    fireEvent.click(confirmBtn);

    expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(1);
    await waitFor(() => {
      expect(
        screen.queryByText(
          `Are you sure you want to delete all accounts derived from Seedphrase ${MOCK_FINGETPRINT1}?`
        )
      ).not.toBeInTheDocument();
    });
  });

  test("User can derive a new account for a mnemonic with a CTA action, by providing a label and password", async () => {
    const LABEL = "my label";
    await restore();
    render(<AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />);

    expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(2);
    const seedPhrase1 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGETPRINT1}`);

    const { getByTestId, getByRole } = within(seedPhrase1);
    const cta = getByTestId(/^popover-cta$/i);
    fireEvent.click(cta);

    expect(await screen.findByRole("dialog")).toHaveTextContent("Create");

    const createBtn = getByRole("button", { name: /^create$/i });

    fireEvent.click(createBtn);
    screen.getByText(/name your account/i);

    const nameInput = screen.getByLabelText(/account name/i);

    fireEvent.change(nameInput, { target: { value: LABEL } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(passwordInput, { target: { value: "myPassword" } });

    await waitFor(() => {
      const submitBtn = screen.getByRole("button", { name: /submit/i });
      expect(submitBtn).toBeEnabled();
    });

    const account = mockImplicitAccount(2, undefined, MOCK_FINGETPRINT1);
    fakeExtraArguments.derivePublicKeyPair.mockResolvedValue({
      pkh: account.address.pkh,
      pk: account.pk,
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    });

    {
      const seedPhrase1 = screen.getByTestId(`account-group-Seedphrase ${MOCK_FINGETPRINT1}`);

      const tiles = within(seedPhrase1).getAllByTestId(/account-tile/);
      expect(tiles).toHaveLength(3);

      expect(tiles[2]).toHaveTextContent(LABEL);
    }
  });
});

const restore = async () => {
  await store.dispatch(
    fakeRestoreFromMnemonic({
      seedFingerprint: MOCK_FINGETPRINT1,
      accounts: [
        mockImplicitAccount(0, undefined, MOCK_FINGETPRINT1),
        mockImplicitAccount(1, undefined, MOCK_FINGETPRINT1),
      ] as MnemonicAccount[],
    })
  );

  await store.dispatch(
    fakeRestoreFromMnemonic({
      seedFingerprint: MOCK_FINGETPRINT2,
      accounts: [mockImplicitAccount(4, undefined, MOCK_FINGETPRINT2)] as MnemonicAccount[],
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
