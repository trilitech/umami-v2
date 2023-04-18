import "@testing-library/jest-dom";
import { mockAccount, mockAccountLabel, mockPkh } from "../../mocks/factories";
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import { store } from "../../utils/store/store";
import { AccountsList } from "./AccountsList";

import { mockPk } from "../../mocks/factories";
import "../../mocks/mockGetRandomValues";
import { render, screen, within } from "../../mocks/testUtils";
import { AccountType } from "../../types/Account";
import { restoreAccountsFromSecret } from "../../utils/store/thunks/restoreAccountsFromSecret";
import { addressExists, getFingerPrint } from "../../utils/tezos";
import HomeView from "./HomeView";

const { add, reset } = accountsSlice.actions;
jest.mock("../../utils/tezos");
const getFingerPrintMock = getFingerPrint as jest.Mock;
const addressExistsMock = addressExists as jest.Mock;

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

  it("Accounts that are restored by user are displayed by group(case mnemonic and social)", async () => {
    await restore();
    render(<HomeView />);
    expect(screen.getAllByTestId("account-tile")).toHaveLength(5);
    expect(screen.getAllByTestId(/account-group/)).toHaveLength(3);

    const socialAccounts = screen.getByTestId("account-group-social");
    expect(within(socialAccounts).getAllByTestId("account-tile")).toHaveLength(
      2
    );
    expect(socialAccounts).toHaveTextContent("social");
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);
    expect(socialAccounts).toHaveTextContent(GOOGLE_ACCOUNT_LABEL2);

    const seedPhrase1 = screen.getAllByTestId(/account-group-seedphrase/)[0];
    const seedPhrase2 = screen.getAllByTestId(/account-group-seedphrase/)[1];
    expect(within(seedPhrase1).getAllByTestId("account-tile")).toHaveLength(2);
    expect(seedPhrase1).toHaveTextContent(`seedphrase ${MOCK_FINGETPRINT1}`);
    expect(seedPhrase1).toHaveTextContent("Account 0");
    expect(seedPhrase1).toHaveTextContent("Account 1");

    expect(within(seedPhrase2).getAllByTestId("account-tile")).toHaveLength(1);
    expect(seedPhrase2).toHaveTextContent(`seedphrase ${MOCK_FINGETPRINT2}`);
    expect(seedPhrase2).toHaveTextContent("Account 0");
  });
});

const restore = async () => {
  getFingerPrintMock.mockResolvedValue(MOCK_FINGETPRINT1);
  addressExistsMock.mockResolvedValueOnce(true);
  addressExistsMock.mockResolvedValueOnce(true);
  addressExistsMock.mockResolvedValueOnce(false);
  await store.dispatch(restoreAccountsFromSecret("seed1", "mock"));

  getFingerPrintMock.mockResolvedValue(MOCK_FINGETPRINT2);
  addressExistsMock.mockResolvedValueOnce(false);
  await store.dispatch(restoreAccountsFromSecret("seed2", "mock"));

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
