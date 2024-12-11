import { type UmamiStore, errorsActions, makeStore } from "@umami/state";
import { type ErrorContext } from "@umami/utils";

import { ErrorLogsMenu } from "./ErrorLogsMenu";
import { renderInDrawer, screen, userEvent } from "../../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<ErrorLogsMenu />", () => {
  it("renders empty state when there are no errors", async () => {
    await renderInDrawer(<ErrorLogsMenu />, store);

    expect(screen.getByTestId("empty-state-message")).toBeVisible();
    expect(screen.queryByText("Download")).not.toBeInTheDocument();
    expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
  });

  describe("when there are errors", () => {
    beforeEach(() => {
      const mockErrors = [
        { timestamp: "2023-01-01", description: "Error 1" },
        { timestamp: "2023-01-02", description: "Error 2" },
      ] as ErrorContext[];

      store.dispatch(errorsActions.add(mockErrors[0]));
      store.dispatch(errorsActions.add(mockErrors[1]));
    });

    it("renders error logs", async () => {
      await renderInDrawer(<ErrorLogsMenu />, store);

      expect(screen.getByText("Error 1")).toBeVisible();
      expect(screen.getByText("Error 2")).toBeVisible();
      expect(screen.getByText("2023-01-01")).toBeVisible();
      expect(screen.getByText("2023-01-02")).toBeVisible();
    });

    it("displays Download and Clear All buttons", async () => {
      await renderInDrawer(<ErrorLogsMenu />, store);

      expect(screen.getByText("Download")).toBeVisible();
      expect(screen.getByText("Clear All")).toBeVisible();
    });

    it("clears error list when Clear All is clicked", async () => {
      const user = userEvent.setup();

      await renderInDrawer(<ErrorLogsMenu />, store);

      await user.click(screen.getByText("Clear All"));

      expect(screen.getByTestId("empty-state-message")).toBeVisible();
    });
  });
});
