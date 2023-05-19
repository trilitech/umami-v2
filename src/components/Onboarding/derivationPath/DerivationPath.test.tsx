import {
  Step,
  StepType,
  TemporaryLedgerAccountConfig,
  TemporaryMnemonicAccountConfig,
} from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DerivationPath from "./DerivationPath";

const setStepMock = jest.fn((step: Step) => {});

const fixture = (
  setStep: (step: Step) => void,
  config: TemporaryMnemonicAccountConfig | TemporaryLedgerAccountConfig
) => <DerivationPath setStep={setStep} config={config} />;

describe("<DerivationPath />", () => {
  describe("When default path is selected", () => {
    test("Return default path", async () => {
      render(fixture(setStepMock, new TemporaryMnemonicAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.masterPassword,
        config: {
          derivationPath: "m/44'/1729'/?'/0'",
          label: undefined,
          seedphrase: undefined,
        },
      });
    });

    test("Return default path even if textfield has been modified", async () => {
      render(fixture(setStepMock, new TemporaryMnemonicAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const customPath = screen.getByTestId("custom-path");
      fireEvent.change(customPath, { target: { value: "test" } });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.masterPassword,
        config: {
          derivationPath: "m/44'/1729'/?'/0'",
          label: undefined,
          seedphrase: undefined,
        },
      });
    });
  });

  describe("When custom path is selected", () => {
    test("Return custom path", async () => {
      render(fixture(setStepMock, new TemporaryMnemonicAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const customPath = screen.getByTestId("custom-path");
      expect(customPath).toBeDisabled();
      const switchBtn = screen.getByTestId("switch");
      fireEvent.click(switchBtn);
      expect(customPath).toBeEnabled();
      fireEvent.change(customPath, { target: { value: "test" } });
      expect(customPath).toHaveValue("test");
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.masterPassword,
        config: {
          derivationPath: "test",
          label: undefined,
          seedphrase: undefined,
        },
      });
    });
  });

  describe("Navigate based on config type", () => {
    test("Mnemonic path", async () => {
      render(fixture(setStepMock, new TemporaryMnemonicAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.masterPassword,
        config: {
          derivationPath: "m/44'/1729'/?'/0'",
          label: undefined,
          seedphrase: undefined,
        },
      });
    });

    test("Ledger path", async () => {
      render(fixture(setStepMock, new TemporaryLedgerAccountConfig()));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.restoreLedger,
        config: {
          derivationPath: "44'/1729'/0'/0'",
          label: undefined,
          pk: undefined,
          pkh: undefined,
        },
      });
    });
  });
});
