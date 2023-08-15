import { act, render, renderHook, screen } from "../mocks/testUtils";
import { useDynamicModal } from "./DynamicModal";

describe("useDynamicModal", () => {
  it("is closed by default", () => {
    const view = renderHook(() => useDynamicModal());
    expect(view.result.current.isOpen).toBe(false);
  });

  it("opens a modal with the provided content", async () => {
    const view = renderHook(() => useDynamicModal());
    await act(() => view.result.current.openWith(<div>test data</div>));
    expect(view.result.current.isOpen).toBe(true);
    render(view.result.current.content);
    expect(screen.getByText("test data")).toBeInTheDocument();
  });

  it("replaces the current content with the new one", async () => {
    const view = renderHook(() => useDynamicModal());
    await act(() => view.result.current.openWith(<div>test data</div>));
    await act(() => view.result.current.openWith(<div>test2 data</div>));
    expect(view.result.current.isOpen).toBe(true);
    render(view.result.current.content);
    expect(screen.queryByText("test data")).not.toBeInTheDocument();
    expect(screen.getByText("test2 data")).toBeInTheDocument();
  });

  it("closes the modal", async () => {
    const view = renderHook(() => useDynamicModal());
    await act(() => view.result.current.openWith(<div>test data</div>));
    act(() => view.result.current.onClose());
    expect(view.result.current.isOpen).toBe(false);
    render(view.result.current.content);
    expect(screen.queryByText("test data")).not.toBeInTheDocument();
  });
});
