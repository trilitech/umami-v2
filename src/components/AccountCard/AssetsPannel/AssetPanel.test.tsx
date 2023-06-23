import { TezosNetwork } from "@airgap/tezos";
import { mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
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
        delegation={null}
        onDelegate={() => {}}
      />
    );

    expect(screen.getByTestId("account-card-pending-tab")).toBeInTheDocument();
    expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
  });
});
