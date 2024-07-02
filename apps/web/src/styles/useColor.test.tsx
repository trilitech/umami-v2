import { useColorMode } from "@chakra-ui/react";
import { renderHook } from "@testing-library/react-hooks";

import { dark, light } from "./colors";
import { useColor } from "./useColor";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useColorMode: jest.fn(),
}));

describe("useColor", () => {
  const mockUseColorMode = useColorMode as jest.Mock;

  it("returns correct grey color based on color mode", () => {
    mockUseColorMode.mockReturnValue({ colorMode: "light" });
    const { result } = renderHook(() => useColor());
    expect(result.current("500")).toBe(light.grey[500]);

    mockUseColorMode.mockReturnValue({ colorMode: "dark" });
    const { result: resultDark } = renderHook(() => useColor());
    expect(resultDark.current("500")).toBe(dark.grey[500]);
  });

  it("returns correct color based on color mode", () => {
    mockUseColorMode.mockReturnValue({ colorMode: "light" });
    const { result } = renderHook(() => useColor());
    expect(result.current("red")).toBe(light.red);

    mockUseColorMode.mockReturnValue({ colorMode: "dark" });
    const { result: resultDark } = renderHook(() => useColor());
    expect(resultDark.current("red")).toBe(dark.red);
  });

  it("returns correct custom color based on color mode", () => {
    mockUseColorMode.mockReturnValue({ colorMode: "light" });
    const { result } = renderHook(() => useColor());
    expect(result.current("red", "100")).toBe(light.red);

    mockUseColorMode.mockReturnValue({ colorMode: "dark" });
    const { result: resultDark } = renderHook(() => useColor());
    expect(resultDark.current("100", "lightgreen")).toBe("lightgreen");
  });
});
