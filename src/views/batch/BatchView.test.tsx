import { OpKind, OperationContentsAndResult } from "@taquito/rpc";
import { TezosOperationError } from "@taquito/taquito";
import BigNumber from "bignumber.js";

import { BatchView } from "./BatchView";
import { mockImplicitAccount, mockTezOperation } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { act, render, screen, userEvent, within } from "../../mocks/testUtils";
import { mockToast } from "../../mocks/toast";
import { makeAccountOperations } from "../../types/AccountOperations";
import { Operation } from "../../types/Operation";
import { estimate } from "../../utils/tezos";

jest.mock("../../utils/tezos/estimate");

describe("<BatchView />", () => {
  test("header", () => {
    const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
      mockTezOperation(0),
    ]);
    render(<BatchView operations={operations} />);

    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(within(header).getByTestId("right-header")).toBeInTheDocument();
  });

  test("body", () => {
    const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
      mockTezOperation(0),
      mockTezOperation(0),
      mockTezOperation(0),
    ]);
    render(<BatchView operations={operations} />);

    expect(screen.getAllByTestId("operation").length).toEqual(3);
  });

  describe("footer", () => {
    it("is hidden until there are > 9 operations", () => {
      const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
        mockTezOperation(0),
      ]);
      render(<BatchView operations={operations} />);

      expect(screen.queryByTestId("footer")).not.toBeInTheDocument();
    });

    it("shows up when there are too many operations", () => {
      const ops: Operation[] = [];
      for (let i = 0; i < 10; i++) {
        ops.push(mockTezOperation(i));
      }
      const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), ops);
      render(<BatchView operations={operations} />);

      const footer = screen.getByTestId("footer");
      expect(within(footer).getByTestId("right-header")).toBeInTheDocument();
    });
  });

  describe("estimation statuses", () => {
    const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
      mockTezOperation(0),
      mockTezOperation(1),
      mockTezOperation(2),
    ]);

    it("is hidden until we run the estimation", () => {
      render(<BatchView operations={operations} />);

      expect(screen.queryByTestId("estimation-status")).not.toBeInTheDocument();
    });

    it("doesn't show up if the estimation fails with an unknown error", async () => {
      const user = userEvent.setup();
      jest.mocked(estimate).mockRejectedValue(new Error("something went wrong"));

      render(<BatchView operations={operations} />);

      await act(() => user.click(screen.getByRole("button", { name: "Submit Batch" })));

      expect(mockToast).toHaveBeenCalledWith({
        description: "something went wrong",
        status: "error",
      });
      expect(screen.queryByTestId("estimation-status")).not.toBeInTheDocument();
    });

    it.each(["with", "w/o"])(
      "renders each operation's status accordingly %s reveal",
      async withReveal => {
        const user = userEvent.setup();
        const operationEstimationResults = [
          {
            kind: OpKind.TRANSACTION,
            metadata: { operation_result: { status: "backtracked" } },
          } as OperationContentsAndResult,
          {
            kind: OpKind.TRANSACTION,
            metadata: { operation_result: { status: "failed" } },
          } as OperationContentsAndResult,
          {
            kind: OpKind.TRANSACTION,
            metadata: { operation_result: { status: "skipped" } },
          } as OperationContentsAndResult,
        ];

        if (withReveal === "with") {
          operationEstimationResults.unshift({
            kind: OpKind.REVEAL,
            metadata: { operation_result: { status: "backtracked" } },
          } as OperationContentsAndResult);
        }

        jest
          .mocked(estimate)
          .mockRejectedValue(
            new TezosOperationError([{ kind: "error", id: "id" }], "", operationEstimationResults)
          );

        render(<BatchView operations={operations} />);

        await act(() => user.click(screen.getByRole("button", { name: "Submit Batch" })));

        const estimationStatuses = screen.getAllByTestId("estimation-status");
        expect(estimationStatuses.length).toEqual(3);
        expect(estimationStatuses[0]).toHaveTextContent(/^Estimated$/);
        expect(estimationStatuses[1]).toHaveTextContent("Failed");
        expect(estimationStatuses[2]).toHaveTextContent("Not Estimated");
      }
    );

    it("renders successful estimation statuses on a successful batch estimation", async () => {
      const user = userEvent.setup();
      addAccount(mockImplicitAccount(0));
      jest.mocked(estimate).mockResolvedValueOnce(BigNumber(100));

      render(<BatchView operations={operations} />);

      await act(() => user.click(screen.getByRole("button", { name: "Submit Batch" })));

      const estimationStatuses = screen.getAllByTestId("estimation-status");
      expect(estimationStatuses.length).toEqual(3);
      expect(estimationStatuses[0]).toHaveTextContent(/^Estimated$/);
      expect(estimationStatuses[1]).toHaveTextContent(/^Estimated$/);
      expect(estimationStatuses[2]).toHaveTextContent(/^Estimated$/);
    });
  });
});
