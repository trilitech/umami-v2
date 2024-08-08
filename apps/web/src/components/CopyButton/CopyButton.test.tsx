import { CopyButton } from "./CopyButton";
import { act, render, screen, userEvent } from "../../testUtils";

describe("<CopyButton />", () => {
  it("copies the value to the clipboard", async () => {
    const user = userEvent.setup();
    jest.spyOn(navigator.clipboard, "writeText");

    render(<CopyButton value="hello">Copy</CopyButton>);

    await act(() => user.click(screen.getByTestId("copy-button")));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
  });
});
