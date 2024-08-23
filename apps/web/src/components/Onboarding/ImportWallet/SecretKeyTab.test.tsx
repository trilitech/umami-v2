import { fireEvent } from "@testing-library/react";
import { mockToast } from "@umami/state";

import { SecretKeyTab } from "./SecretKeyTab";
import { act, render, screen, userEvent, waitFor } from "../../../testUtils";

const ENCRYPTED_SECRET_KEY =
  "edesk1GXwWmGjXiLHBKxGBxwmNvG21vKBh6FBxc4CyJ8adQQE2avP5vBB57ZUZ93Anm7i4k8RmsHaPzVAvpnHkFF";
const UNENCRYPTED_SECRET_KEY =
  "edskRk1hRPhBCsGRDfqRBKDY5ecPKLfBhQDC4MvmWwa8i8dXUiGEyWJ7vUDjFo1k59PHfRrQKSEM9ieJNH3FbqrrDFg18ZZorh";

describe("<SecretKeyTab />", () => {
  it("renders only textbox by default", () => {
    render(<SecretKeyTab />);

    expect(screen.getByLabelText("Secret Key")).toBeVisible();
    expect(screen.queryByRole("Password")).not.toBeInTheDocument();
  });

  describe("validations", () => {
    it("requires the secret key", async () => {
      render(<SecretKeyTab />);

      fireEvent.blur(screen.getByLabelText("Secret Key"));

      await waitFor(() => expect(screen.getByText("Secret Key is required")).toBeVisible());
    });

    it("requires the password when the secret key is encrypted", async () => {
      const user = userEvent.setup();

      render(<SecretKeyTab />);

      await act(() => user.type(screen.getByLabelText("Secret Key"), ENCRYPTED_SECRET_KEY));
      fireEvent.blur(screen.getByLabelText("Password"));

      await waitFor(() => expect(screen.getByText("Password is required")).toBeVisible());
    });

    it("checks if the secret key is valid", async () => {
      const user = userEvent.setup();

      render(<SecretKeyTab />);

      await act(() =>
        user.type(screen.getByLabelText("Secret Key"), UNENCRYPTED_SECRET_KEY + "somedatas")
      );

      await act(() => user.click(screen.getByRole("button", { name: "Import Wallet" })));

      expect(mockToast).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith({
        status: "error",
        isClosable: true,
        description: "Invalid secret key: checksum doesn't match",
      });
    });

    it("checks if the key-password pair is valid", async () => {
      const user = userEvent.setup();

      render(<SecretKeyTab />);

      await act(() => user.type(screen.getByLabelText("Secret Key"), ENCRYPTED_SECRET_KEY));
      await act(() => user.type(screen.getByLabelText("Password"), "wrongpassword"));

      await act(() => user.click(screen.getByRole("button", { name: "Import Wallet" })));

      expect(mockToast).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith({
        status: "error",
        isClosable: true,
        description: "Key-password pair is invalid",
      });
    });
  });

  it('shows password input when "secretKey" is encrypted', async () => {
    const user = userEvent.setup();

    render(<SecretKeyTab />);

    await act(() => user.type(screen.getByLabelText("Secret Key"), ENCRYPTED_SECRET_KEY));

    expect(screen.getByLabelText("Password")).toBeVisible();
  });

  it("doesn't show the password field when the secret key is not encrypted", async () => {
    const user = userEvent.setup();

    render(<SecretKeyTab />);

    await act(() => user.type(screen.getByLabelText("Secret Key"), UNENCRYPTED_SECRET_KEY));

    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  });
});
