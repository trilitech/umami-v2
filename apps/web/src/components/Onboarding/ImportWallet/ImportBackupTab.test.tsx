import { mockToast } from "@umami/state";
import { backup, fileUploadMock } from "@umami/test-utils";

import { ImportBackupTab } from "./ImportBackupTab";
import { act, fireEvent, render, screen, userEvent, waitFor } from "../../../testUtils";

jest.mock("../../../utils/persistor", () => ({
  persistor: { pause: jest.fn(), resume: jest.fn() },
}));

jest.setTimeout(15000);

describe("<ImportBackupTab />", () => {
  it("next button is disabled if the file is not uploaded", () => {
    render(<ImportBackupTab />);

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  describe("opens the correct master password modal", () => {
    it("for non-social account", async () => {
      const user = userEvent.setup();
      const file = fileUploadMock({
        "persist:accounts": JSON.stringify({
          defaultAccount:
            '{"type":"mnemonic","curve":"ed25519","pk":"********","address":{"type":"implicit","pkh":"pkh"},"derivationPath":"44\'/1729\'/0\'/0\'","derivationPathTemplate":"44\'/1729\'/?\'/0\'","seedFingerPrint":"seedFingerPrint","label":"label","isVerified":false}',
        }),
      });

      render(<ImportBackupTab />);

      await act(() => user.upload(screen.getByTestId("file-input"), file));

      const button = screen.getByRole("button", { name: "Next" });
      expect(button).toBeEnabled();

      await act(() => user.click(button));

      await screen.findByText("Confirm password");
      await screen.findByTestId("master-password");
    });

    it("for social account", async () => {
      const user = userEvent.setup();
      const file = fileUploadMock({
        "persist:accounts": JSON.stringify({
          defaultAccount:
            '{"type":"social","pk":"********","address":{"type":"implicit","pkh":"pkh"},"idp":"google","label":"label"}',
        }),
      });

      render(<ImportBackupTab />);

      await act(() => user.upload(screen.getByTestId("file-input"), file));

      const button = screen.getByRole("button", { name: "Next" });
      expect(button).toBeEnabled();

      await act(() => user.click(button));

      await screen.findByText("Confirm password");
      await screen.findByTestId("social-login-button");
    });
  });

  it("shows a toast if the password is invalid", async () => {
    const user = userEvent.setup();
    const file = fileUploadMock(backup);

    render(<ImportBackupTab />);

    await act(() => user.upload(screen.getByTestId("file-input"), file));

    const button = screen.getByRole("button", { name: "Next" });

    await act(() => user.click(button));

    const passwordInput = await screen.findByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "invalid" } });
    await act(() => user.click(screen.getByText("Submit")));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        status: "error",
        isClosable: true,
        description: "Error decrypting data: Invalid password",
      })
    );
  });

  // TODO: add test for restoring the backup
  //   it("restores the backup", async () => {
  //     const user = userEvent.setup();

  //     const { store } = render(<ImportBackupTab />);
  //     const file = fileUploadMock(backup);

  //     const password = "qwerty123!!!Test00";
  //     await act(() => user.upload(screen.getByTestId("file-input"), file));

  //     const button = screen.getByRole("button", { name: "Next" });

  //     await act(() => user.click(button));

  //     const passwordInput = await screen.findByLabelText("Password");
  //     fireEvent.change(passwordInput, { target: { value: password } });
  //     await act(() => user.click(screen.getByText("Submit")));

  //     await waitFor(() => {
  //       console.log(store.getState().accounts);
  //     });

  //     await waitFor(() => expect(store.getState().accounts.items.length).toEqual(1));
  //   });
});
