import { AssetsPanel } from "./AssetsPanel";
import { mockMultisigAccount } from "../../../mocks/factories";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { pendingOps } from "../../../mocks/multisig";
import { render, screen } from "../../../mocks/testUtils";
import { multisigsSlice } from "../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../utils/redux/store";
import { getCombinedOperations, getRelatedTokenTransfers } from "../../../utils/tezos";

describe("<AssetPanel/>", () => {
  describe("multisig account", () => {
    it("hides pending tab when no pending operations", async () => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

      const multisigAccount = mockMultisigAccount(0);
      render(<AssetsPanel account={multisigAccount} delegation={null} nfts={[]} tokens={[]} />);
      await screen.findByTestId("account-card-operations-tab");

      expect(screen.queryByTestId("account-card-pending-tab-panel")).not.toBeInTheDocument();
    });

    it("displays pending tab when pending operations are present", async () => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

      mockEstimatedFee(33);
      const multisig = {
        ...mockMultisigAccount(0),
        pendingOperationsBigmapId: 3,
      };
      store.dispatch(multisigsSlice.actions.setMultisigs([multisig]));
      store.dispatch(multisigsSlice.actions.setPendingOperations(pendingOps));

      render(<AssetsPanel account={multisig} delegation={null} nfts={[]} tokens={[]} />);
      await screen.findByTestId("account-card-operations-tab");

      expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
    });
  });
});
