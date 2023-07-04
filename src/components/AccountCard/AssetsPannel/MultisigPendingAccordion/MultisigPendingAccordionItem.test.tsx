import { Accordion } from "@chakra-ui/react";
import { mockImplicitAddress } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

describe("<MultisigPendingCard/>", () => {
  it("displays the correct number of pending approvals", () => {
    const pkh0 = mockImplicitAddress(0);
    const pkh1 = mockImplicitAddress(1);
    const pkh2 = mockImplicitAddress(2);
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          onApproveOrExecute={() => {}}
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [pkh0],
          }}
          threshold={3}
          signers={[pkh0, pkh1, pkh2]}
        />
      </Accordion>
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("2");
  });

  it("displays 0 for pending approvals if there are more approvers than the threshold", () => {
    const pkh0 = mockImplicitAddress(0);
    const pkh1 = mockImplicitAddress(1);
    const pkh2 = mockImplicitAddress(2);
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          onApproveOrExecute={() => {}}
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [pkh0, pkh1, pkh2],
          }}
          threshold={2}
          signers={[pkh0, pkh1, pkh2]}
        />
      </Accordion>
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("0");
  });
});
