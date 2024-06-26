import { estimate, mockImplicitAccount, mockMultisigAccount } from "@umami/core";
import { multisigPendingOpsFixtures } from "@umami/multisig";
import { multisigsSlice, store } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { getCombinedOperations, getRelatedTokenTransfers } from "@umami/tzkt";

import { AssetsPanel } from "./AssetsPanel";
import { render, screen } from "../../../mocks/testUtils";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

jest.mock("@umami/tzkt", () => ({
  ...jest.requireActual("@umami/tzkt"),
  getCombinedOperations: jest.fn(),
  getRelatedTokenTransfers: jest.fn(),
}));

describe("<AssetsPanel />", () => {
  describe("multisig account", () => {
    it("hides pending tab when no pending operations", async () => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

      const multisigAccount = mockMultisigAccount(0);
      render(<AssetsPanel account={multisigAccount} nfts={[]} tokens={[]} />);
      await screen.findByTestId("account-card-operations-tab");

      expect(screen.queryByTestId("account-card-pending-tab-panel")).not.toBeInTheDocument();
    });

    it("displays pending tab when pending operations are present", async () => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

      jest.mocked(estimate).mockResolvedValueOnce({
        type: "implicit",
        operations: [],
        sender: mockImplicitAccount(0),
        signer: mockImplicitAccount(0),
        estimates: [executeParams()],
      });
      const multisig = {
        ...mockMultisigAccount(0),
        pendingOperationsBigmapId: 3,
      };
      store.dispatch(multisigsSlice.actions.setMultisigs([multisig]));
      store.dispatch(multisigsSlice.actions.setPendingOperations(multisigPendingOpsFixtures));

      render(<AssetsPanel account={multisig} nfts={[]} tokens={[]} />);
      await screen.findByTestId("account-card-operations-tab");

      expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
    });
  });
});
