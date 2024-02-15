import { RestoreLedger } from "./RestoreLedger";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { defaultDerivationPathPattern } from "../../../utils/account/derivationPathUtils";
import { getPk } from "../../../utils/ledger/pk";

const closeModalMock = jest.fn(() => {});
jest.mock("../../../utils/ledger/pk");

const getPkMock = jest.mocked(getPk);

const fixture = () => {
  const account = {
    type: "ledger" as const,
    derivationPath: defaultDerivationPathPattern,
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
    });
    expect(confirmBtn).toBeEnabled();
  });
});
