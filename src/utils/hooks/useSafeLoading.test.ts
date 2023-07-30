import { renderHook, act } from "@testing-library/react";
import { useSafeLoading } from "./useSafeLoading";

describe("useSafeLoading", () => {
  describe("isLoading", () => {
    it("is false by default", () => {
      const view = renderHook(() => useSafeLoading());
      expect(view.result.current.isLoading).toBe(false);
    });

    it("changes to true during computation and back to false when done", async () => {
      const view = renderHook(() => useSafeLoading());

      await act(() =>
        view.result.current.withLoading(async () => {
          expect(view.result.current.isLoading).toBe(true);
        })
      );
      expect(view.result.current.isLoading).toBe(false);
    });

    it("changes to true during computation and back to false when the computation fails", async () => {
      const view = renderHook(() => useSafeLoading());

      await act(() =>
        view.result.current.withLoading(async () => {
          expect(view.result.current.isLoading).toBe(true);
          throw new Error("test");
        })
      );
      expect(view.result.current.isLoading).toBe(false);
    });

    it("prevents multiple computations from running at the same time", async () => {
      const view = renderHook(() => useSafeLoading());

      const sharedVariable = { data: 0 };

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        view.result.current.withLoading(async () => {
          // some delay to make sure the second computation doesn't start while the first one is still running
          await new Promise(resolve => setTimeout(resolve, 10));
          sharedVariable.data += 1;
        });
        // the only way to simulate that is to rerender during the computation
        // technically, if the rerender didn't happen it's still possible to run multiple computations at the same time
        view.rerender();
        await view.result.current.withLoading(async () => {
          sharedVariable.data += 1;
        });
      });
      expect(sharedVariable.data).toBe(1);
    });

    it("allows multiple computations to be run sequentially", async () => {
      const view = renderHook(() => useSafeLoading());

      const sharedVariable = { data: 0 };

      await act(async () => {
        for (let i = 0; i < 2; i++) {
          await view.result.current.withLoading(async () => {
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
      const view = renderHook(() => useSafeLoading());
      let result;
      await act(async () => {
        result = await view.result.current.withLoading(async () => 42);
      });
      expect(result).toBe(42);
    });

    it("returns undefined when the computation fails", async () => {
      const view = renderHook(() => useSafeLoading());
      const result = await act(async () =>
        view.result.current.withLoading(async () => {
          throw new Error("test");
        })
      );
      expect(result).toBe(undefined);
    });
  });

  describe("withLoadingUnsafe", () => {
    it("returns the result of the computation", async () => {
      const view = renderHook(() => useSafeLoading());
      const result = await act(async () => view.result.current.withLoadingUnsafe(async () => 42));
      expect(result).toBe(42);
    });

    it("throws when the computation fails", async () => {
      const view = renderHook(() => useSafeLoading());

      await expect(
        act(async () =>
          view.result.current.withLoadingUnsafe(async () => {
            throw new Error("test error");
          })
        )
      ).rejects.toThrow("test error");
    });
  });
});
