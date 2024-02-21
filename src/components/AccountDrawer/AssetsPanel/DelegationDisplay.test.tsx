import { DelegationDisplay } from "./DelegationDisplay";
import { mockDelegation, mockImplicitAddress, mockMnemonicAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { act, render, screen, userEvent, within } from "../../../mocks/testUtils";
import { makeDelegation } from "../../../types/Delegation";
import { formatPkh, prettyTezAmount } from "../../../utils/format";
import { assetsSlice } from "../../../utils/redux/slices/assetsSlice";
import { store } from "../../../utils/redux/store";
import { DelegationOperation } from "../../../utils/tezos";

describe("<DelegationDisplay />", () => {
  const { updateTezBalance } = assetsSlice.actions;

  const account = mockMnemonicAccount(0);

  describe("when not delegating", () => {
    it("shows empty state", () => {
      render(<DelegationDisplay account={account} delegation={null} />);

      expect(screen.getByTestId("empty-state-message")).toBeVisible();
      expect(screen.getByText("No delegations to show")).toBeVisible();
      expect(screen.getByText("Your delegation history will appear here...")).toBeVisible();
    });

    it('shows "Delegate" button', () => {
      render(<DelegationDisplay account={account} delegation={null} />);

      expect(screen.getByTestId("delegation-empty-state-button")).toBeVisible();
      expect(screen.getByTestId("delegation-empty-state-button")).toHaveTextContent("Delegate");
    });

    it('opens delegation form on "Delegate" button click', async () => {
      const user = userEvent.setup();
      render(<DelegationDisplay account={account} delegation={null} />);

      await act(() => user.click(screen.getByTestId("delegation-empty-state-button")));

      expect(screen.getByTestId("delegate-form")).toBeVisible();
      const { getByText } = within(screen.getByTestId("delegate-form"));
      expect(getByText("Delegate")).toBeVisible();
    });

    it('hides "End Delegation" & "Change Baker" buttons', () => {
      render(<DelegationDisplay account={account} delegation={null} />);

      expect(screen.queryByText("End Delegation")).not.toBeInTheDocument();
      expect(screen.queryByText("Change Baker")).not.toBeInTheDocument();
    });
  });

  describe("when delegating", () => {
    const currentAccountBalance = 33200000000;
    const bakerAddress = mockImplicitAddress(2).pkh;

    const delegation = makeDelegation(
      mockDelegation(
        0,
        6000000,
        bakerAddress,
        "Some baker",
        new Date(2020, 5, 24)
      ) as DelegationOperation
    );

    beforeEach(() => {
      addAccount(account);
      store.dispatch(
        updateTezBalance([{ address: account.address.pkh, balance: currentAccountBalance }])
      );
    });

    it("hides empty state", () => {
      render(<DelegationDisplay account={account} delegation={delegation} />);

      expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
      expect(screen.queryByTestId("delegation-empty-state-button")).not.toBeInTheDocument();
    });

    it("displays delegation data", () => {
      render(<DelegationDisplay account={account} delegation={delegation} />);

      expect(screen.getByTestId("Initial Balance:")).toHaveTextContent("6.000000 ꜩ");
      expect(screen.getByTestId("Current Balance:")).toHaveTextContent(
        prettyTezAmount(currentAccountBalance.toString())
      );
      expect(screen.getByTestId("Duration:")).toHaveTextContent("Since 06/24/2020");
      expect(screen.getByTestId("Baker:")).toHaveTextContent(formatPkh(bakerAddress));
    });

    it('shows "End Delegation" & "Change Baker" buttons', () => {
      render(<DelegationDisplay account={account} delegation={delegation} />);

      expect(screen.getByText("End Delegation")).toBeVisible();
      expect(screen.getByText("Change Baker")).toBeVisible();
    });

    it('opens undelegation form on "End Delegation" button click', async () => {
      const user = userEvent.setup();
      render(<DelegationDisplay account={account} delegation={delegation} />);

      await act(() => user.click(screen.getByText("End Delegation")));

      expect(screen.getByTestId("undelegate-form")).toBeVisible();
      const { getByText } = within(screen.getByTestId("undelegate-form"));
      expect(getByText("End Delegation")).toBeVisible();
    });

    it('opens delegation form on "Change Baker" button click', async () => {
      const user = userEvent.setup();
      render(<DelegationDisplay account={account} delegation={delegation} />);

      await act(() => user.click(screen.getByText("Change Baker")));

      expect(screen.getByTestId("delegate-form")).toBeVisible();
      const { getByText } = within(screen.getByTestId("delegate-form"));
      expect(getByText("Change Baker")).toBeVisible();
    });
  });
});
