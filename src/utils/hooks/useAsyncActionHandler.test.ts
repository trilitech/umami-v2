import { waitFor } from "@testing-library/react";

import { useAsyncActionHandler } from "./useAsyncActionHandler";
import { act, renderHook } from "../../mocks/testUtils";
import { mockToast } from "../../mocks/toast";

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
