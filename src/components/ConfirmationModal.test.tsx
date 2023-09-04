import { fireEvent, render, screen } from "../mocks/testUtils";
import { ConfirmationModal } from "./ConfirmationModal";

describe("<ConfirmationModal />", () => {
  it("shows title", () => {
    render(<ConfirmationModal title="Some title" buttonLabel="test" onSubmit={jest.fn()} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Some title");
  });

  it("shows description", () => {
    render(
      <ConfirmationModal
        title="Some title"
        description="Some description"
        buttonLabel="test"
        onSubmit={jest.fn()}
      />
    );
    expect(screen.getByTestId("description")).toHaveTextContent("Some description");
  });

  it("doesn't render body if no description is provided", () => {
    render(<ConfirmationModal title="Some title" buttonLabel="test" onSubmit={jest.fn()} />);
    expect(screen.queryByTestId("description")).not.toBeInTheDocument();
  });

  it("executes the passed in onSubmit callback", () => {
    const onSubmit = jest.fn();
    render(
      <ConfirmationModal title="Some title" buttonLabel="Do dangerous things" onSubmit={onSubmit} />
    );
    const submitButton = screen.getByRole("button", { name: "Do dangerous things" });
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
