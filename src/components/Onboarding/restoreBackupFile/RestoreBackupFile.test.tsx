import { RestoreBackupFile } from "./RestoreBackupFile";
import { reload, restoreV2BackupFile, useRestoreV1BackupFile } from "./utils";
import {
  UserEvent,
  act,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { umamiBackup } from "../../../mocks/umamiV1BackupFile";

jest.mock("./utils");

const mockReload = jest.mocked(reload);
const mockedUseRestoreV1BackupFile = jest.mocked(useRestoreV1BackupFile);
const mockRestoreV2BackupFile = jest.mocked(restoreV2BackupFile);

const mockRestoreV1BackupFile = jest.fn();

const emptyV2Backup = {
  version: "2.0.0-beta1",
  "persist:accounts": {
    items: [],
    seedPhrases: {},
    secretKeys: {},
  },
  "persist:root": "{}",
};

describe("<RestoreBackupFile />", () => {
  beforeEach(() => {
    mockedUseRestoreV1BackupFile.mockReturnValue(mockRestoreV1BackupFile);
  });

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
      await act(async () => await user.type(screen.getByTestId("password-input"), "1234"));
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
    const user = userEvent.setup();
    render(<RestoreBackupFile />);

    await uploadBackupFile({ foo: "bar" }, user);

    expect(mockToast).toHaveBeenCalledWith({
      description: "Invalid backup file.",
      status: "error",
    });
    expect(mockReload).toHaveBeenCalledTimes(0);
    expect(mockRestoreV1BackupFile).toHaveBeenCalledTimes(0);
    expect(mockRestoreV2BackupFile).toHaveBeenCalledTimes(0);
  });

  describe("for v1 backups", () => {
    it("shows error if backup file doesn't have derivationPaths", async () => {
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile({ recoveryPhrases: [] }, user);

      expect(mockToast).toHaveBeenCalledWith({
        description: "Invalid backup file.",
        status: "error",
      });
      expect(mockReload).toHaveBeenCalledTimes(0);
      expect(mockRestoreV1BackupFile).toHaveBeenCalledTimes(0);
      expect(mockRestoreV2BackupFile).toHaveBeenCalledTimes(0);
    });

    it("shows error if backup file doesn't have recoveryPhrases", async () => {
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile({ derivationPaths: [] }, user);

      expect(mockToast).toHaveBeenCalledWith({
        description: "Invalid backup file.",
        status: "error",
      });
      expect(mockReload).toHaveBeenCalledTimes(0);
      expect(mockRestoreV1BackupFile).toHaveBeenCalledTimes(0);
      expect(mockRestoreV2BackupFile).toHaveBeenCalledTimes(0);
    });

    it("opens parser if derivationPaths & recoveryPhrases fields are present", async () => {
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile({ derivationPaths: [], recoveryPhrases: [] }, user);

      expect(mockReload).toHaveBeenCalledTimes(0);
      expect(mockRestoreV1BackupFile).toHaveBeenCalledTimes(1);
      expect(mockRestoreV2BackupFile).toHaveBeenCalledTimes(0);
    });

    it("shows error from parser if thrown", async () => {
      mockedUseRestoreV1BackupFile.mockReturnValue(_ =>
        Promise.reject(new Error("Invalid password."))
      );
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile(umamiBackup, user);

      expect(mockToast).toHaveBeenCalledWith({
        description: "Invalid password.",
        status: "error",
      });
      expect(mockRestoreV2BackupFile).toHaveBeenCalledTimes(0);
      expect(mockReload).toHaveBeenCalledTimes(0);
    });
  });

  describe("for v2 backups", () => {
    it("shows error if backup file doesn't have persist:accounts", async () => {
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile({ version: "2.0.0-beta1", "persist:root": "{}" }, user);

      expect(mockToast).toHaveBeenCalledWith({
        description: "Invalid backup file.",
        status: "error",
      });
      expect(mockReload).toHaveBeenCalledTimes(0);
      expect(mockRestoreV1BackupFile).toHaveBeenCalledTimes(0);
      expect(mockRestoreV2BackupFile).toHaveBeenCalledTimes(0);
    });

    it("opens parser if persist:accounts field is present", async () => {
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile(
        {
          "persist:accounts": {
            items: [],
            seedPhrases: {},
            secretKeys: {},
          },
        },
        user
      );

      expect(mockReload).toHaveBeenCalledTimes(1);
      expect(mockRestoreV1BackupFile).toHaveBeenCalledTimes(0);
      expect(mockRestoreV2BackupFile).toHaveBeenCalledTimes(1);
    });

    it("shows error from parser if thrown", async () => {
      mockRestoreV2BackupFile.mockImplementation(() => {
        throw new Error("Invalid password.");
      });
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile(emptyV2Backup, user);

      expect(mockToast).toHaveBeenCalledWith({
        description: "Invalid password.",
        status: "error",
      });
      expect(mockRestoreV1BackupFile).toHaveBeenCalledTimes(0);
      expect(mockReload).toHaveBeenCalledTimes(0);
    });
  });

  describe.each([
    {
      backupType: "v1",
      backupJson: umamiBackup,
      expectedParser: mockRestoreV1BackupFile,
      otherParser: mockRestoreV2BackupFile,
    },
    {
      backupType: "v2",
      backupJson: emptyV2Backup,
      expectedParser: mockRestoreV2BackupFile,
      otherParser: mockRestoreV1BackupFile,
    },
  ])("for $backupType backups", ({ backupJson, expectedParser, backupType, otherParser }) => {
    it("opens parser without password when not provided", async () => {
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile(backupJson, user);

      if (backupType === "v2") {
        expect(mockReload).toHaveBeenCalledTimes(1);
      }

      expect(otherParser).toHaveBeenCalledTimes(0);
      expect(expectedParser).toHaveBeenCalledTimes(1);
      expect(expectedParser).toHaveBeenCalledWith(backupJson, "" /* empty password */);
    });

    it("opens parser with password when provided", async () => {
      const user = userEvent.setup();
      render(<RestoreBackupFile />);

      await uploadBackupFile(backupJson, user, "1234");

      if (backupType === "v2") {
        expect(mockReload).toHaveBeenCalledTimes(1);
      }

      expect(otherParser).toHaveBeenCalledTimes(0);
      expect(expectedParser).toHaveBeenCalledTimes(1);
      expect(expectedParser).toHaveBeenCalledWith(backupJson, "1234");
    });
  });
});
