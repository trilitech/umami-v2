import { renderHook, act } from "@testing-library/react";
import { mockToast } from "../../mocks/toast";
import { useAsyncActionHandler } from "./useAsyncActionHandler";
jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    // Mock taost since it has an erratic behavior in RTL
    // https://github.com/chakra-ui/chakra-ui/issues/2969
    //
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useToast: require("../../mocks/toast").useToast,
  };
});

describe("useSafeLoading", () => {
  describe("isLoading", () => {
    it("is false by default", () => {
      const view = renderHook(() => useAsyncActionHandler());
      expect(view.result.current.isLoading).toBe(false);
    });

    it("changes to true during computation and back to false when done", async () => {
      const view = renderHook(() => useAsyncActionHandler());

      await act(() =>
        view.result.current.handleAsyncAction(async () => {
          expect(view.result.current.isLoading).toBe(true);
        })
      );
      expect(view.result.current.isLoading).toBe(false);
    });

    it("changes to true during computation and back to false when the computation fails", async () => {
      const view = renderHook(() => useAsyncActionHandler());

      await act(() =>
        view.result.current.handleAsyncAction(async () => {
          expect(view.result.current.isLoading).toBe(true);
          throw new Error("test");
        })
      );
      expect(view.result.current.isLoading).toBe(false);
    });

    it("prevents multiple computations from running at the same time", async () => {
      const view = renderHook(() => useAsyncActionHandler());

      const sharedVariable = { data: 0 };

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        view.result.current.handleAsyncAction(async () => {
          // some delay to make sure the second computation doesn't start while the first one is still running
          await new Promise(resolve => setTimeout(resolve, 10));
          sharedVariable.data += 1;
        });
        // the only way to simulate that is to rerender during the computation
        // technically, if the rerender didn't happen it's still possible to run multiple computations at the same time
        view.rerender();
        await view.result.current.handleAsyncAction(async () => {
          sharedVariable.data += 1;
        });
      });
      expect(sharedVariable.data).toBe(1);
    });

    it("allows multiple computations to be run sequentially", async () => {
      const view = renderHook(() => useAsyncActionHandler());

      const sharedVariable = { data: 0 };

      await act(async () => {
        for (let i = 0; i < 2; i++) {
          await view.result.current.handleAsyncAction(async () => {
            sharedVariable.data += 1;
          });
          view.rerender();
        }
      });
      expect(sharedVariable.data).toBe(2);
    });
  });

  describe("withLoading", () => {
    it("returns the result of the computation", async () => {
      const view = renderHook(() => useAsyncActionHandler());
      let result;
      await act(async () => {
        result = await view.result.current.handleAsyncAction(async () => 42);
      });
      expect(result).toBe(42);
    });

    it("returns undefined when the computation fails", async () => {
      const view = renderHook(() => useAsyncActionHandler());
      const result = await act(async () =>
        view.result.current.handleAsyncAction(async () => {
          throw new Error("test");
        })
      );
      expect(result).toBe(undefined);
    });

    it("passes in the right arguments in toast with an object", async () => {
      const view = renderHook(() => useAsyncActionHandler());
      await act(async () =>
        view.result.current.handleAsyncAction(
          async () => {
            throw new Error("test");
          },
          { title: "testTitle", description: "testDescription" }
        )
      );
      expect(mockToast).toHaveBeenCalledWith({
        title: "testTitle",
        description: "testDescription",
        status: "error",
      });
    });

    it("passes in the right arguments in toast with a function", async () => {
      const view = renderHook(() => useAsyncActionHandler());
      await act(async () =>
        view.result.current.handleAsyncAction(
          async () => {
            throw new Error("test");
          },
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

  describe("withLoadingUnsafe", () => {
    it("returns the result of the computation", async () => {
      const view = renderHook(() => useAsyncActionHandler());
      const result = await act(async () =>
        view.result.current.handleAsyncActionUnsafe(async () => 42)
      );
      expect(result).toBe(42);
    });

    it("throws when the computation fails", async () => {
      const view = renderHook(() => useAsyncActionHandler());

      await expect(
        act(async () =>
          view.result.current.handleAsyncActionUnsafe(async () => {
            throw new Error("test error");
          })
        )
      ).rejects.toThrow("test error");
    });
  });
});
