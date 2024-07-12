import { type UmamiStore, assetsActions, makeStore } from "@umami/state";

import { OperationStatus } from "./OperationStatus";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<OperationStatus />", () => {
  it("renders a checkmark if the operation is applied and the block is finalised", () => {
    store.dispatch(assetsActions.updateBlock({ level: 2, cycle: 2 }));
    render(<OperationStatus level={0} status="applied" />, { store });

    expect(screen.getByTestId("checkmark")).toBeInTheDocument();
    expect(screen.queryByTestId("hourglass")).not.toBeInTheDocument();
    expect(screen.queryByTestId("crossed-circle")).not.toBeInTheDocument();
  });

  it("renders an hourglass if the operation is applied but the block has not been finalised yet", () => {
    render(<OperationStatus level={0} status="applied" />, { store });

    expect(screen.queryByTestId("checkmark")).not.toBeInTheDocument();
    expect(screen.getByTestId("hourglass")).toBeInTheDocument();
    expect(screen.queryByTestId("crossed-circle")).not.toBeInTheDocument();
  });

  it.each(["failed", "backtracked", "skipped"])(
    "renders a crossed circle if the operation has status: %s",
    status => {
      store.dispatch(assetsActions.updateBlock({ level: 2, cycle: 0 }));
      render(<OperationStatus level={0} status={status} />, { store });

      expect(screen.queryByTestId("checkmark")).not.toBeInTheDocument();
      expect(screen.queryByTestId("hourglass")).not.toBeInTheDocument();
      expect(screen.getByTestId("crossed-circle")).toBeInTheDocument();
    }
  );
});
