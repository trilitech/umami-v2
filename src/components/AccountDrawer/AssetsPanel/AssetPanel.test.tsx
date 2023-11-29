import { AssetsPanel } from "./AssetsPanel";
import { mockMultisigAccount } from "../../../mocks/factories";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { getCombinedOperations, getRelatedTokenTransfers } from "../../../utils/tezos";

describe("<AssetPanel/>", () => {
  it("should display pending tabs for multisig account", async () => {
    jest.mocked(getCombinedOperations).mockResolvedValue([]);
    jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

    const multisigAccount = mockMultisigAccount(0);
    render(<AssetsPanel account={multisigAccount} delegation={null} nfts={[]} tokens={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId("account-card-pending-tab")).toBeInTheDocument();
    });
    expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
  });
});
