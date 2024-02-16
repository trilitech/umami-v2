import { ConnectOrCreate } from "./ConnectOrCreate";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { StepType } from "../useOnboardingModal";

const goToStepMock = jest.fn();

const fixture = () => <ConnectOrCreate closeModal={jest.fn()} goToStep={goToStepMock} />;

describe("<ConnectOrCreate />", () => {
  test("Create new Account", async () => {
    const user = userEvent.setup();
    render(fixture());

    const confirmBtn = screen.getByRole("button", {
      name: "Create a new Account",
    });
    await act(() => user.click(confirmBtn));

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.notice });
  });

  test("I already have a wallet", async () => {
    const user = userEvent.setup();
    render(fixture());

    const confirmBtn = screen.getByRole("button", {
      name: "I already have a wallet",
    });
    await act(() => user.click(confirmBtn));

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.connectOptions });
  });

  test("Social login", async () => {
    // TODO: Test
  });
});
