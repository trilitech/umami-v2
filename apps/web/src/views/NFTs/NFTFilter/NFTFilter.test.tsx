import userEvent from "@testing-library/user-event";
import { mockImplicitAccount, mockNFTToken } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
  tokensActions,
} from "@umami/state";
import { MAINNET } from "@umami/tezos";

import { NFTFilter } from "./NFTFilter";
import { useNFTFilter } from "./useNFTFilter";
import { render, screen, within } from "../../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);
const address = account.address.pkh;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(address));
});

const TestComponent = () => {
  const { options, getCheckboxProps, selected } = useNFTFilter();
  return <NFTFilter getCheckboxProps={getCheckboxProps} options={options} selected={selected} />;
};

describe("NFTFilter", () => {
  it("renders filter button", () => {
    render(<TestComponent />, { store });

    expect(screen.getByTestId("nft-filter-trigger")).toBeInTheDocument();
    expect(screen.getByText("Filter By")).toBeInTheDocument();
  });

  it("opens filter dropdown when button is clicked", async () => {
    const nfts = [
      mockNFTToken(0, address, { lastLevel: 0 }),
      mockNFTToken(1, address, { lastLevel: 1 }),
    ];
    nfts[0].token.contract.alias = "Contract A";
    nfts[1].token.contract.alias = "Contract B";
    store.dispatch(assetsActions.updateTokenBalance(nfts));
    store.dispatch(
      tokensActions.addTokens({ tokens: nfts.map(nft => nft.token), network: MAINNET })
    );

    const user = userEvent.setup();
    render(<TestComponent />, { store });

    const filterButton = screen.getByTestId("nft-filter-trigger");
    await user.click(filterButton);

    expect(screen.getByTestId("nft-filter")).toBeInTheDocument();
    expect(screen.getByText("Contract A")).toBeInTheDocument();
    expect(screen.getByText("Contract B")).toBeInTheDocument();
  });

  it("displays selected filters as tags", async () => {
    const nfts = [
      mockNFTToken(0, address, { lastLevel: 0 }),
      mockNFTToken(1, address, { lastLevel: 1 }),
    ];
    nfts[0].token.contract.alias = "Contract A";
    nfts[1].token.contract.alias = "Contract B";
    store.dispatch(assetsActions.updateTokenBalance(nfts));
    store.dispatch(
      tokensActions.addTokens({ tokens: nfts.map(nft => nft.token), network: MAINNET })
    );

    const user = userEvent.setup();
    render(<TestComponent />, { store });

    const filterButton = screen.getByTestId("nft-filter-trigger");
    await user.click(filterButton);

    const option = screen.getAllByTestId("nft-filter-option")[0];
    await user.click(option);

    expect(
      screen.getByTestId(`nft-filter-tag-${nfts[0].token.contract.address}`)
    ).toBeInTheDocument();
  });

  it("calls onChange when filter option is clicked", async () => {
    const nfts = [
      mockNFTToken(0, address, { lastLevel: 0 }),
      mockNFTToken(1, address, { lastLevel: 1 }),
    ];
    nfts[0].token.contract.alias = "Contract A";
    nfts[1].token.contract.alias = "Contract B";
    store.dispatch(assetsActions.updateTokenBalance(nfts));
    store.dispatch(
      tokensActions.addTokens({ tokens: nfts.map(nft => nft.token), network: MAINNET })
    );

    const user = userEvent.setup();
    render(<TestComponent />, { store });

    const filterButton = screen.getByTestId("nft-filter-trigger");
    await user.click(filterButton);

    expect(
      screen.queryByTestId(`nft-filter-tag-${nfts[0].token.contract.address}`)
    ).not.toBeInTheDocument();

    const option = screen.getAllByTestId("nft-filter-option")[0];
    await user.click(option);

    expect(
      screen.getByTestId(`nft-filter-tag-${nfts[0].token.contract.address}`)
    ).toBeInTheDocument();
  });

  it("calls onChange when tag is clicked", async () => {
    const nfts = [
      mockNFTToken(0, address, { lastLevel: 0 }),
      mockNFTToken(1, address, { lastLevel: 1 }),
    ];
    nfts[0].token.contract.alias = "Contract A";
    nfts[1].token.contract.alias = "Contract B";
    store.dispatch(assetsActions.updateTokenBalance(nfts));
    store.dispatch(
      tokensActions.addTokens({ tokens: nfts.map(nft => nft.token), network: MAINNET })
    );

    const user = userEvent.setup();
    render(<TestComponent />, { store });

    const filterButton = screen.getByTestId("nft-filter-trigger");
    await user.click(filterButton);

    const option = screen.getAllByTestId("nft-filter-option")[0];
    await user.click(option);

    const tagButton = screen.getByTestId(`nft-filter-tag-${nfts[0].token.contract.address}`);

    await user.click(tagButton);

    expect(
      screen.queryByTestId(`nft-filter-tag-${nfts[0].token.contract.address}`)
    ).not.toBeInTheDocument();

    await user.click(filterButton);

    const filterOptions = screen.getAllByTestId("nft-filter-option");
    const firstCheckboxOption = filterOptions[0];
    const firstCheckbox = within(firstCheckboxOption).getByRole("checkbox");
    expect(firstCheckbox).not.toBeChecked();
  });

  it("correctly marks options as checked based on selected array", async () => {
    const nfts = [
      mockNFTToken(0, address, { lastLevel: 0 }),
      mockNFTToken(1, address, { lastLevel: 1 }),
    ];
    nfts[0].token.contract.alias = "Contract A";
    nfts[1].token.contract.alias = "Contract B";
    store.dispatch(assetsActions.updateTokenBalance(nfts));
    store.dispatch(
      tokensActions.addTokens({ tokens: nfts.map(nft => nft.token), network: MAINNET })
    );

    const user = userEvent.setup();
    render(<TestComponent />, { store });

    const filterButton = screen.getByTestId("nft-filter-trigger");
    await user.click(filterButton);

    const option = screen.getAllByTestId("nft-filter-option")[0];
    await user.click(option);

    const filterOptions = screen.getAllByTestId("nft-filter-option");

    const firstCheckboxOption = filterOptions[0];
    const firstCheckbox = within(firstCheckboxOption).getByRole("checkbox");
    expect(firstCheckbox).toBeChecked();

    const secondCheckboxOption = filterOptions[1];
    const secondCheckbox = within(secondCheckboxOption).getByRole("checkbox");
    expect(secondCheckbox).not.toBeChecked();
  });
});
