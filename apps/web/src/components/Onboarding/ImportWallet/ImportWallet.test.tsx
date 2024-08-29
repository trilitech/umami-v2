import { mockImplicitAccount } from "@umami/core";
import { addTestAccount, makeStore } from "@umami/state";

import { ImportWallet } from "./ImportWallet";
import { renderInModal, screen, waitFor } from "../../../testUtils";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(map => map["lg"]),
}));

describe("<ImportWallet />", () => {
  it.each(["Seed Phrase", "Secret Key", "Ledger"])("renders %s tab", async tabName => {
    await renderInModal(<ImportWallet />);

    await waitFor(() => expect(screen.getByText(tabName)).toBeVisible());
  });

  describe("when the user has not onboarded", () => {
    it("renders the Backup tab", async () => {
      await renderInModal(<ImportWallet />);

      await waitFor(() => expect(screen.getByText("Backup")).toBeVisible());
    });
  });

  describe("when the user has onboarded", () => {
    it("does not render the Backup tab", async () => {
      const store = makeStore();
      addTestAccount(store, mockImplicitAccount(0));

      await renderInModal(<ImportWallet />, store);

      expect(screen.queryByText("Backup")).not.toBeInTheDocument();
    });
  });
});
