import {
  Box,
  Button,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useDynamicDisclosureContext } from "@umami/components";
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

type AccountSelectorPopoverProps = {
  account: Account;
};

export const AccountSelectorPopover = ({ account }: AccountSelectorPopoverProps) => {
  const { openWith } = useDynamicDisclosureContext();
  const color = useColor();
  const network = useSelectedNetwork();

  return (
    <Popover variant="dropdown">
      <PopoverTrigger>
        <IconButton
          alignSelf="flex-end"
          color={color("500")}
          background="transparent"
          aria-label="Account actions"
          icon={<ThreeDotsIcon />}
          onClick={event => event.stopPropagation()}
          size="xs"
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent maxWidth="204px">
          <PopoverBody color={color("400")}>
            <Box>
              <Button
                onClick={async e => {
                  e.stopPropagation();
                  await openWith(<AccountInfoModal account={account} />);
                }}
                variant="dropdownOption"
              >
                <SearchIcon />
                <Text color={color("900")} fontWeight="600">
                  Account Info
                </Text>
              </Button>
              <Button
                onClick={async e => {
                  e.stopPropagation();
                  await openWith(<RenameAccountPage account={account} />);
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
                  onClick={async e => {
                    e.stopPropagation();
                    await openWith(
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
              <Button
                onClick={e => {
                  e.stopPropagation();

                  const url = `${network.tzktExplorerUrl}/${account.address.pkh}`;
                  window.open(url, "_blank");
                }}
                variant="dropdownOption"
              >
                <ExternalLinkIcon />
                <Text color={color("900")} fontWeight="600">
                  View in TzKT
                </Text>
              </Button>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
