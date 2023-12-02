import { OperationRecipient } from "./OperationRecipient";
import {
  mockContractAddress,
  mockContractOrigination,
  mockDelegationOperation,
  mockFA12Operation,
  mockFA2Operation,
  mockNftOperation,
  mockTezOperation,
  mockUndelegationOperation,
} from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";

describe("<OperationRecipient />", () => {
  it.each([mockUndelegationOperation(0), mockContractOrigination(0)])(
    `shows N/A for $type`,
    operation => {
      render(<OperationRecipient operation={operation} />);

      expect(screen.getByTestId("recipient")).toHaveTextContent("N/A");
    }
  );

  it.each([
    mockDelegationOperation(0),
    mockTezOperation(0),
    mockFA12Operation(0),
    mockFA2Operation(0),
    mockNftOperation(0),
  ])(`shows recipient address for $type`, operation => {
    const expectedAddress = formatPkh(operation.recipient.pkh);

    render(<OperationRecipient operation={operation} />);

    expect(screen.getByTestId("recipient")).toHaveTextContent(expectedAddress);
  });

  it("shows contract address for contract_call", () => {
    const contractAddress = mockContractAddress(0);
    const expectedAddress = formatPkh(contractAddress.pkh);

    render(
      <OperationRecipient
        operation={{
          type: "contract_call",
          contract: mockContractAddress(0),
          amount: "10",
          entrypoint: "test",
          args: [{ prim: "unit" }],
        }}
      />
    );

    expect(screen.getByTestId("recipient")).toHaveTextContent(expectedAddress);
  });
});
