import { mockSocialAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";

import { ConnectOptions } from "./ConnectOptions";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";

const goToStepMock = jest.fn();

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<ConnectOptions />", () => {
  describe("restore from backup", () => {
    it("navigates to the restore backup step", async () => {
      const user = userEvent.setup();
      render(<ConnectOptions goToStep={goToStepMock} />, { store });

      await act(() =>
        user.click(
          screen.getByRole("button", {
            name: "Restore from Backup",
          })
        )
      );

      expect(goToStepMock).toHaveBeenCalledTimes(1);
      expect(goToStepMock).toHaveBeenCalledWith({ type: "restoreBackup" });
    });

    it("hides the button if a user tries to add another account", () => {
      addTestAccount(store, mockSocialAccount(0));

      render(<ConnectOptions goToStep={goToStepMock} />, { store });

      expect(screen.queryByRole("button", { name: "Restore from Backup" })).not.toBeInTheDocument();
    });
  });

  it("navigates to import seed phrase step", async () => {
    const user = userEvent.setup();
    render(<ConnectOptions goToStep={goToStepMock} />, { store });

    await user.click(
      screen.getByRole("button", {
        name: "Import with Seed Phrase",
      })
    );

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: "restoreMnemonic" });
  });

  it("navigates to import secret key step", async () => {
    const user = userEvent.setup();
    render(<ConnectOptions goToStep={goToStepMock} />, { store });

    await user.click(
      screen.getByRole("button", {
        name: "Import with Secret Key",
      })
    );

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: "restoreSecretKey" });
  });

  it("navigates to connect ledger step", async () => {
    const user = userEvent.setup();
    render(<ConnectOptions goToStep={goToStepMock} />, { store });

    await user.click(
      screen.getByRole("button", {
        name: "Connect ledger",
      })
    );

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({
      type: "nameAccount",
      account: { type: "ledger" },
    });
  });
});
