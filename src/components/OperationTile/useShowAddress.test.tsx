import { mockImplicitAddress } from "../../mocks/factories";
import { renderHook } from "../../mocks/testUtils";
import { OperationTileContext } from "./OperationTileContext";
import { useShowAddress } from "./useShowAddress";

const PageWrapper = ({ children }: { children: React.ReactElement }) => (
  <OperationTileContext.Provider value={{ mode: "page" }}>{children}</OperationTileContext.Provider>
);

const DrawerWrapper = ({ children }: { children: React.ReactElement }) => (
  <OperationTileContext.Provider
    value={{ mode: "drawer", selectedAddress: mockImplicitAddress(0) }}
  >
    {children}
  </OperationTileContext.Provider>
);

describe("useShowAddress", () => {
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
