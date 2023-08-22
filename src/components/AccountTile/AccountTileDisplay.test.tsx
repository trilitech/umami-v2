import { render, screen } from "../../mocks/testUtils";
import { AccountType } from "../../types/Account";
import { AccountTileDisplay } from "./AccountTileDisplay";

test("<AccountTileDisplay /> renders the right icon given an account type", () => {
  render(<AccountTileDisplay address="foo" label="bar" balance="3" kind={AccountType.MNEMONIC} />);
  expect(screen.getByTestId("identicon")).toBeInTheDocument();

  render(<AccountTileDisplay address="foo" label="bar" balance="3" kind={AccountType.LEDGER} />);
  expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();

  render(<AccountTileDisplay address="foo" label="bar" balance="3" kind={AccountType.SOCIAL} />);
  expect(screen.getByTestId("social-icon")).toBeInTheDocument();

  render(<AccountTileDisplay address="foo" label="bar" balance="3" kind={AccountType.MULTISIG} />);
  expect(screen.getByTestId("key-icon")).toBeInTheDocument();
});
