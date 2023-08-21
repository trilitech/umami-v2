import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReduxStore } from "../../../providers/ReduxStore";
import { defaultDerivationPathPattern } from "../../../utils/account/derivationPathUtils";
import { getPk } from "../../../utils/ledger/pk";
import RestoreLedger from "./RestoreLedger";

const closeModalMock = jest.fn(() => {});

jest.mock("../../../utils/ledger/pk");

const getPkMock = jest.mocked(getPk);

const fixture = (closeModal: () => void) => {
  const account = {
    type: "ledger" as const,
    derivationPath: defaultDerivationPathPattern,
    label: "Any Account",
  };
  return (
    <ReduxStore>
      <RestoreLedger closeModal={closeModal} account={account} />
    </ReduxStore>
  );
};

describe("<RestoreSeedphrase />", () => {
  test("success", async () => {
    getPkMock.mockResolvedValue({ pk: "test", pkh: "test" });
    render(fixture(closeModalMock));
    const confirmBtn = screen.getByRole("button", {
      name: /export public key/i,
    });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(closeModalMock).toBeCalledTimes(1);
    });
    expect(getPkMock).toBeCalledTimes(1);
  });

  test("aborted by user", async () => {
    getPkMock.mockRejectedValue(new Error());
    render(fixture(closeModalMock));
    const confirmBtn = screen.getByRole("button", {
      name: /export public key/i,
    });
    fireEvent.click(confirmBtn);

    // Control the loading cycle
    // Otherwise you get uncontrolled setStates that lead to act warnings.
    await waitFor(() => {
      expect(confirmBtn).toBeDisabled();
    });
    await waitFor(() => {
      expect(confirmBtn).toBeEnabled();
    });
  });
});
