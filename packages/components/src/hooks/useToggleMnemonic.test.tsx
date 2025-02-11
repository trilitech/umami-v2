import { act, renderHook } from "../testUtils";
import { useToggleMnemonic } from "./useToggleMnemonic";

describe("useHideMnemonic", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should initialize with isVisible as false", () => {
    const { result } = renderHook(() => useToggleMnemonic());

    expect(result.current.isVisible).toBe(false);
  });

  it("should allow toggling isVisible state", () => {
    const { result } = renderHook(() => useToggleMnemonic());

    act(() => {
      result.current.toggleMnemonic();
    });

    expect(result.current.isVisible).toBe(true);
  });

  it("should automatically hide mnemonic after default timeout (30s)", () => {
    const { result } = renderHook(() => useToggleMnemonic());

    act(() => {
      result.current.toggleMnemonic();
    });

    expect(result.current.isVisible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(result.current.isVisible).toBe(false);
  });

  it("should respect custom timeout value", () => {
    const customTimeout = 5000;
    const { result } = renderHook(() => useToggleMnemonic(customTimeout));

    act(() => {
      result.current.toggleMnemonic();
    });

    expect(result.current.isVisible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(4999);
    });
    expect(result.current.isVisible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.isVisible).toBe(false);
  });

  it("should cleanup timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { result, unmount } = renderHook(() => useToggleMnemonic());

    act(() => {
      result.current.toggleMnemonic();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
