import { SecurityWarningModal, accordionItems } from "./SecurityWarningModal";
import {
  act,
  dynamicModalContextMock,
  renderInModal,
  screen,
  userEvent,
  waitFor,
} from "../../testUtils";

beforeEach(() => {
  localStorage.clear();
});

describe("<SecurityWarningModal />", () => {
  it("renders the modal with correct title and content", async () => {
    await renderInModal(<SecurityWarningModal />);

    await waitFor(() => {
      expect(screen.getByText("Browser Extension Security Tips")).toBeVisible();
    });

    expect(
      screen.getByText(
        "Please carefully review these guidelines to protect your wallet from potential security risks"
      )
    ).toBeVisible();
  });

  it("renders all accordion items", async () => {
    await renderInModal(<SecurityWarningModal />);

    accordionItems.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeVisible();
    });
  });

  it("disables 'Got it' button when not all items are opened", async () => {
    await renderInModal(<SecurityWarningModal />);

    const button = screen.getByRole("button", { name: "Got it" });
    expect(button).toBeDisabled();
  });

  it("enables 'Got it' button when all items are opened", async () => {
    const user = userEvent.setup();
    await renderInModal(<SecurityWarningModal />);

    const accordionButtons = screen.getAllByTestId("accordion-button");
    for (const button of accordionButtons) {
      await act(() => user.click(button));
    }

    const gotItButton = screen.getByRole("button", { name: "Got it" });
    expect(gotItButton).toBeEnabled();
  });

  it("sets localStorage and closes modal when 'Got it' is clicked", async () => {
    const { onClose } = dynamicModalContextMock;
    const user = userEvent.setup();
    await renderInModal(<SecurityWarningModal />);

    const accordionButtons = screen.getAllByTestId("accordion-button");
    for (const button of accordionButtons) {
      await act(() => user.click(button));
    }

    const gotItButton = screen.getByRole("button", { name: "Got it" });
    await act(() => user.click(gotItButton));

    await waitFor(() => {
      expect(localStorage.getItem("user:isInformed")).toBe("true");
    });

    expect(onClose).toHaveBeenCalled();
  });
});
