import { mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { MAINNET } from "../../../types/Network";
import { AssetsPanel } from "./AssetsPanel";

describe("<AssetPanel/>", () => {
  it("should display pending tabs for multisig account", () => {
    const multisigAccount = mockMultisigAccount(0);
    render(<AssetsPanel account={multisigAccount} nfts={[]} tokens={[]} network={MAINNET} />);

    expect(screen.getByTestId("account-card-pending-tab")).toBeInTheDocument();
    expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
  });
});
