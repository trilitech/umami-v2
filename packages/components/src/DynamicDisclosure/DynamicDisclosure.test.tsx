import { useDynamicDrawer, useDynamicModal, useDynamicModalContext } from "./DynamicDisclosure";
import { act, render, renderHook, screen, waitFor } from "../testUtils";

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

    it("calls the onClose callback when the modal is closed", async () => {
      const onClose = jest.fn();
      const view = renderHook(() => useDynamicModal());
      await act(() => view.result.current.openWith(<div>test data</div>, { onClose }));
      act(() => view.result.current.onClose());
      expect(onClose).toHaveBeenCalled();
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
  });

  describe("goBack functionality", () => {
    it("should go back one step when goBack is called without parameters", () => {
      const { result } = renderHook(() => useDynamicModalContext());

      act(() => {
        result.current.openWith(<div>First</div>);
        result.current.openWith(<div>Second</div>);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.hasPrevious).toBe(true);

      act(() => {
        result.current.goBack();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.hasPrevious).toBe(false);
    });

    it("should go back to specific index when goBack is called with a valid index", async () => {
      const { result } = renderHook(() => useDynamicModalContext());

      act(() => {
        result.current.openWith(<div>First</div>);
      });

      act(() => {
        result.current.openWith(<div>Second</div>);
      });

      act(() => {
        result.current.openWith(<div>Third</div>);
      });

      expect(result.current.hasPrevious).toBe(true);

      act(() => {
        result.current.goBack(0);
      });

      expect(result.current.hasPrevious).toBe(false);
      expect(screen.getByText("First")).toBeVisible();
    });

    it("should update hasPrevious correctly", () => {
      const { result } = renderHook(() => useDynamicModalContext());

      expect(result.current.hasPrevious).toBe(false);

      act(() => {
        result.current.openWith(<div>First</div>);
      });

      expect(result.current.hasPrevious).toBe(false);

      act(() => {
        result.current.openWith(<div>Second</div>);
      });

      expect(result.current.hasPrevious).toBe(true);

      act(() => {
        result.current.goBack();
      });

      expect(result.current.hasPrevious).toBe(false);
    });

    it("should go back one step when goBack is called with out-of-bounds index", async () => {
      const { result } = renderHook(() => useDynamicModalContext());

      act(() => {
        result.current.openWith(<div>First</div>);
        result.current.openWith(<div>Second</div>);
        result.current.openWith(<div>Third</div>);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.hasPrevious).toBe(true);

      act(() => {
        result.current.goBack(5);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.hasPrevious).toBe(true);
      expect(screen.getByText("Second")).toBeVisible();
    });
  });
});
