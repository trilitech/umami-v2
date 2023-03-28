import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { mockAccount, mockAccountLabel, mockPkh } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import { store } from "../../utils/store/store";
import { AccountsList } from "./AccountsList";

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
      <ReduxStore>
        <AccountsList onOpen={() => {}} />
      </ReduxStore>
    );

    const results = screen.getAllByTestId("account-tile");
    expect(results).toHaveLength(3);

    results.forEach((result, i) => {
      const { getByTestId } = within(result);
      const identifiers = getByTestId("account-identifiers");

      expect(identifiers).toHaveTextContent(mockAccountLabel(i));
      expect(identifiers).toHaveTextContent(formatPkh(mockPkh(i)));
    });
  });
});
