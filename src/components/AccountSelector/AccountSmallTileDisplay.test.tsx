import { render, screen } from "../../mocks/testUtils";
import { AccountType } from "../../types/Account";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

test("<AccountTileDisplay /> renders the right icon given an account type", () => {
  render(<AccountSmallTileDisplay pkh="foo" label="bar" kind={AccountType.MNEMONIC} />);
  expect(screen.getByTestId("identicon")).toBeInTheDocument();

  render(<AccountSmallTileDisplay pkh="foo" label="bar" kind={AccountType.LEDGER} />);
  expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();

  render(<AccountSmallTileDisplay pkh="foo" label="bar" kind={AccountType.SOCIAL} />);
  expect(screen.getByTestId("social-icon")).toBeInTheDocument();

  render(<AccountSmallTileDisplay pkh="foo" label="bar" kind="baker" />);
  expect(screen.getByTestId("baker-icon")).toBeInTheDocument();

  render(<AccountSmallTileDisplay pkh="foo" label="bar" kind="contact" />);
  expect(screen.getByTestId("contact-icon")).toBeInTheDocument();
});
