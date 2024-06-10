import { ConfirmationModal } from "./ConfirmationModal";
import { fireEvent, render, screen } from "../mocks/testUtils";

describe("<ConfirmationModal />", () => {
  it("shows title", () => {
    render(<ConfirmationModal buttonLabel="test" onSubmit={jest.fn()} title="Some title" />);
    expect(screen.getByRole("heading")).toHaveTextContent("Some title");
  });

  it("shows description", () => {
    render(
      <ConfirmationModal
        buttonLabel="test"
        description="Some description"
        onSubmit={jest.fn()}
        title="Some title"
      />
    );
    expect(screen.getByTestId("description")).toHaveTextContent("Some description");
  });

  it("doesn't render body if no description is provided", () => {
    render(<ConfirmationModal buttonLabel="test" onSubmit={jest.fn()} title="Some title" />);
    expect(screen.queryByTestId("description")).not.toBeInTheDocument();
  });

  it("executes the passed in onSubmit callback", () => {
    const onSubmit = jest.fn();
    render(
      <ConfirmationModal buttonLabel="Do dangerous things" onSubmit={onSubmit} title="Some title" />
    );
    const submitButton = screen.getByRole("button", { name: "Do dangerous things" });
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
