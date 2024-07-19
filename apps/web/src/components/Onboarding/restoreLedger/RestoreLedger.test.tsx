import { mockToast } from "@umami/state";
import { defaultDerivationPathTemplate, getLedgerPublicKeyPair } from "@umami/tezos";

import { RestoreLedger } from "./RestoreLedger";
import { act, render, screen, userEvent } from "../../../testUtils";

const closeModalMock = jest.fn(() => {});

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  getLedgerPublicKeyPair: jest.fn(),
}));

const getPkMock = jest.mocked(getLedgerPublicKeyPair);

const fixture = () => {
  const account = {
    type: "ledger" as const,
    derivationPath: defaultDerivationPathTemplate,
    label: "Any Account",
  };
  return <RestoreLedger account={account} closeModal={closeModalMock} />;
};

describe("<RestoreLedger />", () => {
  test("success", async () => {
    const user = userEvent.setup();
    getPkMock.mockResolvedValue({ pk: "test", pkh: "test" });
    render(fixture());

    const confirmBtn = screen.getByRole("button", {
      name: "Export Public Key",
    });
    await act(() => user.click(confirmBtn));

    expect(mockToast).toHaveBeenCalledWith({
      description: "Account successfully created!",
      status: "success",
    });
    expect(closeModalMock).toHaveBeenCalledTimes(1);
    expect(getPkMock).toHaveBeenCalledTimes(1);
  });

  test("aborted by user", async () => {
    const user = userEvent.setup();
    getPkMock.mockRejectedValue(new Error());
    render(fixture());

    const confirmBtn = screen.getByRole("button", {
      name: "Export Public Key",
    });
    await act(() => user.click(confirmBtn));

    expect(mockToast).toHaveBeenCalledWith({
      description: "Ledger error. Error",
      status: "error",
      isClosable: true,
    });
    expect(confirmBtn).toBeEnabled();
  });
});
