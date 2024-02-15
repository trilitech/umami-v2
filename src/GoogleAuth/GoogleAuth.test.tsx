import { userEvent } from "@testing-library/user-event";

import { getGoogleCredentials } from "./getGoogleCredentials";
import { GoogleAuth } from "./GoogleAuth";
import { act, render, screen } from "../mocks/testUtils";
import { mockToast } from "../mocks/toast";

jest.mock("./getGoogleCredentials");

describe("<GoogleAuth />", () => {
  it("calls the onAuth callback with the secret key and email", async () => {
    const user = userEvent.setup();
    const authSpy = jest.fn();
    jest.mocked(getGoogleCredentials).mockResolvedValue({
      secretKey: "test",
      email: "test@email.com",
    });
    render(<GoogleAuth onAuth={authSpy} />);

    await act(() => user.click(screen.getByTestId("google-auth-button")));

    expect(authSpy).toHaveBeenCalledWith("test", "test@email.com");
  });

  it("shows an error toast if the auth fails", async () => {
    const user = userEvent.setup();
    const authSpy = jest.fn();
    jest.mocked(getGoogleCredentials).mockRejectedValue(new Error("test"));
    render(<GoogleAuth onAuth={authSpy} />);

    await act(() => user.click(screen.getByTestId("google-auth-button")));

    expect(mockToast).toHaveBeenCalledWith({
      description: "test",
      status: "error",
      title: "Social login failed",
    });

    expect(authSpy).not.toHaveBeenCalled();
  });
});
