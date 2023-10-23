import { mockMultisigAccount } from "../../../mocks/factories";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { getCombinedOperations, getTokenTransfersFor } from "../../../utils/tezos";
import { AssetsPanel } from "./AssetsPanel";

describe("<AssetPanel/>", () => {
  it("should display pending tabs for multisig account", async () => {
    jest.mocked(getCombinedOperations).mockResolvedValue([]);
    jest.mocked(getTokenTransfersFor).mockResolvedValue([]);

    const multisigAccount = mockMultisigAccount(0);
    render(<AssetsPanel account={multisigAccount} nfts={[]} tokens={[]} delegation={null} />);

    await waitFor(() => {
      expect(screen.getByTestId("account-card-pending-tab")).toBeInTheDocument();
    });
    expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
  });
});
