import { OperationContentsAndResult } from "@taquito/rpc";

import { OperationEstimationStatus } from "./OperationEstimationStatus";
import { render, screen } from "../../mocks/testUtils";

describe("<OperationEstimationStatus />", () => {
  it.each([
    { status: "applied" as const, description: "Estimated" },
    { status: "backtracked" as const, description: "Estimated" },
    { status: "failed" as const, description: "Failed" },
    { status: "skipped" as const, description: "Not Estimated" },
  ])("renders description for $status", ({ status, description }) => {
    render(
      <OperationEstimationStatus
        estimationResult={
          { metadata: { operation_result: { status } } } as OperationContentsAndResult
        }
      />
    );
    expect(screen.getByTestId("estimation-status")).toHaveTextContent(description);
  });

  it("renders nothing if estimationResult is undefined", () => {
    render(<OperationEstimationStatus estimationResult={undefined} />);

    expect(screen.queryByTestId("estimation-status")).not.toBeInTheDocument();
  });

  it("renders nothing if estimationResult schema is malformed", () => {
    render(<OperationEstimationStatus estimationResult={{} as any} />);

    expect(screen.queryByTestId("estimation-status")).not.toBeInTheDocument();
  });
});
