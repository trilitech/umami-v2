import { useCollapseMenu } from "./useCollapseMenu";
import { act, renderHook } from "../../mocks/testUtils";

describe("useCollapseMenu", () => {
  it("is expanded by default", () => {
    const {
      result: {
        current: { isCollapsed },
      },
    } = renderHook(() => useCollapseMenu());

    expect(isCollapsed).toBe(false);
  });

  it("toggles collapsed state", () => {
    const { result: view } = renderHook(() => useCollapseMenu());

    act(() => view.current.toggle());

    expect(view.current.isCollapsed).toBe(true);

    act(() => view.current.toggle());

    () => expect(view.current.isCollapsed).toBe(false);
  });
});
