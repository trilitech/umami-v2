import {
  Step,
  StepType,
  TemporaryLedgerAccountConfig,
  TemporaryMnemonicAccountConfig,
  TemporarySocialAccountConfig,
} from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NameAccount from "./NameAccount";
import { ReduxStore } from "../../../providers/ReduxStore";

const setStepMock = jest.fn((step: Step) => {});

const fixture = (
  setStep: (step: Step) => void,
  config: TemporaryMnemonicAccountConfig | TemporaryLedgerAccountConfig
) => (
  <ReduxStore>
    <NameAccount setStep={setStep} config={config} />
  </ReduxStore>
);

describe("<NameAccount />", () => {
  describe("Shown", () => {
    test("Set a name", async () => {
      render(fixture(setStepMock, new TemporaryMnemonicAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const name = screen.getByTestId("name");
      fireEvent.change(name, { target: { value: "name" } });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        config: {
          derivationPath: undefined,
          label: "name",
          seedphrase: undefined,
        },
      });
    });

    test("Set no name", async () => {
      render(fixture(setStepMock, new TemporaryMnemonicAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        config: {
          derivationPath: undefined,
          label: "Account 1",
          seedphrase: undefined,
        },
      });
    });
  });

  describe("Navigate to the right place", () => {
    test("Mnemonic", async () => {
      render(fixture(setStepMock, new TemporaryMnemonicAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        config: {
          derivationPath: undefined,
          label: "Account 1",
          seedphrase: undefined,
        },
      });
    });

    test("Social", async () => {
      render(fixture(setStepMock, new TemporarySocialAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        config: {
          derivationPath: undefined,
          label: "Account 1",
          seedphrase: undefined,
        },
      });
    });

    test("Ledger", async () => {
      render(fixture(setStepMock, new TemporaryLedgerAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.masterPassword,
        config: {
          derivationPath: undefined,
          label: "Account 1",
          pk: undefined,
          pkh: undefined,
        },
      });
    });
  });
});
