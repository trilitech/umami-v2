import "@testing-library/jest-dom";
import { mockAccount, mockAccountLabel, mockPkh } from "../../mocks/factories";
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import { store } from "../../utils/store/store";
import { AccountsList } from "./AccountsList";

import { mockPk } from "../../mocks/factories";
import "../../mocks/mockGetRandomValues";
import { act, render, screen, waitFor, within } from "../../mocks/testUtils";
import { AccountType } from "../../types/Account";

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

    render(<AccountsList onOpen={() => {}} />);

    const results = screen.getAllByTestId("account-tile");
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
    render(<AccountsList onOpen={() => {}} />);
    expect(screen.getAllByTestId("account-tile")).toHaveLength(5);
    expect(screen.getAllByTestId(/account-group/)).toHaveLength(3);

    const socialAccounts = screen.getByTestId(/account-group-social/i);
    expect(within(socialAccounts).getAllByTestId("account-tile")).toHaveLength(
      2
    );
    expect(socialAccounts).toHaveTextContent("Social Accounts");
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);

    const seedPhrase1 = screen.getAllByTestId(/account-group-seedphrase/i)[0];
    const seedPhrase2 = screen.getAllByTestId(/account-group-seedphrase/i)[1];
    expect(within(seedPhrase1).getAllByTestId("account-tile")).toHaveLength(2);
    expect(seedPhrase1).toHaveTextContent(`Seedphrase ${MOCK_FINGETPRINT1}`);
    expect(seedPhrase1).toHaveTextContent("Account 0");
    expect(seedPhrase1).toHaveTextContent("Account 1");

    expect(within(seedPhrase2).getAllByTestId("account-tile")).toHaveLength(1);
    expect(seedPhrase2).toHaveTextContent(`Seedphrase ${MOCK_FINGETPRINT2}`);
    expect(seedPhrase2).toHaveTextContent("Account");
  });

  test("All accounts linked to a given mnemonic can be deleted by a CTA action and confirmation modal", async () => {
    await restore();
    render(<AccountsList onOpen={() => {}} />);

    expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(2);
    const seedPhrase1 = screen.getAllByTestId(/account-group-seedphrase/i)[0];

    const { getByTestId, getByRole } = within(seedPhrase1);
    const cta = getByTestId(/^popover-cta$/i);
    // act needed because we get a false warning
    // this fix allthough applied doesn't work
    // https://github.com/chakra-ui/chakra-ui/issues/2684
    act(() => {
      cta.click();
    });
    await waitFor(() => {
      expect(getByRole("dialog")).toHaveTextContent("Remove");
    });

    act(() => {
      getByRole("button", { name: /^remove$/i }).click();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          `Are you sure you want to delete all accounts derived from Seedphrase ${MOCK_FINGETPRINT1}?`
        )
      ).toBeInTheDocument();
    });

    act(() => {
      screen.getByRole("button", { name: /^confirm$/i }).click();
    });

    expect(screen.getAllByTestId(/account-group-seedphrase/i)).toHaveLength(1);
  });
});

const restore = async () => {
  store.dispatch(
    add([
      mockAccount(0, undefined, MOCK_FINGETPRINT1),
      mockAccount(1, undefined, MOCK_FINGETPRINT1),
    ])
  );
  store.dispatch(add([mockAccount(3, undefined, MOCK_FINGETPRINT2)]));

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
