import { Estimate } from "@taquito/taquito";
import MultisigPendingAccordion from ".";
import { mockImplicitAccount, mockMultisigAccount } from "../../../../mocks/factories";
import { pendingOps } from "../../../../mocks/multisig";
import { fireEvent, render, screen, within } from "../../../../mocks/testUtils";
import { ImplicitAccount } from "../../../../types/Account";
import { parseContractPkh, parseImplicitPkh } from "../../../../types/Address";
import { useGetSecretKey } from "../../../../utils/hooks/accountUtils";
import { multisigToAccount } from "../../../../utils/multisig/helpers";
import { Multisig } from "../../../../utils/multisig/types";
import accountsSlice from "../../../../utils/redux/slices/accountsSlice";
import multisigsSlice from "../../../../utils/redux/slices/multisigsSlice";
import store from "../../../../utils/redux/store";
import { estimateMultisigApproveOrExecute } from "../../../../utils/tezos";

jest.mock("../../../../utils/hooks/accountUtils");

beforeEach(() => {
  (useGetSecretKey as jest.Mock).mockReturnValue(() => Promise.resolve("mockkey"));
});
const multisigAccount = mockMultisigAccount(0);

describe("<MultisigPendingAccordion />", () => {
  it("should display no pending operations if there are none", () => {
    render(<MultisigPendingAccordion account={multisigAccount} />);
    expect(screen.getByText(/No multisig pending operations/i)).toBeInTheDocument();
  });

  it("should display multisig executable tez operations", async () => {
    (estimateMultisigApproveOrExecute as jest.Mock).mockResolvedValue({
      suggestedFeeMutez: 33,
    } as Estimate);
    const m: Multisig = {
      address: parseContractPkh("KT1Jr2UdC6boStHUrVyFYoxArKfNr1CDiYxK"),
      threshold: 1,
      signers: [parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3")],
      pendingOperationsBigmapId: 3,
    };
    const multisigAccount = multisigToAccount(m, "multi");
    store.dispatch(multisigsSlice.actions.setMultisigs([m]));
    store.dispatch(multisigsSlice.actions.setPendingOperations(pendingOps));

    const mockAccount: ImplicitAccount = {
      ...mockImplicitAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };

    store.dispatch(accountsSlice.actions.addAccount([mockAccount]));

    render(<MultisigPendingAccordion account={multisigAccount} />);

    const allPending = screen.getAllByTestId(/multisig-pending-operation/);
    expect(allPending).toHaveLength(2);
    const { getByText } = within(
      screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id)
    );
    const executeBtn = getByText(/execute/i);

    fireEvent.click(executeBtn);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    {
      const { getAllByText } = within(dialog);
      expect(getAllByText(/Execute transaction/i)).toBeTruthy();
    }
  });
});
