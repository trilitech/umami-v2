import { type UmamiStore, makeStore } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { useAddressPill } from "./useAddressPill";
import { act, renderHook } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("useAddressPill", () => {
  describe("showIcons", () => {
    it("returns true by default", () => {
      const {
        result: {
          current: { showIcons },
        },
      } = renderHook(() => useAddressPill({ rawAddress: mockImplicitAddress(0) }), {
        store,
      });

      expect(showIcons).toEqual(true);
    });

    it("returns true with mode=default", () => {
      const {
        result: {
          current: { showIcons },
        },
      } = renderHook(
        () => useAddressPill({ rawAddress: mockImplicitAddress(0), mode: "default" }),
        {
          store,
        }
      );

      expect(showIcons).toEqual(true);
    });

    it("returns false with mode=no_icons", () => {
      const {
        result: {
          current: { showIcons },
        },
      } = renderHook(
        () => useAddressPill({ rawAddress: mockImplicitAddress(0), mode: "no_icons" }),
        {
          store,
        }
      );

      expect(showIcons).toEqual(false);
    });
  });

  describe("mouse hover", () => {
    it("is false by default", () => {
      const {
        result: {
          current: { isMouseHover },
        },
      } = renderHook(() => useAddressPill({ rawAddress: mockImplicitAddress(0) }), {
        store,
      });

      expect(isMouseHover).toEqual(false);
    });

    it("returns the set value", () => {
      const { result } = renderHook(() => useAddressPill({ rawAddress: mockImplicitAddress(0) }), {
        store,
      });

      act(() => result.current.setIsMouseHover(true));

      expect(result.current.isMouseHover).toEqual(true);
    });
  });

  describe("onClick", () => {
    it("copies the address to the clipboard", async () => {
      jest.spyOn(navigator.clipboard, "writeText");
      const { result } = renderHook(() => useAddressPill({ rawAddress: mockImplicitAddress(0) }), {
        store,
      });

      await act(() => result.current.onClick());

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h"
      );
    });
  });

  describe("alias", () => {
    it("is undefined for an Umami address", () => {
      const {
        result: {
          current: { addressAlias },
        },
      } = renderHook(() => useAddressPill({ rawAddress: mockImplicitAddress(0) }), {
        store,
      });

      expect(addressAlias).toBeUndefined();
    });

    it("sets the alias for a TzKT address", () => {
      const {
        result: {
          current: { addressAlias },
        },
      } = renderHook(
        () =>
          useAddressPill({
            rawAddress: { address: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h", alias: "test" },
          }),
        {
          store,
        }
      );

      expect(addressAlias).toEqual("test");
    });

    it("sets the alias to undefined for a null Tzkt alias", () => {
      const {
        result: {
          current: { addressAlias },
        },
      } = renderHook(
        () =>
          useAddressPill({
            rawAddress: { address: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h", alias: null },
          }),
        {
          store,
        }
      );

      expect(addressAlias).toEqual(undefined);
    });
  });
});
