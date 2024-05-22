import { Provider } from "react-redux";

import { RestoreSecretKey } from "./RestoreSecretKey";
import { act, fireEvent, render, screen, userEvent, waitFor } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { store } from "../../../utils/redux/store";
import { OnboardingStep } from "../OnboardingStep";

const fixture = (goToStep: (step: OnboardingStep) => void = jest.fn()) => (
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

      fireEvent.change(screen.getByTestId("secret-key"), {
        target: { value: "edesk..." },
      });
      await screen.findByTestId("password");

      fireEvent.blur(screen.getByTestId("password"));

      await waitFor(() => {
        expect(screen.getByText("Password is required")).toBeInTheDocument();
      });
    });
  });

  it("doesn't show the password field when the secret key is not encrypted", async () => {
    const user = userEvent.setup();
    render(fixture());

    expect(screen.queryByTestId("password")).not.toBeInTheDocument();

    await act(() => user.type(screen.getByTestId("secret-key"), "edsk..."));

    expect(screen.queryByTestId("password")).not.toBeInTheDocument();
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
    const user = userEvent.setup();
    const goToStepMock = jest.fn();
    render(fixture(goToStepMock));

    await act(() => user.type(screen.getByTestId("secret-key"), `  \t ${secretKey} `));

    if (password) {
      await act(() => user.type(screen.getByTestId("password"), password));
    }

    expect(screen.getByTestId("restore-continue-button")).toBeEnabled();

    await act(() => user.click(screen.getByTestId("restore-continue-button")));

    expect(goToStepMock).toHaveBeenCalledWith({
      type: "nameAccount",
      account: {
        type: "secret_key",
        secretKey: UNENCRYPTED_SECRET_KEY,
      },
    });
  });

  it("shows an error when the password is invalid", async () => {
    const user = userEvent.setup();
    render(fixture());

    await act(() => user.type(screen.getByTestId("secret-key"), ENCRYPTED_SECRET_KEY));

    await act(() => user.type(screen.getByTestId("password"), "wrong password"));

    expect(screen.getByTestId("restore-continue-button")).toBeEnabled();

    await act(() => user.click(screen.getByTestId("restore-continue-button")));

    expect(mockToast).toHaveBeenCalledWith({
      description: "Key-password pair is invalid",
      status: "error",
    });
  });

  it("shows an error when the secret key is invalid", async () => {
    const user = userEvent.setup();
    render(fixture());

    await act(() => user.type(screen.getByTestId("secret-key"), UNENCRYPTED_SECRET_KEY + "asdasd"));

    expect(screen.getByTestId("restore-continue-button")).toBeEnabled();

    await act(() => user.click(screen.getByTestId("restore-continue-button")));

    expect(mockToast).toHaveBeenCalledWith({
      description: "Invalid secret key: checksum doesn't match",
      status: "error",
    });
  });

  it("shows an error when the secret key is completely invalid", async () => {
    const user = userEvent.setup();
    render(fixture());

    await act(() => user.type(screen.getByTestId("secret-key"), "something invalid"));

    expect(screen.getByTestId("restore-continue-button")).toBeEnabled();

    await act(() => user.click(screen.getByTestId("restore-continue-button")));

    expect(mockToast).toHaveBeenCalledWith({
      description:
        "Invalid private key with unsupported prefix expecting one of the following 'edesk', 'edsk', 'spsk', 'spesk', 'p2sk' or 'p2esk'..",
      status: "error",
    });
  });
});
