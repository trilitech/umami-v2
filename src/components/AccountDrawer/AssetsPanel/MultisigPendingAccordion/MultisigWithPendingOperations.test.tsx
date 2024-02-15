import { BigNumber } from "bignumber.js";

import { mockMnemonicAccount } from "../../../../mocks/factories";
import { pendingOps } from "../../../../mocks/multisig";
import { fireEvent, render, screen, within } from "../../../../mocks/testUtils";
import { MnemonicAccount } from "../../../../types/Account";
import { parseContractPkh, parseImplicitPkh } from "../../../../types/Address";
import { useGetSecretKey } from "../../../../utils/hooks/accountUtils";
import { multisigToAccount } from "../../../../utils/multisig/helpers";
import { Multisig } from "../../../../utils/multisig/types";
import { accountsSlice } from "../../../../utils/redux/slices/accountsSlice";
import { multisigsSlice } from "../../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../../utils/redux/store";
import { estimate } from "../../../../utils/tezos";

import { MultisigPendingAccordion } from ".";

jest.mock("../../../../utils/hooks/accountUtils");

beforeEach(() => {
  jest.mocked(useGetSecretKey).mockReturnValue(() => Promise.resolve("mockkey"));
});

describe("<MultisigPendingAccordion />", () => {
  it("should display multisig executable tez operations", async () => {
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

    const mockAccount: MnemonicAccount = {
      ...mockMnemonicAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };

    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockAccount]));

    render(<MultisigPendingAccordion account={multisigAccount} />);

    const allPending = screen.getAllByTestId(/multisig-pending-operation/);
    expect(allPending).toHaveLength(2);
    const { getByText } = within(
      screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id)
    );
    const executeBtn = getByText(/execute/i);

    fireEvent.click(executeBtn);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Execute transaction" })).toBeInTheDocument();
  });
});
