import { RenameRemoveMenu } from "./RenameRemoveMenu";
import { act, render, screen, userEvent } from "../mocks/testUtils";

describe("<RenameRemoveMenu />", () => {
  it("rename and remove button works", async () => {
    const user = userEvent.setup();
    const mockOnRename = jest.fn();
    const mockOnRemove = jest.fn();
    render(<RenameRemoveMenu onRemove={mockOnRemove} onRename={mockOnRename} />);

    await act(() => user.click(screen.getByTestId("popover-cta")));
    await act(() => user.click(screen.getByText("Rename")));

    expect(mockOnRename).toHaveBeenCalled();

    await act(() => user.click(screen.getByText("Remove")));

    expect(mockOnRemove).toHaveBeenCalled();
  });

  it("hides remove button", async () => {
    const user = userEvent.setup();
    const mockOnRename = jest.fn();
    render(<RenameRemoveMenu onRename={mockOnRename} />);

    await act(() => user.click(screen.getByTestId("popover-cta")));

    expect(screen.getByText("Rename")).toBeInTheDocument();
    expect(screen.queryByText("Remove")).not.toBeInTheDocument();
  });
});
