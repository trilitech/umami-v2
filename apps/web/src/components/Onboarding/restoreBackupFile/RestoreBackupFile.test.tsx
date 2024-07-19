import { mockToast, useRestoreBackup } from "@umami/state";
import { umamiBackup } from "@umami/test-utils";

import { RestoreBackupFile } from "./RestoreBackupFile";
import {
  type UserEvent,
  act,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useRestoreBackup: jest.fn(),
}));

jest.mock("../../../utils/persistor", () => ({ persistor: { pause: jest.fn() } }));

describe("<RestoreBackupFile />", () => {
  const setupBackupFile = (json: any) => {
    const str = JSON.stringify(json);
    const blob = new Blob([str]);
    const file = new File([blob], "backup.json", { type: "application/json" });
    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    return file;
  };

  const uploadBackupFile = async (json: any, user: UserEvent, password?: string) => {
    const file = setupBackupFile(json);

    await act(() => user.upload(screen.getByLabelText("Upload File"), file));
    if (password) {
      await act(async () => await user.type(screen.getByTestId("password-input"), password));
    }
    await act(() => user.click(screen.getByRole("button", { name: "Import Wallet" })));
  };

  it("requires a backup file", async () => {
    render(<RestoreBackupFile />);

    fireEvent.blur(screen.getByLabelText("Upload File"));

    await waitFor(() =>
      expect(screen.getByTestId("file-errors")).toHaveTextContent("File is required")
    );
  });

  it("shows error for wrong backup file format", async () => {
    jest
      .mocked(useRestoreBackup)
      .mockImplementation(() => jest.fn(() => Promise.reject("Invalid backup file.")));
    const user = userEvent.setup();

    render(<RestoreBackupFile />);

    await uploadBackupFile({ foo: "bar" }, user);

    expect(mockToast).toHaveBeenCalledWith({
      description: "Invalid backup file.",
      status: "error",
      isClosable: true,
    });
  });

  it("calls useRestoreBackup hook", async () => {
    const mockRestoreBackupFile = jest.fn();
    jest.mocked(useRestoreBackup).mockImplementation(() => mockRestoreBackupFile);
    const user = userEvent.setup();

    render(<RestoreBackupFile />);

    await uploadBackupFile(umamiBackup, user, "password");

    expect(mockRestoreBackupFile).toHaveBeenCalledWith(umamiBackup, "password", expect.any(Object));
  });
});
