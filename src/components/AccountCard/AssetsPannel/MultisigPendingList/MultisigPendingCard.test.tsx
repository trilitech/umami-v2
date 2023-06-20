import { mockImplicitAddress } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import MultisigPendingCard from "./MultisigPendingCard";

describe("<MultisigPendingCard/>", () => {
  it("displays the correct number of pending approvals", () => {
    const pkh0 = mockImplicitAddress(0);
    const pkh1 = mockImplicitAddress(1);
    const pkh2 = mockImplicitAddress(2);
    render(
      <MultisigPendingCard
        operation={{
          key: "1",
          rawActions: "action",
          approvals: [pkh0],
        }}
        threshold={3}
        signers={[pkh0, pkh1, pkh2]}
      />
    );

    expect(screen.getByTestId("multisig-card-text")).toHaveTextContent("2");
  });

  it("displays 0 for pending approvals if there are more approvers than the threshold", () => {
    const pkh0 = mockImplicitAddress(0);
    const pkh1 = mockImplicitAddress(1);
    const pkh2 = mockImplicitAddress(2);
    render(
      <MultisigPendingCard
        operation={{
          key: "1",
          rawActions: "action",
          approvals: [pkh0, pkh1, pkh2],
        }}
        threshold={2}
        signers={[pkh0, pkh1, pkh2]}
      />
    );

    expect(screen.getByTestId("multisig-card-text")).toHaveTextContent("0");
  });
});
