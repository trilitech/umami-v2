import { render, screen } from "@testing-library/react";
import { mockDelegation, mockPkh } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import DelegationsView from "./DelegationsView";

jest.mock("react-query");
const { updateDelegations } = assetsSlice.actions;

const fixture = () => (
  <ReduxStore>
    <DelegationsView />
  </ReduxStore>
);

describe("<DelegationsView />", () => {
  it("a message 'currently not delegating' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/currently not delegating/i)).toBeInTheDocument();
  });

  it("should display the delegations of all accounts", () => {
    store.dispatch(
      updateDelegations([
        {
          pkh: mockPkh(1),
          delegation: mockDelegation(
            1,
            17890,
            mockPkh(4),
            "Baker 1",
            new Date("2022-10-01")
          ),
        },
        {
          pkh: mockPkh(2),
          delegation: mockDelegation(2, 85000, mockPkh(5), "Baker 2"),
        },
        {
          pkh: mockPkh(3),
          delegation: mockDelegation(3, 37490, mockPkh(6), "Baker 3"),
        },
      ])
    );
    render(fixture());
    expect(screen.getAllByTestId("delegation-row")).toHaveLength(3);
  });
});
