import { BigNumber } from "bignumber.js";

import { AssetsPanel } from "./AssetsPanel";
import { mockMultisigAccount } from "../../../mocks/factories";
import { pendingOps } from "../../../mocks/multisig";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { parseContractPkh, parseImplicitPkh } from "../../../types/Address";
import { multisigToAccount } from "../../../utils/multisig/helpers";
import { Multisig } from "../../../utils/multisig/types";
import { multisigsSlice } from "../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../utils/redux/store";
import { estimate, getCombinedOperations, getRelatedTokenTransfers } from "../../../utils/tezos";

describe("<AssetPanel/>", () => {
  describe("multisig account", () => {
    it("should hide pending tab when no pending operations", async () => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

      const multisigAccount = mockMultisigAccount(0);
      render(<AssetsPanel account={multisigAccount} delegation={null} nfts={[]} tokens={[]} />);
      await waitFor(() => {
        // wait for the component to load
        expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("account-card-pending-tab-panel")).not.toBeInTheDocument();
    });

    it("should display pending tab when pending operations are present", async () => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

      jest.mocked(estimate).mockResolvedValue(new BigNumber(33));
      const m: Multisig = {
        address: parseContractPkh("KT1Jr2UdC6boStHUrVyFYoxArKfNr1CDiYxK"),
        threshold: 1,
        signers: [parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3")],
        pendingOperationsBigmapId: 3,
      };
      const multisigAccount = multisigToAccount(m, "multi");
      store.dispatch(multisigsSlice.actions.setMultisigs([m]));
      store.dispatch(multisigsSlice.actions.setPendingOperations(pendingOps));

      render(<AssetsPanel account={multisigAccount} delegation={null} nfts={[]} tokens={[]} />);
      await waitFor(() => {
        // wait for the component to load
        expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
      });

      expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
    });
  });
});
