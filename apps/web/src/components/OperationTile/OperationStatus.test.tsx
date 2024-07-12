import { type UmamiStore, makeStore } from "@umami/state";

import { OperationStatus } from "./OperationStatus";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<OperationStatus />", () => {
  it.each([
    { status: "applied", icon: "checkmark" },
    { status: "pending", icon: "hourglass" },
    { status: "failed", icon: "crossed-circle" },
  ] as const)("renders $icon for $status", ({ status, icon }) => {
    render(<OperationStatus status={status} />, { store });

    expect(screen.getByTestId(icon)).toBeVisible();
  });
});
