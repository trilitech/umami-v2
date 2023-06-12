import { Modal } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getLedgerDerivationPath } from "../../../utils/account/derivationPathUtils";
import { getPk } from "../../../utils/ledger/pk";
import { Step, TemporaryLedgerAccountConfig } from "../useOnboardingModal";
import RestoreLedger from "./RestoreLedger";

const setStepMock = jest.fn((step: Step) => {});

// TODO refactor mocks
jest.mock("../../../utils/tezos/helpers");
jest.mock("../../../utils/ledger/pk");

jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    // Mock taost since it has an erratic behavior in RTL
    // https://github.com/chakra-ui/chakra-ui/issues/2969
    //
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useToast: require("../../../mocks/toast").useToast,
  };
});

const getPkMock = getPk as jest.Mock;

const config = new TemporaryLedgerAccountConfig();
config.derivationPath = getLedgerDerivationPath(0);

const fixture = (setStep: (step: Step) => void) => (
  <Modal isOpen={true} onClose={() => {}}>
    <RestoreLedger setStep={setStep} config={config} />
  </Modal>
);

describe("<RestoreSeedphrase />", () => {
  describe("Connect ledger", () => {
    test("success", async () => {
      getPkMock.mockReturnValue({ pk: "test", pkh: "test" });
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /export public key/i,
      });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(confirmBtn).toBeDisabled();
      });
    });

    test("aborted by user", async () => {
      getPkMock.mockRejectedValue(new Error());
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /export public key/i,
      });
      fireEvent.click(confirmBtn);

      const btn = screen.getByRole("button", { name: /Export Public Key/i });

      // Control the loading cycle
      // Otherwise you get uncontrolled setStates that lead to act warnings.
      await waitFor(() => {
        expect(btn).toBeDisabled();
      });
      await waitFor(() => {
        expect(btn).toBeEnabled();
      });
    });
  });
});
