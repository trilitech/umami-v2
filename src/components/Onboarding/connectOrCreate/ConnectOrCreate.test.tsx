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
  test("Create new Account", async () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", {
      name: /Create a new Account/i,
    });
    fireEvent.click(confirmBtn);
    expect(goToStepMock).toBeCalledTimes(1);
    expect(goToStepMock).toBeCalledWith({ type: StepType.notice });
  });

  test("I already have a wallet", async () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", {
      name: /I already have a wallet/i,
    });
    fireEvent.click(confirmBtn);
    expect(goToStepMock).toBeCalledTimes(1);
    expect(goToStepMock).toBeCalledWith({ type: StepType.connectOptions });
  });

  test("Social login", async () => {
    // TODO: Test
  });
});
