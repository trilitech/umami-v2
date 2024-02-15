import { act, renderHook } from "@testing-library/react";

import { useAsyncActionHandler } from "./useAsyncActionHandler";
import { mockToast } from "../../mocks/toast";
import { ReduxStore } from "../../providers/ReduxStore";

const fixture = () => renderHook(() => useAsyncActionHandler(), { wrapper: ReduxStore });

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

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        void view.result.current.handleAsyncAction(async () => {
          // some delay to make sure the second computation doesn't start while the first one is still running
          await new Promise(resolve => setTimeout(resolve, 10));
          sharedVariable.data += 1;
        });
        // the only way to simulate that is to rerender during the computation
        // technically, if the rerender didn't happen it's still possible to run multiple computations at the same time
        view.rerender();
        await view.result.current.handleAsyncAction(async () => {
          sharedVariable.data += 1;
          return Promise.resolve();
        });
      });

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
    });

    it("throws when the computation fails", async () => {
      const view = fixture();

      await expect(
        act(() =>
          view.result.current.handleAsyncActionUnsafe(() => Promise.reject(new Error("test error")))
        )
      ).rejects.toThrow("test error");
    });
  });
});
