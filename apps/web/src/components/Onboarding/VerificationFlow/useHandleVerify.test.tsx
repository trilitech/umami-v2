import { mockMnemonicAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  useGetDecryptedMnemonic,
} from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { ImportantNoticeModal } from "./ImportantNoticeModal";
import { useHandleVerify } from "./useHandleVerify";
import { act, dynamicModalContextMock, renderHook } from "../../../testUtils";
import { SetupPassword } from "../SetupPassword";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useGetDecryptedMnemonic: jest.fn(),
}));

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0, { isVerified: false }));
});

describe("useHandleVerify", () => {
  it("should open SetupPassword modal if master password is not set", async () => {
    const { openWith } = dynamicModalContextMock;
    const { result } = renderHook(() => useHandleVerify(), { store });

    await act(async () => await result.current());

    expect(openWith).toHaveBeenCalledWith(
      <SetupPassword handleProceedToVerification={expect.any(Function)} />
    );
  });

  it("should open ImportantNoticeModal modal if master password is set", async () => {
    (useGetDecryptedMnemonic as jest.Mock).mockImplementation(() => () => mnemonic1);
    store.dispatch(accountsActions.setPassword("password"));

    const { openWith } = dynamicModalContextMock;
    const { result } = renderHook(() => useHandleVerify(), { store });

    await act(() => result.current());

    expect(openWith).toHaveBeenCalledWith(<ImportantNoticeModal seedPhrase={mnemonic1} />, {
      size: "xl",
    });
  });
});
