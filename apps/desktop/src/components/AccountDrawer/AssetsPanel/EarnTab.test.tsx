import { mockMnemonicAccount, rawAccountFixture } from "@umami/core";
import { addTestAccount, assetsSlice, store } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { EarnTab } from "./EarnTab";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";

const { updateAccountStates, updateBakers } = assetsSlice.actions;
const account = mockMnemonicAccount(0);

describe("<EarnTab />", () => {
  describe("when not delegating", () => {
    it("shows an empty state", () => {
      render(<EarnTab account={account} />);

      expect(screen.getByTestId("delegation-status")).toHaveTextContent("Inactive");
      expect(screen.getByTestId("staked-balance")).toHaveTextContent("0.000000 ꜩ");

      expect(screen.getByRole("button", { name: "Delegate" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Delegate" })).toBeEnabled();

      expect(screen.getByRole("button", { name: "Stake" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Stake" })).toBeDisabled();

      expect(screen.queryByRole("button", { name: "Unstake" })).not.toBeInTheDocument();

      expect(screen.queryByTestId("end-delegation-button")).not.toBeInTheDocument();
      expect(screen.queryByTestId("change-delegation-button")).not.toBeInTheDocument();

      expect(screen.getByRole("link", { name: /View Bakers/ })).toBeVisible();
    });

    it('opens delegation form on "Delegate" button click', async () => {
      const user = userEvent.setup();
      render(<EarnTab account={account} />);

      await act(() => user.click(screen.getByRole("button", { name: "Delegate" })));

      expect(screen.getByRole("heading", { name: "Delegation" })).toBeVisible();

      await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

      expect(screen.getByTestId("delegate-form")).toBeVisible();
    });
  });

  describe("when delegating", () => {
    const baker = {
      address: mockImplicitAddress(2).pkh,
      name: "Baker name",
      stakingBalance: 234798273,
    };
    const accountState = rawAccountFixture({
      address: account.address.pkh,
      balance: 33200000000,
      stakedBalance: 1234,
      delegate: baker,
    });

    beforeEach(() => addTestAccount(account));

    it("displays delegation data", () => {
      store.dispatch(updateAccountStates([accountState]));
      store.dispatch(updateBakers([baker]));

      render(<EarnTab account={account} />);

      expect(screen.getByTestId("delegation-status")).toHaveTextContent("Active");
      expect(screen.getByTestId("staked-balance")).toHaveTextContent("0.001234 ꜩ");

      expect(screen.queryByRole("button", { name: "Delegate" })).not.toBeInTheDocument();

      expect(screen.getByRole("button", { name: "Stake" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Stake" })).toBeEnabled();

      expect(screen.getByRole("button", { name: "Unstake" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Unstake" })).toBeEnabled();

      expect(screen.getByTestId("end-delegation-button")).toBeVisible();
      expect(screen.getByTestId("change-delegation-button")).toBeVisible();

      expect(screen.queryByRole("link", { name: /View Bakers/ })).not.toBeInTheDocument();
    });

    it("disables the unstake button when the account has no staked balance", () => {
      store.dispatch(updateAccountStates([{ ...accountState, stakedBalance: 0 }]));
      store.dispatch(updateBakers([baker]));

      render(<EarnTab account={account} />);

      expect(screen.getByRole("button", { name: "Unstake" })).toBeDisabled();
    });

    it('opens undelegation form on "End Delegation" button click', async () => {
      store.dispatch(updateAccountStates([rawAccountFixture(accountState)]));
      store.dispatch(updateBakers([baker]));
      const user = userEvent.setup();

      render(<EarnTab account={account} />);

      await act(() => user.click(screen.getByTestId("end-delegation-button")));

      expect(screen.getByTestId("undelegate-form")).toBeVisible();
    });

    it('opens delegation form on "Change Baker" button click', async () => {
      store.dispatch(updateAccountStates([accountState]));
      store.dispatch(updateBakers([baker]));

      const user = userEvent.setup();
      render(<EarnTab account={account} />);

      await act(() => user.click(screen.getByTestId("change-delegation-button")));

      expect(screen.getByRole("heading", { name: "Important Notice" })).toBeVisible();

      await act(() => user.click(screen.getByRole("button", { name: "I understand" })));

      expect(screen.getByTestId("delegate-form")).toBeVisible();
    });
  });
});
