import { mockImplicitAddress } from "@umami/tezos";
import { type PropsWithChildren } from "react";

import { OperationTileContext } from "./OperationTileContext";
import { useShowAddress } from "./useShowAddress";
import { renderHook } from "../../testUtils";

const PageWrapper = ({ children }: PropsWithChildren) => (
  <OperationTileContext.Provider value={{ mode: "page" }}>{children}</OperationTileContext.Provider>
);

const DrawerWrapper = ({ children }: PropsWithChildren) => (
  <OperationTileContext.Provider
    value={{ mode: "drawer", selectedAddress: mockImplicitAddress(0) }}
  >
    {children}
  </OperationTileContext.Provider>
);

describe("useShowAddress", () => {
  it.each([undefined, null, ""])("returns false if the address is %s", falsyAddress => {
    const { result } = renderHook(() => useShowAddress(falsyAddress), {
      wrapper: PageWrapper,
    });
    expect(result.current).toBe(false);
  });

  it("returns true if the tile is in page mode", () => {
    const { result } = renderHook(() => useShowAddress(mockImplicitAddress(0).pkh), {
      wrapper: PageWrapper,
    });
    expect(result.current).toBe(true);
  });

  it("returns true in drawer mode if the address is not selected", () => {
    const { result } = renderHook(() => useShowAddress(mockImplicitAddress(1).pkh), {
      wrapper: DrawerWrapper,
    });
    expect(result.current).toBe(true);
  });

  it("returns false in drawer mode if the address is selected", () => {
    const { result } = renderHook(() => useShowAddress(mockImplicitAddress(0).pkh), {
      wrapper: DrawerWrapper,
    });
    expect(result.current).toBe(false);
  });
});
