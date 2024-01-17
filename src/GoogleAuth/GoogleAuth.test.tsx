import { userEvent } from "@testing-library/user-event";

import { getGoogleCredentials } from "./getGoogleCredentials";
import { GoogleAuth } from "./GoogleAuth";
import { render, screen, waitFor } from "../mocks/testUtils";
import { mockToast } from "../mocks/toast";

jest.mock("./getGoogleCredentials");

describe("<GoogleAuth />", () => {
  it("calls the onAuth callback with the secret key and email", async () => {
    const user = userEvent.setup();
    const authSpy = jest.fn();
    jest.mocked(getGoogleCredentials).mockImplementation(async () => ({
      secretKey: "test",
      email: "test@email.com",
    }));
    render(<GoogleAuth onAuth={authSpy} />);

    user.click(screen.getByTestId("google-auth-button"));

    await waitFor(() => {
      expect(authSpy).toHaveBeenCalledWith("test", "test@email.com");
    });
  });

  it("shows an error toast if the auth fails", async () => {
    const user = userEvent.setup();
    const authSpy = jest.fn();
    jest.mocked(getGoogleCredentials).mockImplementation(async () => {
      throw new Error("test");
    });
    render(<GoogleAuth onAuth={authSpy} />);

    user.click(screen.getByTestId("google-auth-button"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "test",
        status: "error",
        title: "Social login failed",
      });
    });

    expect(authSpy).not.toHaveBeenCalled();
  });
});
