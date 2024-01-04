import { Provider } from "react-redux";

import { RestoreSecretKey } from "./RestoreSecretKey";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { store } from "../../../utils/redux/store";
import { Step } from "../useOnboardingModal";

const fixture = (goToStep: (step: Step) => void) => (
  <Provider store={store}>
    <RestoreSecretKey goToStep={goToStep} />;
  </Provider>
);

describe("<RestoreSecretKey />", () => {
  it("requires the secret key", async () => {
    render(fixture(jest.fn()));

    fireEvent.blur(screen.getAllByRole("textbox")[0]);

    await waitFor(() => {
      expect(screen.getByText("Secret key is required")).toBeInTheDocument();
    });
  });

  it("goes to the name account step", async () => {
    const goToStepMock = jest.fn();
    render(fixture(goToStepMock));

    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "test data" } });

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(goToStepMock).toHaveBeenCalledWith({
        type: "nameAccount",
        account: {
          type: "secret_key",
          secretKey: "test data",
        },
      });
    });
  });
});
