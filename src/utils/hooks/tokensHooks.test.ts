import { renderHook } from "@testing-library/react";
import { hedgehoge } from "../../mocks/fa12Tokens";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import { fromRaw } from "../../types/Token";
import { assetsActions } from "../redux/slices/assetsSlice";
import store from "../redux/store";
import { tokensActions } from "../redux/slices/tokensSlice";
import { useGetToken, useGetTokenType } from "./tokensHooks";
import { DefaultNetworks } from "../../types/TezosNetwork";

describe("useGetToken", () => {
  describe.each(DefaultNetworks)("on %s", network => {
    beforeEach(() => {
      store.dispatch(assetsActions.updateNetwork(network));
    });
    it("returns undefined if token is not found", () => {
      const { result: getTokenRef } = renderHook(() => useGetToken(), {
        wrapper: ReduxStore,
      });
      expect(getTokenRef.current(mockContractAddress(0).pkh, "0")).toBeUndefined();
    });

    it(`can find a token if it exists on ${network}`, () => {
      const tokenBalance = hedgehoge(mockImplicitAddress(0));
      store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));
      const { result: getTokenRef } = renderHook(() => useGetToken(), {
        wrapper: ReduxStore,
      });
      expect(getTokenRef.current(tokenBalance.token.contract.address as string, "0")).toEqual(
        fromRaw(tokenBalance.token)
      );
    });

    DefaultNetworks.forEach(anotherNetwork => {
      if (anotherNetwork === network) {
        return;
      }

      test.each(DefaultNetworks.filter(another => another !== network))(
        `can't find a token even if it exists on another network (%s)`,
        anotherNetwork => {
          const tokenBalance = hedgehoge(mockImplicitAddress(0));
          store.dispatch(
            tokensActions.addTokens({ network: anotherNetwork, tokens: [tokenBalance.token] })
          );

          const { result: getTokenRef } = renderHook(() => useGetToken(), {
            wrapper: ReduxStore,
          });
          expect(
            getTokenRef.current(tokenBalance.token.contract.address as string, "0")
          ).toBeUndefined();
        }
      );
    });
  });
});

describe("useGetTokenType", () => {
  DefaultNetworks.forEach(network => {
    describe(`on ${network}`, () => {
      it("returns undefined if contract is not found", () => {
        const { result: getTokenRef } = renderHook(() => useGetTokenType(network), {
          wrapper: ReduxStore,
        });
        expect(getTokenRef.current(mockContractAddress(0).pkh)).toBeUndefined();
      });

      it(`can find the type of a token if it exists on ${network}`, () => {
        const tokenBalance = hedgehoge(mockImplicitAddress(0));
        store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));
        const { result: getTokenRef } = renderHook(() => useGetTokenType(network), {
          wrapper: ReduxStore,
        });
        expect(getTokenRef.current(tokenBalance.token.contract.address as string)).toEqual("fa1.2");
      });

      DefaultNetworks.forEach(anotherNetwork => {
        if (anotherNetwork === network) {
          return;
        }

        it(`can't find the token type if it exists on another network (${anotherNetwork})`, () => {
          const tokenBalance = hedgehoge(mockImplicitAddress(0));
          store.dispatch(
            tokensActions.addTokens({ network: anotherNetwork, tokens: [tokenBalance.token] })
          );
          const { result: getTokenRef } = renderHook(() => useGetTokenType(network), {
            wrapper: ReduxStore,
          });
          expect(
            getTokenRef.current(tokenBalance.token.contract.address as string)
          ).toBeUndefined();
        });
      });
    });
  });
});
