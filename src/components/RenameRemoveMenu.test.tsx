import { fireEvent, render, screen } from "@testing-library/react";
import RenameRemoveMenu from "./RenameRemoveMenu";

describe("<RenameRemoveMenu />", () => {
  it("rename and remove button works", () => {
    const mockOnRename = jest.fn();
    const mockOnRemove = jest.fn();
    render(<RenameRemoveMenu onRename={mockOnRename} onRemove={mockOnRemove} />);
    fireEvent.click(screen.getByTestId("popover-cta"));

    fireEvent.click(screen.getByText("Rename"));
    expect(mockOnRename).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Remove"));
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it("hides remove button", () => {
    const mockOnRename = jest.fn();
    render(<RenameRemoveMenu onRename={mockOnRename} />);
    fireEvent.click(screen.getByTestId("popover-cta"));
    expect(screen.getByText(`Rename`)).toBeInTheDocument();
    expect(screen.queryByText(`Remove`)).not.toBeInTheDocument();
  });
});
