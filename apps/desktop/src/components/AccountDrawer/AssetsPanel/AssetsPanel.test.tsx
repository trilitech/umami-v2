import { AssetsPanel } from "./AssetsPanel";
import { executeParams } from "../../../mocks/executeParams";
import { mockImplicitAccount, mockMultisigAccount } from "../../../mocks/factories";
import { pendingOps } from "../../../mocks/multisig";
import { render, screen } from "../../../mocks/testUtils";
import { multisigsSlice } from "../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../utils/redux/store";
import { estimate, getCombinedOperations, getRelatedTokenTransfers } from "../../../utils/tezos";

jest.mock("../../../utils/tezos", () => ({
  ...jest.requireActual("../../../utils/tezos"),
  getCombinedOperations: jest.fn(),
  getRelatedTokenTransfers: jest.fn(),
  estimate: jest.fn(),
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
      store.dispatch(multisigsSlice.actions.setPendingOperations(pendingOps));

      render(<AssetsPanel account={multisig} nfts={[]} tokens={[]} />);
      await screen.findByTestId("account-card-operations-tab");

      expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
    });
  });
});