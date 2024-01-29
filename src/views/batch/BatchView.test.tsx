import { OpKind, OperationContentsAndResult } from "@taquito/rpc";
import { TezosOperationError } from "@taquito/taquito";
import { userEvent } from "@testing-library/user-event";

import { BatchView, tokenTitle } from "./BatchView";
import { mockImplicitAccount, mockTezOperation } from "../../mocks/factories";
import { addAccount, mockEstimatedFee } from "../../mocks/helpers";
import { render, screen, waitFor, within } from "../../mocks/testUtils";
import { mockToast } from "../../mocks/toast";
import { ghostFA2, ghostTezzard } from "../../mocks/tokens";
import { makeAccountOperations } from "../../types/AccountOperations";
import { Operation } from "../../types/Operation";
import { estimate } from "../../utils/tezos";

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

      user.click(screen.getByRole("button", { name: "Submit Batch" }));

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({
          description: "something went wrong",
          status: "error",
        })
      );
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

        user.click(screen.getByRole("button", { name: "Submit Batch" }));

        let estimationStatuses: HTMLElement[] = [];
        await waitFor(() => {
          estimationStatuses = screen.getAllByTestId("estimation-status");
          expect(estimationStatuses.length).toEqual(3);
        });
        expect(estimationStatuses[0]).toHaveTextContent(/^Estimated$/);
        expect(estimationStatuses[1]).toHaveTextContent("Failed");
        expect(estimationStatuses[2]).toHaveTextContent("Not Estimated");
      }
    );

    it("renders successful estimation statuses on a successful batch estimation", async () => {
      const user = userEvent.setup();
      addAccount(mockImplicitAccount(0));
      mockEstimatedFee(100);

      render(<BatchView operations={operations} />);

      user.click(screen.getByRole("button", { name: "Submit Batch" }));

      let estimationStatuses: HTMLElement[] = [];
      await waitFor(() => {
        estimationStatuses = screen.getAllByTestId("estimation-status");
        expect(estimationStatuses.length).toEqual(3);
      });
      expect(estimationStatuses[0]).toHaveTextContent(/^Estimated$/);
      expect(estimationStatuses[1]).toHaveTextContent(/^Estimated$/);
      expect(estimationStatuses[2]).toHaveTextContent(/^Estimated$/);
    });
  });
});

describe("tokenTitle", () => {
  it("returns raw amount if token is missing", () => {
    expect(tokenTitle(undefined, "1000000")).toBe("1000000 Unknown Token");
  });

  it("doesn't return symbol if token name is absent", () => {
    expect(tokenTitle(ghostTezzard, "1000000")).toBe("1000000 Tezzardz #24");
  });

  it("returns symbol if name is absent", () => {
    const token = ghostTezzard;
    delete token.metadata.name;
    expect(tokenTitle(token, "1000000")).toBe("1000000 FKR");
  });

  it("returns just amount if neither name nor symbol are present", () => {
    expect(tokenTitle({ ...ghostTezzard, metadata: {} }, "1000000")).toBe("1000000");
  });

  it("returns pretty amount if decimals field is present", () => {
    expect(tokenTitle(ghostFA2, "1000321")).toBe("10.00321 Klondike3");
  });
});
