import { render, screen } from "@testing-library/react";
import { mockDelegation, mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import assetsSlice from "../../utils/redux/slices/assetsSlice";
import store from "../../utils/redux/store";
import DelegationsView from "./DelegationsView";

jest.mock("react-query");
const { updateDelegations } = assetsSlice.actions;

const fixture = () => (
  <ReduxStore>
    <DelegationsView />
  </ReduxStore>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.add([mockImplicitAccount(0)]));
});

describe("<DelegationsView />", () => {
  it("a message 'currently not delegating' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/currently not delegating/i)).toBeInTheDocument();
  });

  it("should display the delegations of all accounts", () => {
    store.dispatch(
      accountsSlice.actions.add([
        mockImplicitAccount(1),
        mockImplicitAccount(2),
        mockImplicitAccount(3),
      ])
    );
    store.dispatch(
      updateDelegations([
        {
          pkh: mockImplicitAccount(1).address.pkh,
          delegation: mockDelegation(
            1,
            17890,
            mockImplicitAddress(4).pkh,
            "Baker 1",
            new Date("2022-10-01")
          ),
        },
        {
          pkh: mockImplicitAccount(2).address.pkh,
          delegation: mockDelegation(2, 85000, mockImplicitAddress(5).pkh, "Baker 2"),
        },
        {
          pkh: mockImplicitAccount(3).address.pkh,
          delegation: mockDelegation(3, 37490, mockImplicitAddress(6).pkh, "Baker 3"),
        },
      ])
    );
    render(fixture());
    expect(screen.getAllByTestId("delegation-row")).toHaveLength(3);
  });
});
