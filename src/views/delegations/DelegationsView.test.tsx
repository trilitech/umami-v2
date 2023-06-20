import { render, screen } from "@testing-library/react";
import { mockDelegation, mockImplicitAddress } from "../../mocks/factories";
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
          pkh: mockImplicitAddress(1).pkh,
          delegation: mockDelegation(
            1,
            17890,
            mockImplicitAddress(4).pkh,
            "Baker 1",
            new Date("2022-10-01")
          ),
        },
        {
          pkh: mockImplicitAddress(2).pkh,
          delegation: mockDelegation(2, 85000, mockImplicitAddress(5).pkh, "Baker 2"),
        },
        {
          pkh: mockImplicitAddress(3).pkh,
          delegation: mockDelegation(3, 37490, mockImplicitAddress(6).pkh, "Baker 3"),
        },
      ])
    );
    render(fixture());
    expect(screen.getAllByTestId("delegation-row")).toHaveLength(3);
  });
});
