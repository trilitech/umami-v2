import { fireEvent, render, screen } from "@testing-library/react";

import { ConnectOrCreate } from "./ConnectOrCreate";
import { ReduxStore } from "../../../providers/ReduxStore";
import { Step, StepType } from "../useOnboardingModal";

const goToStepMock = jest.fn((step: Step) => {});
const closeModalMock = jest.fn(() => {});

const fixture = (goToStep: (step: Step) => void) => (
  <ReduxStore>
    <ConnectOrCreate closeModal={closeModalMock} goToStep={goToStep} />
  </ReduxStore>
);

describe("<ConnectOrCreate />", () => {
  test("Create new Account", () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", {
      name: /Create a new Account/i,
    });
    fireEvent.click(confirmBtn);
    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.notice });
  });

  test("I already have a wallet", () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", {
      name: /I already have a wallet/i,
    });
    fireEvent.click(confirmBtn);
    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.connectOptions });
  });

  test("Social login", async () => {
    // TODO: Test
  });
});
