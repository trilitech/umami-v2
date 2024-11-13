import { type UmamiStore, makeStore } from "@umami/state";

import { renderHook } from "./testUtils";
import { useDataPolling } from "./useDataPolling";
import { usePollAccountStates } from "./usePollAccountStates";
import { usePollBakers } from "./usePollBakers";
import { usePollBlock } from "./usePollBlock";
import { usePollConversionRate } from "./usePollConversionRate";
import { usePollMultisigs } from "./usePollMultisigs";
import { usePollPendingOperations } from "./usePollPendingOperations";
import { usePollProtocolSettings } from "./usePollProtocolSettings";
import { usePollTokenBalances } from "./usePollTokenBalances";
import { usePollUnstakeRequests } from "./usePollUnstakeRequests";

jest.mock("./usePollBakers");
const usePollBakersMock = jest.mocked(usePollBakers);

jest.mock("./usePollBlock");
const usePollBlockMock = jest.mocked(usePollBlock);

jest.mock("./usePollConversionRate");
const usePollConversionRateMock = jest.mocked(usePollConversionRate);

jest.mock("./usePollMultisigs");
const usePollMultisigsMock = jest.mocked(usePollMultisigs);

jest.mock("./usePollPendingOperations");
const usePollPendingOperationsMock = jest.mocked(usePollPendingOperations);

jest.mock("./usePollAccountStates");
const usePollAccountStatesMock = jest.mocked(usePollAccountStates);

jest.mock("./usePollTokenBalances");
const usePollTokenBalancesMock = jest.mocked(usePollTokenBalances);

jest.mock("./usePollUnstakeRequests");
const usePollUnstakeRequestsMock = jest.mocked(usePollUnstakeRequests);

jest.mock("./usePollProtocolSettings");
const usePollProtocolSettingsMock = jest.mocked(usePollProtocolSettings);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("useDataPolling", () => {
  describe("isLoading", () => {
    it.each([
      { hookName: "usePollAccountStates", mock: usePollAccountStatesMock },
      { hookName: "usePollBakers", mock: usePollBakersMock },
      { hookName: "usePollBlock", mock: usePollBlockMock },
      { hookName: "usePollConversionRate", mock: usePollConversionRateMock },
      { hookName: "usePollMultisigs", mock: usePollMultisigsMock },
      { hookName: "usePollPendingOperations", mock: usePollPendingOperationsMock },
      { hookName: "usePollProtocolSettings", mock: usePollProtocolSettingsMock },
      { hookName: "usePollTokenBalances", mock: usePollTokenBalancesMock },
      { hookName: "usePollUnstakeRequests", mock: usePollUnstakeRequestsMock },
    ])("is true when the data is being fetched by $hookName", ({ mock }) => {
      [
        usePollAccountStatesMock,
        usePollBakersMock,
        usePollBlockMock,
        usePollConversionRateMock,
        usePollMultisigsMock,
        usePollPendingOperationsMock,
        usePollProtocolSettingsMock,
        usePollTokenBalancesMock,
        usePollUnstakeRequestsMock,
      ].forEach(hookMock => {
        // @ts-expect-error TS2590
        hookMock.mockReturnValue({
          isFetching: hookMock === mock,
          dataUpdatedAt: 1,
        });
      });

      renderHook(() => useDataPolling(), { store });

      expect(store.getState().assets.isLoading).toBe(true);
    });
  });

  describe("lastTimeUpdated", () => {
    it.each([
      { hookName: "usePollAccountStates", mock: usePollAccountStatesMock },
      { hookName: "usePollBakers", mock: usePollBakersMock },
      { hookName: "usePollBlock", mock: usePollBlockMock },
      { hookName: "usePollConversionRate", mock: usePollConversionRateMock },
      { hookName: "usePollMultisigs", mock: usePollMultisigsMock },
      { hookName: "usePollPendingOperations", mock: usePollPendingOperationsMock },
      { hookName: "usePollProtocolSettings", mock: usePollProtocolSettingsMock },
      { hookName: "usePollTokenBalances", mock: usePollTokenBalancesMock },
      { hookName: "usePollUnstakeRequests", mock: usePollUnstakeRequestsMock },
    ])("is set to the lastUpdatedAt of the $hookName hook if it is the latest one", ({ mock }) => {
      [
        usePollAccountStatesMock,
        usePollBakersMock,
        usePollBlockMock,
        usePollConversionRateMock,
        usePollMultisigsMock,
        usePollPendingOperationsMock,
        usePollProtocolSettingsMock,
        usePollTokenBalancesMock,
        usePollUnstakeRequestsMock,
      ].forEach(hookMock => {
        hookMock.mockReturnValue({
          isFetching: false,
          dataUpdatedAt: hookMock === mock ? 1000 : 1,
        } as any);
      });

      renderHook(() => useDataPolling(), { store });

      expect(store.getState().assets.lastTimeUpdated).toBe("Thu, 01 Jan 1970 00:00:01 GMT");
    });

    it.each([
      { hookName: "usePollAccountStates", mock: usePollAccountStatesMock },
      { hookName: "usePollBakers", mock: usePollBakersMock },
      { hookName: "usePollBlock", mock: usePollBlockMock },
      { hookName: "usePollConversionRate", mock: usePollConversionRateMock },
      { hookName: "usePollMultisigs", mock: usePollMultisigsMock },
      { hookName: "usePollPendingOperations", mock: usePollPendingOperationsMock },
      { hookName: "usePollProtocolSettings", mock: usePollProtocolSettingsMock },
      { hookName: "usePollTokenBalances", mock: usePollTokenBalancesMock },
      { hookName: "usePollUnstakeRequests", mock: usePollUnstakeRequestsMock },
    ])("does not change lastTimeUpdated if $hookName is loading", ({ mock }) => {
      [
        usePollAccountStatesMock,
        usePollBakersMock,
        usePollBlockMock,
        usePollConversionRateMock,
        usePollMultisigsMock,
        usePollPendingOperationsMock,
        usePollProtocolSettingsMock,
        usePollTokenBalancesMock,
        usePollUnstakeRequestsMock,
      ].forEach(hookMock => {
        hookMock.mockReturnValue({
          isFetching: hookMock === mock,
          dataUpdatedAt: 1000,
        } as any);
      });

      renderHook(() => useDataPolling(), { store });

      expect(store.getState().assets.lastTimeUpdated).toBeNull();
    });
  });
});
