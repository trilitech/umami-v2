import { Box, Button, IconButton, Link, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import {
  type Account,
  type LedgerAccount,
  type SecretKeyAccount,
  type SocialAccount,
} from "@umami/core";
import { useSelectedNetwork } from "@umami/state";

import { AccountInfoModal } from "./AccountInfoModal";
import { RemoveAccountModal } from "./RemoveAccountModal";
import { RenameAccountPage } from "./RenameAccountModal";
import {
  EditIcon,
  ExternalLinkIcon,
  SearchIcon,
  ThreeDotsIcon,
  TrashIcon,
} from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ActionsDropdown } from "../ActionsDropdown";

type AccountSelectorPopoverProps = {
  account: Account;
};

export const AccountSelectorPopover = ({ account }: AccountSelectorPopoverProps) => {
  const { openWith } = useDynamicModalContext();
  const color = useColor();
  const network = useSelectedNetwork();

  const actions = (
    <Box>
      <Button
        onClick={e => {
          e.stopPropagation();
          return openWith(<AccountInfoModal account={account} />);
        }}
        variant="dropdownOption"
      >
        <SearchIcon />
        <Text color={color("900")} fontWeight="600">
          Account Info
        </Text>
      </Button>
      <Button
        onClick={e => {
          e.stopPropagation();
          return openWith(<RenameAccountPage account={account} />);
        }}
        variant="dropdownOption"
      >
        <EditIcon />
        <Text color={color("900")} fontWeight="600">
          Rename
        </Text>
      </Button>
      {account.type !== "mnemonic" && account.type !== "multisig" && (
        <Button
          onClick={e => {
            e.stopPropagation();
            return openWith(
              <RemoveAccountModal
                account={account as SocialAccount | LedgerAccount | SecretKeyAccount}
              />
            );
          }}
          variant="dropdownOption"
        >
          <TrashIcon />
          <Text color={color("900")} fontWeight="600">
            Remove
          </Text>
        </Button>
      )}
      <Link
        color={color("400")}
        href={`${network.tzktExplorerUrl}/${account.address.pkh}`}
        isExternal
        onClick={e => e.stopPropagation()}
        variant="dropdownOption"
      >
        <ExternalLinkIcon />
        <Text color={color("900")} fontWeight="600" size="lg">
          View in TzKT
        </Text>
      </Link>
    </Box>
  );

  return (
    <ActionsDropdown actions={actions}>
      <IconButton
        alignSelf="flex-end"
        color={color("500")}
        background="transparent"
        aria-label="Account actions"
        icon={<ThreeDotsIcon />}
        onClick={event => event.stopPropagation()}
        size="xs"
      />
    </ActionsDropdown>
  );
};
