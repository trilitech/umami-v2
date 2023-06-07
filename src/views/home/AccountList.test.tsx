import "@testing-library/jest-dom";
import { mockAccount, mockAccountLabel, mockPkh } from "../../mocks/factories";
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import { store } from "../../utils/store/store";
import { AccountsList } from "./AccountsList";

import { mockPk } from "../../mocks/factories";
import { fakeRestoreFromMnemonic } from "../../mocks/helpers";
import "../../mocks/mockGetRandomValues";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "../../mocks/testUtils";
import { AccountType, MnemonicAccount } from "../../types/Account";
import { fakeExtraArguments } from "../../mocks/fakeExtraArgument";

const { add, reset } = accountsSlice.actions;

jest.mock("../../utils/tezos");

const GOOGLE_ACCOUNT_LABEL1 = "my google account 1";
const GOOGLE_ACCOUNT_LABEL2 = "my google account 2";
const MOCK_FINGETPRINT1 = "mockFin1";
const MOCK_FINGETPRINT2 = "mockFin2";

afterEach(() => store.dispatch(reset()));

describe("<AccountList />", () => {
  test("Displays accounts in store with label and formated pkh", async () => {
    store.dispatch(
      accountsSlice.actions.add([
        mockAccount(0),
        mockAccount(1),
        mockAccount(2),
      ])
    );

    render(
      <AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />
    );

    const results = screen.getAllByTestId(/account-tile/);
    expect(results).toHaveLength(3);

    results.forEach((result, i) => {
      const { getByTestId } = within(result);
      const identifiers = getByTestId("account-identifiers");

      expect(identifiers).toHaveTextContent(mockAccountLabel(i));
      expect(identifiers).toHaveTextContent(formatPkh(mockPkh(i)));
    });
  });

  it("Accounts that are restored by user are displayed by group (case mnemonic and social)", async () => {
    await restore();
    render(
      <AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />
    );
    expect(screen.getAllByTestId(/account-tile/)).toHaveLength(5);
    expect(screen.getAllByTestId(/account-group/)).toHaveLength(3);

    const socialAccounts = screen.getByTestId(/account-group-social/i);
    expect(within(socialAccounts).getAllByTestId(/account-tile/)).toHaveLength(
      2
    );
    expect(socialAccounts).toHaveTextContent("Social Accounts");
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);

    const seedPhrase1 = screen.getByTestId(
      `account-group-Seedphrase ${MOCK_FINGETPRINT1}`
    );
    const seedPhrase2 = screen.getByTestId(
      `account-group-Seedphrase ${MOCK_FINGETPRINT2}`
    );
    expect(within(seedPhrase1).getAllByTestId(/account-tile/)).toHaveLength(2);
    expect(seedPhrase1).toHaveTextContent(`Seedphrase ${MOCK_FINGETPRINT1}`);
    expect(seedPhrase1).toHaveTextContent("Account 0");
    expect(seedPhrase1).toHaveTextContent("Account 1");

    expect(within(seedPhrase2).getAllByTestId(/account-tile/)).toHaveLength(1);
    expect(seedPhrase2).toHaveTextContent(`Seedphrase ${MOCK_FINGETPRINT2}`);
    expect(seedPhrase2).toHaveTextContent("Account");
  });

  test("All accounts linked to a given mnemonic can be deleted by a CTA action and confirmation modal", async () => {
    await restore();
    render(
      <AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />
    );

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
          `Are you sure you want to delete all accounts derived from Seedphrase ${MOCK_FINGETPRINT1}?`
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
    render(
      <AccountsList onOpen={() => {}} onSelect={() => {}} selected={null} />
    );

    expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(2);
    const seedPhrase1 = screen.getByTestId(
      `account-group-Seedphrase ${MOCK_FINGETPRINT1}`
    );

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

    await screen.findByText(/Enter Password to continue/i);

    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(passwordInput, { target: { value: "myPass" } });

    await waitFor(() => {
      const submitBtn = screen.getByRole("button", { name: /submit/i });
      expect(submitBtn).toBeEnabled();
    });

    fakeExtraArguments.restoreAccount.mockResolvedValue(
      mockAccount(2, undefined, MOCK_FINGETPRINT1)
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(/Enter Password to continue/i)
      ).not.toBeInTheDocument();
    });

    {
      const seedPhrase1 = screen.getByTestId(
        `account-group-Seedphrase ${MOCK_FINGETPRINT1}`
      );

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
        mockAccount(0, undefined, MOCK_FINGETPRINT1),
        mockAccount(1, undefined, MOCK_FINGETPRINT1),
      ] as MnemonicAccount[],
    })
  );

  await store.dispatch(
    fakeRestoreFromMnemonic({
      seedFingerprint: MOCK_FINGETPRINT2,
      accounts: [
        mockAccount(4, undefined, MOCK_FINGETPRINT2),
      ] as MnemonicAccount[],
    })
  );

  store.dispatch(
    add({
      type: AccountType.SOCIAL,
      idp: "google",
      pkh: mockPkh(6),
      pk: mockPk(6),
      label: GOOGLE_ACCOUNT_LABEL1,
    })
  );

  store.dispatch(
    add({
      type: AccountType.SOCIAL,
      idp: "google",
      pkh: mockPkh(7),
      pk: mockPk(7),
      label: GOOGLE_ACCOUNT_LABEL2,
    })
  );
};
