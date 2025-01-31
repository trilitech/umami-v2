import { mockImplicitAccount, rawAccountFixture } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
} from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { Earn } from "./Earn";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

const account = mockImplicitAccount(0);
const stakerAddress = mockImplicitAddress(0).pkh;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<Earn />", () => {
  it("renders correctly if user is verified and not delegated", () => {
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({
          address: account.address.pkh,
          delegate: null,
        }),
      ])
    );
    store.dispatch(
      assetsActions.updateUnstakeRequests([
        {
          cycle: 2,
          amount: 300000,
          staker: { address: stakerAddress },
          status: "finalizable",
        },
      ])
    );

    render(<Earn />, { store });

    const link = screen.getByRole("link", { name: "Start earning" });

    expect(screen.getByText("Earn rewards")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Unlock the potential of your tez. Delegate or stake now and see your rewards grow."
      )
    ).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://stake.tezos.com/");
  });

  it("renders correctly if user is verified and delegated and not staked", () => {
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({
          address: account.address.pkh,
        }),
      ])
    );

    render(<Earn />, { store });

    const link = screen.getByRole("link", { name: "Stake" });

    expect(screen.getByText("Boost your rewards")).toBeInTheDocument();
    expect(
      screen.getByText("Maximize your tez with staking.com. Secure, efficient, and simple.")
    ).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://stake.tezos.com/");
  });

  it("renders correctly if user is verified and delegated and staked", () => {
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({
          address: account.address.pkh,
        }),
      ])
    );
    store.dispatch(
      assetsActions.updateUnstakeRequests([
        {
          cycle: 2,
          amount: 300000,
          staker: { address: stakerAddress },
          status: "pending",
        },
      ])
    );

    render(<Earn />, { store });

    const link = screen.getByRole("link", { name: "Manage funds" });

    expect(screen.getByText("Manage your funds")).toBeInTheDocument();
    expect(
      screen.getByText("Stake, unstake and finalize the unstaked tez using the Tezos staking app.")
    ).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://stake.tezos.com/");
  });

  it("renders empty message if user is not verified", () => {
    store.dispatch(
      accountsActions.setIsVerified({
        isVerified: false,
        pkh: account.address.pkh,
      })
    );
    render(<Earn />, { store });

    expect(screen.getByTestId("empty-state-message")).toBeInTheDocument();
  });
});
