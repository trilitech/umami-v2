import { VerificationInfoModal } from "./VerificationInfoModal";
import { VerifyMessage } from "./VerifyMessage";
import { dynamicModalContextMock, render, screen, userEvent } from "../../../testUtils";

describe("<VerifyMessage />", () => {
  it("renders correctly", () => {
    render(<VerifyMessage />);

    expect(screen.getByText("Verify Your Account")).toBeVisible();
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
});
