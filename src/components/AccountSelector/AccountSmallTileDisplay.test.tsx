import { render, screen } from "../../mocks/testUtils";
import { AccountType } from "../../types/Account";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

test("<AccountTileDisplay /> renders the right icon given an account type", () => {
  render(
    <AccountSmallTileDisplay
      pkh="foo"
      label="bar"
      kind={AccountType.MNEMONIC}
      balance={undefined}
    />
  );
  expect(screen.getByTestId("identicon")).toBeInTheDocument();

  render(
    <AccountSmallTileDisplay pkh="foo" label="bar" kind={AccountType.LEDGER} balance={undefined} />
  );
  expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();

  render(
    <AccountSmallTileDisplay pkh="foo" label="bar" kind={AccountType.SOCIAL} balance={undefined} />
  );
  expect(screen.getByTestId("social-icon")).toBeInTheDocument();

  render(<AccountSmallTileDisplay pkh="foo" label="bar" kind="baker" balance={undefined} />);
  expect(screen.getByTestId("baker-icon")).toBeInTheDocument();

  render(<AccountSmallTileDisplay pkh="foo" label="bar" kind="contact" balance={undefined} />);
  expect(screen.getByTestId("contact-icon")).toBeInTheDocument();
});
