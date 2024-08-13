import { type LinkProps } from "@chakra-ui/react";
import {
  type LedgerAccount,
  type SecretKeyAccount,
  type SocialAccount,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import { useSelectedNetwork } from "@umami/state";
import { MAINNET } from "@umami/tezos";

import { AccountInfoModal } from "./AccountInfoModal";
import { AccountSelectorPopover } from "./AccountSelectorPopover";
import { RemoveAccountModal } from "./RemoveAccountModal";
import { RenameAccountPage } from "./RenameAccountModal";
import { act, dynamicModalContextMock, render, screen, userEvent, waitFor } from "../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useSelectedNetwork: jest.fn(),
}));

const mockAccount = mockImplicitAccount(0, "social");
const mockLinkHandler = jest.fn();

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  Link: (props: LinkProps) => {
    mockLinkHandler(props);
    return <div>{props.children}</div>;
  },
}));

describe("AccountSelectorPopover", () => {
  beforeEach(() => {
    jest.mocked(useSelectedNetwork).mockReturnValue(MAINNET);
  });

  it("renders correctly with initial values", () => {
    render(<AccountSelectorPopover account={mockAccount} />);

    expect(screen.getByLabelText("Account actions")).toBeVisible();
  });

  it("displays popover content when trigger is clicked", async () => {
    render(<AccountSelectorPopover account={mockAccount} />);
    const user = userEvent.setup();

    await act(() => user.click(screen.getByLabelText("Account actions")));

    await waitFor(() => expect(screen.getByText("Account Info")).toBeVisible());
    expect(screen.getByText("Rename")).toBeVisible();
    expect(screen.getByText("Remove")).toBeVisible();
    expect(screen.getByText("View in TzKT")).toBeVisible();
  });

  it("opens AccountInfoModal when 'Account Info' button is clicked", async () => {
    const { openWith } = dynamicModalContextMock;
    const user = userEvent.setup();

    render(<AccountSelectorPopover account={mockAccount} />);

    await act(async () => {
      await user.click(screen.getByLabelText("Account actions"));
      await user.click(screen.getByText("Account Info"));
    });

    expect(openWith).toHaveBeenCalledWith(<AccountInfoModal account={mockAccount} />);
  });

  it("opens RenameAccountPage when 'Rename' button is clicked", async () => {
    const { openWith } = dynamicModalContextMock;
    const user = userEvent.setup();

    render(<AccountSelectorPopover account={mockAccount} />);

    await act(async () => {
      await user.click(screen.getByLabelText("Account actions"));
      await user.click(screen.getByText("Rename"));
    });

    expect(openWith).toHaveBeenCalledWith(<RenameAccountPage account={mockAccount} />);
  });

  it("opens RemoveAccountModal when 'Remove' button is clicked", async () => {
    const { openWith } = dynamicModalContextMock;
    const user = userEvent.setup();

    render(<AccountSelectorPopover account={mockAccount} />);

    await act(async () => {
      await user.click(screen.getByLabelText("Account actions"));
      await user.click(screen.getByText("Remove"));
    });

    expect(openWith).toHaveBeenCalledWith(
      <RemoveAccountModal
        account={mockAccount as SocialAccount | LedgerAccount | SecretKeyAccount}
      />
    );
  });

  it("disables 'Remove' button for mnemonic account", async () => {
    const mnemonicAccount = mockMnemonicAccount(0);
    const user = userEvent.setup();

    render(<AccountSelectorPopover account={mnemonicAccount} />);

    await act(() => user.click(screen.getByLabelText("Account actions")));
    await waitFor(() => expect(screen.queryByText("Remove")).not.toBeInTheDocument());
  });

  it("disables 'Remove' button for multisig account", async () => {
    const multisigAccount = mockMultisigAccount(0);
    const user = userEvent.setup();

    render(<AccountSelectorPopover account={multisigAccount} />);

    await act(() => user.click(screen.getByLabelText("Account actions")));
    await waitFor(() => expect(screen.queryByText("Remove")).not.toBeInTheDocument());
  });

  it("opens correct URL in new tab when 'View in TzKT' button is clicked", async () => {
    const user = userEvent.setup();

    render(<AccountSelectorPopover account={mockAccount} />);

    await act(async () => {
      await user.click(screen.getByLabelText("Account actions"));
      await user.click(screen.getByText("View in TzKT"));
    });

    expect(mockLinkHandler).toHaveBeenCalledWith(
      expect.objectContaining({ href: `https://tzkt.io/${mockAccount.address.pkh}` })
    );
  });
});
