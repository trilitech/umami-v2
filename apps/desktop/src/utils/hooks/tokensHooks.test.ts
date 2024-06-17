import { useGetToken, useGetTokenType } from "./tokensHooks";
import { hedgehoge } from "../../mocks/fa12Tokens";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { renderHook } from "../../mocks/testUtils";
import { DefaultNetworks, type Network } from "../../types/Network";
import { fromRaw } from "../../types/Token";
import { networksActions } from "../redux/slices/networks";
import { tokensActions } from "../redux/slices/tokensSlice";
import { store } from "../redux/store";

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
        fromRaw(tokenBalance.token)
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
