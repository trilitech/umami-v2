import { mockPkh } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import MultisigPendingCard from "./MultisigPendingCard";

describe("<MultisigPendingCard/>", () => {
  it("displays the correct number of pending approvals", () => {
    const pkh0 = mockPkh(0);
    const pkh1 = mockPkh(1);
    const pkh2 = mockPkh(2);
    render(
      <MultisigPendingCard
        operation={{
          key: "1",
          rawActions: "action",
          approvals: [{ type: "implicit", pkh: pkh0 }],
        }}
        threshold={3}
        signers={[
          { type: "implicit", pkh: pkh0 },
          { type: "implicit", pkh: pkh1 },
          { type: "implicit", pkh: pkh2 },
        ]}
      />
    );

    expect(screen.getByTestId("multisig-card-text")).toHaveTextContent("2");
  });

  it("displays 0 for pending approvals if there are more approvers than the threshold", () => {
    const pkh0 = mockPkh(0);
    const pkh1 = mockPkh(1);
    const pkh2 = mockPkh(2);
    render(
      <MultisigPendingCard
        operation={{
          key: "1",
          rawActions: "action",
          approvals: [
            { type: "implicit", pkh: pkh0 },
            { type: "implicit", pkh: pkh1 },
            { type: "implicit", pkh: pkh2 },
          ],
        }}
        threshold={2}
        signers={[
          { type: "implicit", pkh: pkh0 },
          { type: "implicit", pkh: pkh1 },
          { type: "implicit", pkh: pkh2 },
        ]}
      />
    );

    expect(screen.getByTestId("multisig-card-text")).toHaveTextContent("0");
  });
});
