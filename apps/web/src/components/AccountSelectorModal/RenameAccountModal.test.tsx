import { mockImplicitAccount } from "@umami/core";
import { renameAccount } from "@umami/state";

import { RenameAccountPage } from "./RenameAccountModal";
import {
  act,
  dynamicDisclosureContextMock,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  renameAccount: jest.fn(),
  useAppDispatch: () => jest.fn(),
}));

const mockAccount = mockImplicitAccount(0);

describe("<RenameAccountPage />", () => {
  it("renders correctly with initial values", async () => {
    render(<RenameAccountPage account={mockAccount} />);

    await waitFor(() => expect(screen.getByText("Edit name")).toBeVisible());
    expect(screen.getByPlaceholderText("Enter contact's name")).toHaveValue(mockAccount.label);
  });

  it("shows validation error when name is empty", async () => {
    render(<RenameAccountPage account={mockAccount} />);
    const user = userEvent.setup();

    await act(() => user.clear(screen.getByPlaceholderText("Enter contact's name")));
    await act(() => user.click(screen.getByRole("button", { name: "Update" })));

    expect(await screen.findByTestId("name-error")).toHaveTextContent("Name is required");
  });

  it("dispatches renameAccount and navigates back on valid form submission", async () => {
    const user = userEvent.setup();
    const { goBack } = dynamicDisclosureContextMock;

    render(<RenameAccountPage account={mockAccount} />);

    await act(() => user.clear(screen.getByPlaceholderText("Enter contact's name")));
    await act(() => user.type(screen.getByPlaceholderText("Enter contact's name"), "New Name"));
    await act(() => user.click(screen.getByRole("button", { name: "Update" })));

    expect(renameAccount).toHaveBeenCalledWith(mockAccount, "New Name");
    expect(goBack).toHaveBeenCalled();
  });
});
