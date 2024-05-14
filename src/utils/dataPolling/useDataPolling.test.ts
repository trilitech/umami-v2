import { useDataPolling } from "./useDataPolling";
import { usePollBakers } from "./usePollBakers";
import { usePollBlockLevel } from "./usePollBlockLevel";
import { usePollConversionRate } from "./usePollConversionRate";
import { usePollMultisigs } from "./usePollMultisigs";
import { usePollPendingOperations } from "./usePollPendingOperations";
import { usePollTezBalances } from "./usePollTezBalances";
import { usePollTokenBalances } from "./usePollTokenBalances";
import { renderHook } from "../../mocks/testUtils";
import { store } from "../redux/store";

jest.mock("./usePollBakers");
const usePollBakersMock = jest.mocked(usePollBakers);

jest.mock("./usePollBlockLevel");
const usePollBlockLevelMock = jest.mocked(usePollBlockLevel);

jest.mock("./usePollConversionRate");
const usePollConversionRateMock = jest.mocked(usePollConversionRate);

jest.mock("./usePollMultisigs");
const usePollMultisigsMock = jest.mocked(usePollMultisigs);

jest.mock("./usePollPendingOperations");
const usePollPendingOperationsMock = jest.mocked(usePollPendingOperations);

jest.mock("./usePollTezBalances");
const usePollTezBalancesMock = jest.mocked(usePollTezBalances);

jest.mock("./usePollTokenBalances");
const usePollTokenBalancesMock = jest.mocked(usePollTokenBalances);

describe("useDataPolling", () => {
  describe("isLoading", () => {
    it.each([
      { hookName: "usePollMultisigs", mock: usePollMultisigsMock },
      { hookName: "usePollPendingOperations", mock: usePollPendingOperationsMock },
      { hookName: "usePollTezBalances", mock: usePollTezBalancesMock },
      { hookName: "usePollTokenBalances", mock: usePollTokenBalancesMock },
    ])("is true when the data is being fetched by $hookName", ({ mock }) => {
      [
        usePollBakersMock,
        usePollBlockLevelMock,
        usePollConversionRateMock,
        usePollMultisigsMock,
        usePollPendingOperationsMock,
        usePollTezBalancesMock,
        usePollTokenBalancesMock,
      ].forEach(hookMock => {
        if (hookMock === mock) {
          hookMock.mockReturnValue({
            isFetching: true,
            dataUpdatedAt: 1,
          } as any);
        } else {
          hookMock.mockReturnValue({
            isFetching: false,
            dataUpdatedAt: 1,
          } as any);
        }
      });

      renderHook(() => useDataPolling());

      expect(store.getState().assets.isLoading).toBe(true);
    });

    it.each([
      { hookName: "usePollBakers", mock: usePollBakersMock },
      { hookName: "usePollBlockLevel", mock: usePollBlockLevelMock },
      { hookName: "usePollConversionRate", mock: usePollConversionRateMock },
    ])("is not affected by $hookName", ({ mock }) => {
      [
        usePollBakersMock,
        usePollBlockLevelMock,
        usePollConversionRateMock,
        usePollMultisigsMock,
        usePollPendingOperationsMock,
        usePollTezBalancesMock,
        usePollTokenBalancesMock,
      ].forEach(hookMock => {
        if (hookMock === mock) {
          hookMock.mockReturnValue({
            isFetching: true,
            dataUpdatedAt: 1,
          } as any);
        } else {
          hookMock.mockReturnValue({
            isFetching: false,
            dataUpdatedAt: 1,
          } as any);
        }
      });

      renderHook(() => useDataPolling());

      expect(store.getState().assets.isLoading).toBe(false);
    });
  });

  describe("lastUpdatedAt", () => {
    it.each([
      { hookName: "usePollMultisigs", mock: usePollMultisigsMock },
      { hookName: "usePollPendingOperations", mock: usePollPendingOperationsMock },
      { hookName: "usePollTezBalances", mock: usePollTezBalancesMock },
      { hookName: "usePollTokenBalances", mock: usePollTokenBalancesMock },
    ])("is true when the data is being fetched by $hookName", ({ mock }) => {
      [
        usePollBakersMock,
        usePollBlockLevelMock,
        usePollConversionRateMock,
        usePollMultisigsMock,
        usePollPendingOperationsMock,
        usePollTezBalancesMock,
        usePollTokenBalancesMock,
      ].forEach(hookMock => {
        if (hookMock === mock) {
          hookMock.mockReturnValue({
            isFetching: false,
            dataUpdatedAt: 1000,
          } as any);
        } else {
          hookMock.mockReturnValue({
            isFetching: false,
            dataUpdatedAt: 1,
          } as any);
        }
      });

      renderHook(() => useDataPolling());

      expect(store.getState().assets.lastTimeUpdated).toBe("Thu, 01 Jan 1970 00:00:01 GMT");
    });

    it.each([
      { hookName: "usePollBakers", mock: usePollBakersMock },
      { hookName: "usePollBlockLevel", mock: usePollBlockLevelMock },
      { hookName: "usePollConversionRate", mock: usePollConversionRateMock },
    ])("is not affected by $hookName", ({ mock }) => {
      [
        usePollMultisigsMock,
        usePollPendingOperationsMock,
        usePollTezBalancesMock,
        usePollTokenBalancesMock,
        usePollBakersMock,
        usePollBlockLevelMock,
        usePollConversionRateMock,
      ].forEach(hookMock => {
        if (hookMock === mock) {
          hookMock.mockReturnValue({
            isFetching: false,
            dataUpdatedAt: 5,
          } as any);
        } else {
          hookMock.mockReturnValue({
            isFetching: false,
            dataUpdatedAt: 1,
          } as any);
        }
      });

      renderHook(() => useDataPolling());

      expect(store.getState().assets.lastTimeUpdated).toBe("Thu, 01 Jan 1970 00:00:00 GMT");
    });
  });
});
