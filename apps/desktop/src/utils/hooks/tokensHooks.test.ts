import { fromRawToken } from "@umami/core";
import { networksActions, store, tokensActions } from "@umami/state";
import { hedgehoge } from "@umami/test-utils";
import {
  DefaultNetworks,
  type Network,
  mockContractAddress,
  mockImplicitAddress,
} from "@umami/tezos";

import { useGetToken, useGetTokenType } from "./tokensHooks";
import { renderHook } from "../../mocks/testUtils";

describe("useGetToken", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    beforeEach(() => {
      store.dispatch(networksActions.setCurrent(network));
    });

    it("returns undefined if token is not found", () => {
      const { result: getTokenRef } = renderHook(() => useGetToken());
      expect(getTokenRef.current(mockContractAddress(0).pkh, "0")).toBeUndefined();
    });

    it("can find a token if it exists on the network", () => {
      const tokenBalance = hedgehoge(mockImplicitAddress(0));
      store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));
      const { result: getTokenRef } = renderHook(() => useGetToken());
      expect(getTokenRef.current(tokenBalance.token.contract.address, "0")).toEqual(
        fromRawToken(tokenBalance.token)
      );
    });

    it("can't find a token even if it exists on another network", () => {
      const anotherNetwork = DefaultNetworks.find(another => another !== network) as Network;
      const tokenBalance = hedgehoge(mockImplicitAddress(0));
      store.dispatch(
        tokensActions.addTokens({ network: anotherNetwork, tokens: [tokenBalance.token] })
      );

      const { result: getTokenRef } = renderHook(() => useGetToken());
      expect(getTokenRef.current(tokenBalance.token.contract.address, "0")).toBeUndefined();
    });
  });
});

describe("useGetTokenType", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    it("returns undefined if contract is not found", () => {
      const { result: getTokenRef } = renderHook(() => useGetTokenType(network));
      expect(getTokenRef.current(mockContractAddress(0).pkh)).toBeUndefined();
    });

    it("can find the type of a token if it exists on the network", () => {
      const tokenBalance = hedgehoge(mockImplicitAddress(0));
      store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));
      const { result: getTokenRef } = renderHook(() => useGetTokenType(network));
      expect(getTokenRef.current(tokenBalance.token.contract.address)).toEqual("fa1.2");
    });

    it("can't find the token type if it exists on another network", () => {
      const anotherNetwork = DefaultNetworks.find(another => another !== network) as Network;
      const tokenBalance = hedgehoge(mockImplicitAddress(0));
      store.dispatch(
        tokensActions.addTokens({ network: anotherNetwork, tokens: [tokenBalance.token] })
      );
      const { result: getTokenRef } = renderHook(() => useGetTokenType(network));
      expect(getTokenRef.current(tokenBalance.token.contract.address)).toBeUndefined();
    });
  });
});
