import { mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";

import { useHandleVerify } from "./useHandleVerify";
import { VerificationInfoModal } from "./VerificationInfoModal";
import { VerifyMessage } from "./VerifyMessage";
import { dynamicModalContextMock, render, screen, userEvent } from "../../../testUtils";

let store: UmamiStore;

jest.mock("./useHandleVerify.tsx", () => ({
  useHandleVerify: jest.fn(),
}));

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0, { isVerified: false }));
});

describe("<VerifyMessage />", () => {
  it("renders correctly", () => {
    render(<VerifyMessage />);

    expect(screen.getByText("Verify your account")).toBeVisible();
    expect(
      screen.getByText(
        "Please verify your account, to unlock all features and keep your account secure."
      )
    ).toBeVisible();
    expect(screen.getByText("How does verification work?")).toBeVisible();
  });

  it("opens verification info modal", async () => {
    const { openWith } = dynamicModalContextMock;
    const user = userEvent.setup();
    render(<VerifyMessage />);

    await user.click(screen.getByText("How does verification work?"));

    expect(openWith).toHaveBeenCalledWith(<VerificationInfoModal />);
  });

  it("calls handleVerify when Verify Now is clicked", async () => {
    const mockHandleVerify = jest.fn();
    jest.mocked(useHandleVerify).mockReturnValue(mockHandleVerify);

    const user = userEvent.setup();
    render(<VerifyMessage />);

    await user.click(screen.getByText("Verify now"));

    expect(mockHandleVerify).toHaveBeenCalled();
  });
});
