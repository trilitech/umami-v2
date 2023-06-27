import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReduxStore } from "../../../providers/ReduxStore";
import { getPk } from "../../../utils/ledger/pk";
import RestoreLedger from "./RestoreLedger";

const closeModalMock = jest.fn(() => {});

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

const fixture = (closeModal: () => void) => {
  const account = { type: "ledger" as const, derivationPath: "any", label: "Any Account" };
  return (
    <ReduxStore>
      <RestoreLedger closeModal={closeModal} account={account} />
    </ReduxStore>
  );
};

describe("<RestoreSeedphrase />", () => {
  test("success", async () => {
    getPkMock.mockReturnValue({ pk: "test", pkh: "test" });
    render(fixture(closeModalMock));
    const confirmBtn = screen.getByRole("button", {
      name: /export public key/i,
    });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(confirmBtn).toBeDisabled();
    });
    expect(closeModalMock).toBeCalledTimes(1);
  });

  test("aborted by user", async () => {
    getPkMock.mockRejectedValue(new Error());
    render(fixture(closeModalMock));
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
