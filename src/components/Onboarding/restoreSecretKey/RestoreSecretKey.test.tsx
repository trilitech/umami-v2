import { Provider } from "react-redux";

import { RestoreSecretKey } from "./RestoreSecretKey";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { store } from "../../../utils/redux/store";
import { Step } from "../useOnboardingModal";

const fixture = (goToStep: (step: Step) => void = jest.fn()) => (
  <Provider store={store}>
    <RestoreSecretKey goToStep={goToStep} />;
  </Provider>
);

const ENCRYPTED_SECRET_KEY =
  "edesk1GXwWmGjXiLHBKxGBxwmNvG21vKBh6FBxc4CyJ8adQQE2avP5vBB57ZUZ93Anm7i4k8RmsHaPzVAvpnHkFF";
const UNENCRYPTED_SECRET_KEY =
  "edskRk1hRPhBCsGRDfqRBKDY5ecPKLfBhQDC4MvmWwa8i8dXUiGEyWJ7vUDjFo1k59PHfRrQKSEM9ieJNH3FbqrrDFg18ZZorh";

describe("<RestoreSecretKey />", () => {
  describe("validations", () => {
    it("requires the secret key", async () => {
      render(fixture());

      fireEvent.blur(screen.getByTestId("secret-key"));

      await waitFor(() => {
        expect(screen.getByText("Secret key is required")).toBeInTheDocument();
      });
    });

    it("requires the password when the secret key is encrypted", async () => {
      render(fixture());

      fireEvent.change(screen.getByTestId("secret-key"), { target: { value: "edesk..." } });
      await screen.findByTestId("password");

      fireEvent.blur(screen.getByTestId("password"));

      await waitFor(() => {
        expect(screen.getByText("Password is required")).toBeInTheDocument();
      });
    });
  });

  it("doesn't show the password field when the secret key is not encrypted", async () => {
    render(fixture());

    expect(screen.queryByTestId("password")).not.toBeInTheDocument();
    fireEvent.change(screen.getByTestId("secret-key"), { target: { value: "edsk..." } });
    await waitFor(() => expect(screen.queryByTestId("password")).not.toBeInTheDocument());
  });

  it.each([
    {
      title: "encrypted secret key",
      password: "test",
      secretKey: ENCRYPTED_SECRET_KEY,
    },
    {
      title: "unencrypted secret key",
      secretKey: UNENCRYPTED_SECRET_KEY,
    },
  ])("goes to the name account step with $title", async ({ password, secretKey }) => {
    const goToStepMock = jest.fn();
    render(fixture(goToStepMock));

    fireEvent.change(screen.getByTestId("secret-key"), {
      target: {
        value: `  \t ${secretKey} `,
      },
    });

    if (password) {
      await screen.findByTestId("password");
      fireEvent.change(screen.getByTestId("password"), {
        target: {
          value: password,
        },
      });
    }

    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(goToStepMock).toHaveBeenCalledWith({
        type: "nameAccount",
        account: {
          type: "secret_key",
          secretKey: UNENCRYPTED_SECRET_KEY,
        },
      });
    });
  });

  it("shows an error when the password is invalid", async () => {
    render(fixture());

    fireEvent.change(screen.getByTestId("secret-key"), {
      target: {
        value: ENCRYPTED_SECRET_KEY,
      },
    });

    await screen.findByTestId("password");
    fireEvent.change(screen.getByTestId("password"), {
      target: {
        value: "wrong password",
      },
    });

    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "Key-password pair is invalid",
        status: "error",
      });
    });
  });

  it("shows an error when the secret key is invalid", async () => {
    render(fixture());

    fireEvent.change(screen.getByTestId("secret-key"), {
      target: {
        value: UNENCRYPTED_SECRET_KEY + "asdasd",
      },
    });

    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "Invalid secret key: checksum doesn't match",
        status: "error",
      });
    });
  });

  it("shows an error when the secret key is completely invalid", async () => {
    render(fixture());

    fireEvent.change(screen.getByTestId("secret-key"), {
      target: {
        value: "something invalid",
      },
    });

    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description:
          "Invalid private key with unsupported prefix expecting one of the following 'edesk', 'edsk', 'spsk', 'spesk', 'p2sk' or 'p2esk'..",
        status: "error",
      });
    });
  });
});
