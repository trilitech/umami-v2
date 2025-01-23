import { SuccessStep } from "./SuccessStep"; // Adjust path if needed
import { renderInModal, screen } from "../../testUtils";

describe("<SuccessStep />", () => {
  it("renders success message when there is no dAppNotificationError", async () => {
    await renderInModal(<SuccessStep hash="testHash" />);

    expect(screen.getByTestId("success-text")).toHaveTextContent(
      "You can follow this operation's progress in the Operations section. It may take up to 30 seconds to appear."
    );
    expect(screen.queryByTestId("success-no-notify-text")).not.toBeInTheDocument();
    expect(screen.queryByTestId("do-not-retry-text")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dapp-noticaition-error")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "See all operations" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View in TzKT" })).toHaveAttribute(
      "href",
      "https://tzkt.io/testHash"
    );
  });

  it("renders warning message when dAppNotificationError is present", async () => {
    await renderInModal(<SuccessStep dAppNotificationError="testError" hash="testHash" />);

    expect(screen.getByTestId("do-not-retry-text")).toHaveTextContent(
      "Do not retry this operation; it has already been processed. You may need to reload the dApp to see the updated status."
    );
    expect(screen.getByTestId("dapp-noticaition-error")).toHaveTextContent("testError");
    expect(screen.getByTestId("success-text")).toHaveTextContent(
      "You can follow this operation's progress in the Operations section. It may take up to 30 seconds to appear."
    );
    expect(screen.getByRole("button", { name: "See all operations" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View in TzKT" })).toHaveAttribute(
      "href",
      "https://tzkt.io/testHash"
    );
  });
});
