import { mockImplicitAccount, rawAccountFixture } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
} from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { AccountBalanceDetails } from "./AccountBalanceDetails";
import { render, screen } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);
const stakerAddress = mockImplicitAddress(0).pkh;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<AccountBalanceDetails />", () => {
  describe("balance details", () => {
    it("hids 0 values", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
          }),
        ])
      );

      render(<AccountBalanceDetails />, { store });

      expect(screen.queryByTestId("total-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("staked-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("finalizable-balance")).not.toBeInTheDocument();
    });

    it("doesn't render balance if it's not available", () => {
      render(<AccountBalanceDetails />, { store });

      expect(screen.queryByTestId("total-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("staked-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("finalizable-balance")).not.toBeInTheDocument();
    });
  });

  describe("Delegation and staking", () => {
    it("renders delegation when delegate exists", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
          }),
        ])
      );

      render(<AccountBalanceDetails />, { store });

      expect(screen.getByText("mega_baker", { exact: false })).toBeInTheDocument();
      expect(screen.getByText("Delegation")).toBeInTheDocument();
    });

    it("no delegation status if not delegated and no staking-related balances", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            delegate: null,
          }),
        ])
      );

      render(<AccountBalanceDetails />, { store });

      expect(screen.queryByText("Delegation ended")).not.toBeInTheDocument();
      expect(screen.queryByTestId("current-baker")).not.toBeInTheDocument();
    });

    it("delegation status ended is shown if not delegated and finalizable balance", () => {
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

      render(<AccountBalanceDetails />, { store });

      expect(screen.getByText("Delegation ended")).toBeInTheDocument();
      expect(screen.queryByTestId("current-baker")).not.toBeInTheDocument();
    });

    it("delegation status Inactive is shown if not delegated and frozen unstaked balance", () => {
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
            status: "pending",
          },
        ])
      );

      render(<AccountBalanceDetails />, { store });

      expect(screen.getByText("Delegation ended")).toBeInTheDocument();
      expect(screen.queryByTestId("current-baker")).not.toBeInTheDocument();
    });

    it("renders staked and total balance", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
            stakedBalance: 1000000,
          }),
        ])
      );

      render(<AccountBalanceDetails />, { store });

      expect(screen.getByTestId("total-balance")).toHaveTextContent("1.234567 ꜩ");
      expect(screen.getByTestId("staked-balance")).toHaveTextContent("Staked");
      expect(screen.getByTestId("staked-balance")).toHaveTextContent("1 ꜩ");
      expect(screen.queryByTestId("frozen-unstaked-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("finalizable-balance")).not.toBeInTheDocument();
    });

    it("renders unstaked (frozen) balance when greater than 0", () => {
      const stakerAddress = mockImplicitAddress(0).pkh;
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
          }),
        ])
      );

      store.dispatch(
        assetsActions.updateUnstakeRequests([
          {
            cycle: 1,
            amount: 100000,
            staker: { address: stakerAddress },
            status: "pending",
          },
          {
            cycle: 1,
            amount: 20000,
            staker: { address: stakerAddress },
            status: "pending",
          },
        ])
      );

      render(<AccountBalanceDetails />, { store });

      expect(screen.getByTestId("total-balance")).toHaveTextContent("1.354567 ꜩ");
      expect(screen.queryByTestId("staked-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("finalizable-balance")).not.toBeInTheDocument();
      expect(screen.getByTestId("frozen-unstaked-balance")).toHaveTextContent("Frozen unstaked");
      expect(screen.getByTestId("frozen-unstaked-balance")).toHaveTextContent("0.12 ꜩ");
    });

    it("renders finalizable balance when greater than 0", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
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

      render(<AccountBalanceDetails />, { store });

      expect(screen.getByTestId("total-balance")).toHaveTextContent("Total");
      expect(screen.getByTestId("total-balance")).toHaveTextContent("1.534567 ꜩ");
      expect(screen.queryByTestId("staked-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("frozen-unstaked-balance")).not.toBeInTheDocument();
      expect(screen.getByTestId("finalizable-balance")).toHaveTextContent("Finalizable");
      expect(screen.getByTestId("finalizable-balance")).toHaveTextContent("0.3 ꜩ");
    });

    it("renders combination of staked, unstaked and frozen", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
            stakedBalance: 1000000,
          }),
        ])
      );

      store.dispatch(
        assetsActions.updateUnstakeRequests([
          {
            cycle: 1,
            amount: 10000,
            staker: { address: stakerAddress },
            status: "pending",
          },
          {
            cycle: 1,
            amount: 200000,
            staker: { address: stakerAddress },
            status: "pending",
          },
          {
            cycle: 2,
            amount: 3000000,
            staker: { address: stakerAddress },
            status: "finalizable",
          },
          {
            cycle: 5,
            amount: 40000000,
            staker: { address: stakerAddress },
            status: "finalized",
          },
        ])
      );

      render(<AccountBalanceDetails />, { store });

      expect(screen.getByTestId("total-balance")).toHaveTextContent("Total");
      expect(screen.getByTestId("total-balance")).toHaveTextContent("4.444567 ꜩ");
      expect(screen.getByTestId("staked-balance")).toHaveTextContent("Staked");
      expect(screen.getByTestId("staked-balance")).toHaveTextContent("1 ꜩ");
      expect(screen.getByTestId("frozen-unstaked-balance")).toHaveTextContent("Frozen unstaked");
      expect(screen.getByTestId("frozen-unstaked-balance")).toHaveTextContent("0.21 ꜩ");
      expect(screen.getByTestId("finalizable-balance")).toHaveTextContent("Finalizable");
      expect(screen.getByTestId("finalizable-balance")).toHaveTextContent("3 ꜩ");
    });
  });
});
