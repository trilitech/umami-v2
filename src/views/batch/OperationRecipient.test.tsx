import {
  mockDelegationOperation,
  mockFA12Operation,
  mockFA2Operation,
  mockImplicitAddress,
  mockNftOperation,
  mockTezOperation,
  mockUndelegationOperation,
} from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { OperationRecipient } from "./OperationRecipient";

describe("<OperationRecipient />", () => {
  test("undelegation", () => {
    render(<OperationRecipient operation={mockUndelegationOperation(0)} />);
    expect(screen.getByTestId("recipient")).toHaveTextContent("N/A");
  });

  test("contract_origination", () => {
    render(
      <OperationRecipient
        operation={{
          type: "contract_origination",
          storage: {},
          code: [],
          sender: mockImplicitAddress(0),
        }}
      />
    );
    expect(screen.getByTestId("recipient")).toHaveTextContent("N/A");
  });

  test("delegation", () => {
    render(<OperationRecipient operation={mockDelegationOperation(0)} />);
    expect(screen.getByTestId("recipient")).toHaveTextContent("tz1UZ...eJ3Vf");
  });

  test("tez", () => {
    render(<OperationRecipient operation={mockTezOperation(1)} />);
    expect(screen.getByTestId("recipient")).toHaveTextContent("tz1ik...Cc43D");
  });

  test("fa1.2", () => {
    render(<OperationRecipient operation={mockFA12Operation(1)} />);
    expect(screen.getByTestId("recipient")).toHaveTextContent("tz1ik...Cc43D");
  });

  test("fa2", () => {
    render(<OperationRecipient operation={mockFA2Operation(1)} />);
    expect(screen.getByTestId("recipient")).toHaveTextContent("tz1ik...Cc43D");
  });

  test("nft", () => {
    render(<OperationRecipient operation={mockNftOperation(1)} />);
    expect(screen.getByTestId("recipient")).toHaveTextContent("tz1ik...Cc43D");
  });
});
