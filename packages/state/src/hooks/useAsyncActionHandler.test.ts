import { CustomError } from "@umami/utils";

import { useAsyncActionHandler } from "./useAsyncActionHandler";
import { act, mockToast, renderHook, waitFor } from "../testUtils";

const fixture = () => renderHook(() => useAsyncActionHandler());

describe("useAsyncActionHandler", () => {
  describe("isLoading", () => {
    it("is false by default", () => {
      const view = fixture();
      expect(view.result.current.isLoading).toBe(false);
    });

    it("changes to true during computation and back to false when done", async () => {
      const view = fixture();

      await act(() =>
        view.result.current.handleAsyncAction(() => {
          expect(view.result.current.isLoading).toBe(true);
          return Promise.resolve();
        })
      );

      expect(view.result.current.isLoading).toBe(false);
    });

    it("changes to true during computation and back to false when the computation fails", async () => {
      const view = fixture();

      await act(() =>
        view.result.current.handleAsyncAction(() => {
          expect(view.result.current.isLoading).toBe(true);
          return Promise.reject(new Error("test"));
        })
      );

      expect(view.result.current.isLoading).toBe(false);
    });

    it("prevents multiple computations from running at the same time", async () => {
      const view = fixture();

      const sharedVariable = { data: 0 };

      act(() => {
        void view.result.current.handleAsyncAction(async () => {
          // some delay to make sure the second computation gets skipped
          await new Promise(resolve => {
            setTimeout(resolve, 10);
          });
          sharedVariable.data = 1;
        });
      });

      await act(() =>
        view.result.current.handleAsyncAction(async () => {
          sharedVariable.data = 2;
          return Promise.resolve();
        })
      );

      await waitFor(() => expect(sharedVariable.data).toBe(1));
      await new Promise(resolve => setTimeout(resolve, 20));
      // 2nd async function not have been ever called
      expect(sharedVariable.data).toBe(1);
    });

    it("allows multiple computations to be run sequentially", async () => {
      const view = fixture();

      const sharedVariable = { data: 0 };

      await act(async () => {
        for (let i = 0; i < 2; i++) {
          await view.result.current.handleAsyncAction(async () => {
            sharedVariable.data += 1;
            return Promise.resolve();
          });
          view.rerender();
        }
      });

      expect(sharedVariable.data).toBe(2);
    });
  });

  describe("handleAsyncAction", () => {
    it("returns the result of the computation", async () => {
      const view = fixture();

      const result = await act(() =>
        view.result.current.handleAsyncAction(() => Promise.resolve(42))
      );

      expect(result).toBe(42);
    });

    it("returns undefined when the computation fails", async () => {
      const view = fixture();

      const result = await act(() =>
        view.result.current.handleAsyncAction(() => Promise.reject(new Error("test")))
      );

      expect(result).toBe(undefined);
    });

    it("passes in the right arguments in toast with an object", async () => {
      const view = fixture();

      await act(async () =>
        view.result.current.handleAsyncAction(() => Promise.reject(new Error("test")), {
          title: "testTitle",
          description: "testDescription",
        })
      );

      expect(mockToast).toHaveBeenCalledWith({
        title: "testTitle",
        description: "testDescription",
        status: "error",
        isClosable: true,
      });
    });

    it("passes in the right arguments in toast with a function", async () => {
      const view = fixture();

      await act(() =>
        view.result.current.handleAsyncAction(
          () => Promise.reject(new Error("test")),
          (err: any) => ({ title: "testTitle", description: err.message })
        )
      );

      expect(mockToast).toHaveBeenCalledWith({
        title: "testTitle",
        description: "test",
        status: "error",
        isClosable: true,
      });
    });
  });

  describe("handleAsyncActionUnsafe", () => {
    it("returns the result of the computation", async () => {
      const view = fixture();
      const result = await act(() =>
        view.result.current.handleAsyncActionUnsafe(() => Promise.resolve(42))
      );

      expect(result).toBe(42);
      expect(mockToast).toHaveBeenCalledTimes(0);
    });

    it("throws when the computation fails", async () => {
      const view = fixture();

      await expect(
        act(() =>
          view.result.current.handleAsyncActionUnsafe(() => Promise.reject(new Error("test error")))
        )
      ).rejects.toThrow("test error");
      expect(mockToast).toHaveBeenCalledTimes(1);
    });

    it("Unsafe propagates the error and shows the toast once on first handling", async () => {
      const view = fixture();

      expect(mockToast).toHaveBeenCalledTimes(0);

      const error: any = new CustomError("test nested error handling");
      await expect(
        act(() => view.result.current.handleAsyncActionUnsafe(() => Promise.reject(error)))
      ).rejects.toThrow("test nested error handling");
      // check that error.processed is set to true
      expect(error.processed).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        description: "test nested error handling",
        status: "error",
        isClosable: true,
      });
      expect(mockToast).toHaveBeenCalledTimes(1);
    });

    it("Unsafe propagates the error and shows no toast on second handling", async () => {
      const view = fixture();

      expect(mockToast).toHaveBeenCalledTimes(0);

      const error: any = new CustomError("test nested error handling");
      error.processed = true;
      await expect(
        act(() => view.result.current.handleAsyncActionUnsafe(() => Promise.reject(error)))
      ).rejects.toThrow("test nested error handling");
      // check that error.processed is still true
      expect(error.processed).toBe(true);
      expect(mockToast).toHaveBeenCalledTimes(0);
    });
  });
});
