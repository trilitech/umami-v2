import { mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { AssetsPanel } from "./AssetsPanel";

describe("<AssetPanel/>", () => {
  it("should display pending tabs for multisig account", () => {
    const multisigAccount = mockMultisigAccount(0);
    render(
      <AssetsPanel
        account={multisigAccount}
        nfts={[]}
        tokens={[]}
        operationDisplays={[]}
        network={TezosNetwork.MAINNET}
      />
    );

    expect(screen.getByTestId("account-card-pending-tab")).toBeInTheDocument();
    expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
  });
});
