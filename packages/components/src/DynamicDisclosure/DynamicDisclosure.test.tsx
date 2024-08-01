import { useDynamicDrawer, useDynamicModal } from "./DynamicDisclosure";
import { act, render, renderHook, screen } from "../testUtils";

describe("DynamicDisclosure", () => {
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
      expect(screen.getByText("test2 data")).toBeVisible();
    });

    it("closes the modal", async () => {
      const view = renderHook(() => useDynamicModal());
      await act(() => view.result.current.openWith(<div>test data</div>));
      act(() => view.result.current.onClose());
      expect(view.result.current.isOpen).toBe(false);
      render(view.result.current.content);
      expect(screen.queryByText("test data")).not.toBeInTheDocument();
    });

    it("calls the onClose callback when the modal is closed", async () => {
      const onClose = jest.fn();
      const view = renderHook(() => useDynamicModal());
      await act(() => view.result.current.openWith(<div>test data</div>, { onClose }));
      act(() => view.result.current.onClose());
      expect(onClose).toHaveBeenCalled();
    });

    it("handles multiple modals with goBack", async () => {
      const view = renderHook(() => useDynamicModal());
      await act(() => view.result.current.openWith(<div>test data 1</div>));
      await act(() => view.result.current.openWith(<div>test data 2</div>));
      act(() => view.result.current.goBack());
      expect(view.result.current.isOpen).toBe(true);
      render(view.result.current.content);
      expect(screen.getByText("test data 1")).toBeVisible();
      expect(screen.queryByText("test data 2")).not.toBeInTheDocument();
    });
  });

  describe("useDynamicDrawer", () => {
    it("is closed by default", () => {
      const view = renderHook(() => useDynamicDrawer());
      expect(view.result.current.isOpen).toBe(false);
    });

    it("opens a modal with the provided content", async () => {
      const view = renderHook(() => useDynamicDrawer());
      await act(() => view.result.current.openWith(<div>test data</div>));
      expect(view.result.current.isOpen).toBe(true);
      render(view.result.current.content);
      expect(screen.getByText("test data")).toBeVisible();
    });

    it("replaces the current content with the new one", async () => {
      const view = renderHook(() => useDynamicDrawer());
      await act(() => view.result.current.openWith(<div>test data</div>));
      await act(() => view.result.current.openWith(<div>test2 data</div>));
      expect(view.result.current.isOpen).toBe(true);
      render(view.result.current.content);
      expect(screen.queryByText("test data")).not.toBeInTheDocument();
      expect(screen.getByText("test2 data")).toBeVisible();
    });

    it("closes the modal", async () => {
      const view = renderHook(() => useDynamicDrawer());
      await act(() => view.result.current.openWith(<div>test data</div>));
      act(() => view.result.current.onClose());
      expect(view.result.current.isOpen).toBe(false);
      render(view.result.current.content);
      expect(screen.queryByText("test data")).not.toBeInTheDocument();
    });

    it("calls the onClose callback when the modal is closed", async () => {
      const onClose = jest.fn();
      const view = renderHook(() => useDynamicDrawer());
      await act(() => view.result.current.openWith(<div>test data</div>, { onClose }));
      act(() => view.result.current.onClose());
      expect(onClose).toHaveBeenCalled();
    });

    it("handles multiple drawers with goBack", async () => {
      const view = renderHook(() => useDynamicDrawer());
      await act(() => view.result.current.openWith(<div>test data 1</div>));
      await act(() => view.result.current.openWith(<div>test data 2</div>));
      act(() => view.result.current.goBack());
      expect(view.result.current.isOpen).toBe(true);
      render(view.result.current.content);
      expect(screen.getByText("test data 1")).toBeVisible();
      expect(screen.queryByText("test data 2")).not.toBeInTheDocument();
    });
  });
});
