import { TezosNetwork } from "@airgap/tezos";
import { mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { AssetsPannel } from "./AssetsPannel";

describe("<AssetPannel/>", () => {
  it("should display pending tabs for multisig account", () => {
    const multisigAccount = mockMultisigAccount(0);
    render(
      <AssetsPannel
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
