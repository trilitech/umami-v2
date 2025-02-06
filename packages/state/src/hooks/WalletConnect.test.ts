import { CustomError } from "@umami/utils";

import {
  WcScenarioType,
  useDisconnectWalletConnectPeer,
  useValidateWcRequest,
} from "./WalletConnect";
import { renderHook } from "../testUtils";
import { walletKit } from "../walletConnect";

jest.mock("../walletConnect", () => ({
  ...jest.requireActual("../walletConnect"),
  walletKit: {
    disconnectSession: jest.fn(),
    getPendingSessionProposals: jest.fn(),
    getPendingSessionRequests: jest.fn(),
  },
}));

jest.mock("./WalletConnect", () => ({
  ...jest.requireActual("./WalletConnect"),
  useToggleWcPeerListUpdated: jest.fn(),
}));

describe("useDisconnectWalletConnectPeer", () => {
  it("should call disconnectSession and togglePeerListUpdated", async () => {
    walletKit.disconnectSession = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useDisconnectWalletConnectPeer());
    await result.current({
      topic: "test",
      reason: {
        code: 123,
        message: "test error message",
      },
    });

    expect(walletKit.disconnectSession).toHaveBeenCalledWith({
      topic: "test",
      reason: {
        code: 123,
        message: "test error message",
      },
    });
  });
});

describe("useValidateWcRequest for proposals", () => {
  it("should return true if the proposal exists", () => {
    walletKit.getPendingSessionProposals = jest
      .fn()
      .mockReturnValue([{ id: 123, topic: "test", params: {}, verifyContext: {} }]);

    const { result } = renderHook(() => useValidateWcRequest());
    expect(result.current("session proposal", 123, WcScenarioType.APPROVE, jest.fn())).toBe(true);
  });

  it("should return false and call goBack if the proposal does not exist (REJECT)", () => {
    walletKit.getPendingSessionProposals = jest
      .fn()
      .mockReturnValue([{ id: 123, topic: "test", params: {}, verifyContext: {} }]);
    const { result } = renderHook(() => useValidateWcRequest());
    expect(result.current("session proposal", 999, WcScenarioType.REJECT, jest.fn())).toBe(false);
  });

  it("should throw an error if the proposal does not exist (APPROVE)", () => {
    walletKit.getPendingSessionProposals = jest
      .fn()
      .mockReturnValue([{ id: 123, topic: "test", params: {}, verifyContext: {} }]);
    const { result } = renderHook(() => useValidateWcRequest());
    expect(() =>
      result.current("session proposal", 999, WcScenarioType.APPROVE, jest.fn())
    ).toThrow(CustomError);
  });
});

describe("useValidateWcRequest for requests", () => {
  it("should return true if the request exists", () => {
    walletKit.getPendingSessionRequests = jest
      .fn()
      .mockReturnValue([{ id: 456, topic: "test", params: {}, verifyContext: {} }]);

    const { result } = renderHook(() => useValidateWcRequest());
    expect(result.current("request", 456, WcScenarioType.APPROVE, jest.fn())).toBe(true);
  });

  it("should return false and call goBack if the request does not exist (REJECT)", () => {
    walletKit.getPendingSessionRequests = jest.fn().mockReturnValue([]);

    const { result } = renderHook(() => useValidateWcRequest());
    expect(result.current("request", 999, WcScenarioType.REJECT, jest.fn())).toBe(false);
  });

  it("should throw an error if the request does not exist (APPROVE)", () => {
    walletKit.getPendingSessionRequests = jest.fn().mockReturnValue([]);

    const { result } = renderHook(() => useValidateWcRequest());
    expect(() => result.current("request", 999, WcScenarioType.APPROVE, jest.fn())).toThrow(
      CustomError
    );
  });
});
