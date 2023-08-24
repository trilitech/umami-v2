import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import { ShowMnemonic } from "./ShowMnemonic";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void) => {
  const account = { type: "mnemonic" as const, mnemonic: mnemonic1 };
  return <ShowMnemonic goToStep={goToStep} account={account} />;
};

describe("<ShowMnemonic />", () => {
  test("mnemonic is displayed", async () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", {
      name: /OK, I've recorded it/i,
    });
    mnemonic1.split(" ").forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });
    expect(confirmBtn).toBeEnabled();
    fireEvent.click(confirmBtn);
    expect(goToStepMock).toBeCalledTimes(1);
    expect(goToStepMock).toBeCalledWith({
      type: StepType.verifyMnemonic,
      account: {
        type: "mnemonic",
        mnemonic: mnemonic1,
      },
    });
  });
});
