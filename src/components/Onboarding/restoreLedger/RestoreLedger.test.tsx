import { Step, TemporaryLedgerAccountConfig } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RestoreLedger from "./RestoreLedger";
import { getPk } from "../../../utils/ledger/pk";
import { Modal } from "@chakra-ui/react";
import { getLedgerDerivationPath } from "../../../utils/account/derivationPathUtils";

const setStepMock = jest.fn((step: Step) => {});

// TODO refactor mocks
jest.mock("../../../utils/tezos/helpers");
jest.mock("../../../utils/ledger/pk");
const getPkMock = getPk as jest.Mock;

const config = new TemporaryLedgerAccountConfig();
config.derivationPath = getLedgerDerivationPath(0);

const fixture = (setStep: (step: Step) => void) => (
  <Modal isOpen={true} onClose={() => {}}>
    <RestoreLedger setStep={setStep} config={config} />
  </Modal>
);

describe("<RestoreSeedphrase />", () => {
  describe.only("Connect ledger", () => {
    test("success", async () => {
      getPkMock.mockReturnValue({ pk: "test", pkh: "test" });
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /export public key/i,
      });
      // await waitFor(() => {
      confirmBtn.click();
      // });
      await waitFor(() => {
        expect(confirmBtn).toBeDisabled();
      });
      // await waitFor(() => {
      //   expect(setStepMock).toBeCalledWith({
      //     type: StepType.nameAccount,
      //     config: {
      //       derivationPath: "44'/1729'/0'/0'",
      //       label: undefined,
      //       pk: "test",
      //       pkh: "test",
      //     },
      //   });
      // });
    });

    test("aborted by user", async () => {
      getPkMock.mockRejectedValue(new Error());
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /export public key/i,
      });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).not.toBeCalled();
      });
    });
  });
});
