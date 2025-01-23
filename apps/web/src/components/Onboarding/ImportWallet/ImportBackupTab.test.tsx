import { mockToast } from "@umami/state";
import { fileUploadMock, umamiBackup } from "@umami/test-utils";

import { ImportBackupTab } from "./ImportBackupTab";
import { act, fireEvent, render, screen, userEvent, waitFor } from "../../../testUtils";

jest.mock("../../../utils/persistor", () => ({
  persistor: { pause: jest.fn(), resume: jest.fn() },
}));

jest.setTimeout(15000);

describe("<ImportBackupTab />", () => {
  it("requires a file", async () => {
    render(<ImportBackupTab />);

    fireEvent.blur(screen.getByTestId("file-input"));

    await waitFor(() => expect(screen.getByText("File is required")).toBeVisible());
  });

  it("doesn't require a password", () => {
    render(<ImportBackupTab />);

    fireEvent.blur(screen.getByLabelText("Password"));

    expect(screen.queryByText("Password is required")).not.toBeInTheDocument();
  });

  it("shows a toast if the file is invalid", async () => {
    const user = userEvent.setup();
    const file = fileUploadMock({});

    render(<ImportBackupTab />);

    await act(() => user.upload(screen.getByTestId("file-input"), file));

    const button = screen.getByRole("button", { name: "Import wallet" });
    expect(button).toBeEnabled();

    await act(() => user.click(button));

    await waitFor(() => expect(mockToast).toHaveBeenCalledTimes(1));

    expect(mockToast).toHaveBeenCalledWith({
      status: "error",
      isClosable: true,
      description: "Invalid backup file.",
    });
  });

  it("shows a toast if the password is invalid", async () => {
    const user = userEvent.setup();
    const file = fileUploadMock(umamiBackup);

    render(<ImportBackupTab />);

    await act(() => user.upload(screen.getByTestId("file-input"), file));
    await act(() => user.type(screen.getByLabelText("Password"), "wrong password"));

    await waitFor(async () => {
      await act(() => user.click(screen.getByRole("button", { name: "Import wallet" })));
    });

    await waitFor(() => expect(mockToast).toHaveBeenCalledTimes(1));
    expect(mockToast).toHaveBeenCalledWith({
      status: "error",
      isClosable: true,
      description: "Error decrypting data: Invalid password",
    });
  });

  it("restores the backup", async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ type: "empty" }),
    } as Response);
    const user = userEvent.setup();

    const { store } = render(<ImportBackupTab />);

    const file = fileUploadMock(umamiBackup);
    const password = "password";
    await act(() => user.upload(screen.getByTestId("file-input"), file));
    await act(() => user.type(screen.getByLabelText("Password"), password));
    await act(() => user.click(screen.getByText("Import wallet")));

    await waitFor(() => expect(store.getState().accounts.items.length).toEqual(1));
  });
});
