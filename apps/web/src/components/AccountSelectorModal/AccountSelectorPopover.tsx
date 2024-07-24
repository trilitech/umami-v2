import {
  Flex,
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
import { type MouseEvent, type ReactElement } from "react";

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

const accountSelectorPopoverOptions = [
  {
    icon: <SearchIcon />,
    text: "Account Info",
    action: (account: Account, openWith: (content: ReactElement) => Promise<void>) => {
      void openWith(<AccountInfoModal account={account} />);
    },
    isEnabled: () => true,
  },
  {
    icon: <EditIcon />,
    text: "Rename",
    action: (account: Account, openWith: (content: ReactElement) => Promise<void>) => {
      void openWith(<RenameAccountPage account={account} />);
    },
    isEnabled: () => true,
  },
  {
    icon: <TrashIcon />,
    text: "Remove",
    action: (account: Account, openWith: (content: ReactElement) => Promise<void>) => {
      void openWith(
        <RemoveAccountModal account={account as SocialAccount | LedgerAccount | SecretKeyAccount} />
      );
    },
    isEnabled: (account: Account) => account.type !== "mnemonic" && account.type !== "multisig",
  },
  {
    icon: <ExternalLinkIcon />,
    text: "View in TzKT",
    action: (account: Account) => {
      window.open(`https://tzkt.io/${account.address.pkh}`, "_blank");
    },
    isEnabled: () => true,
  },
];

type AccountSelectorPopoverProps = {
  account: Account;
};

export const AccountSelectorPopover = ({ account }: AccountSelectorPopoverProps) => {
  const { openWith } = useDynamicDisclosureContext();

  const handleAction = (
    event: MouseEvent<HTMLDivElement>,
    action: (account: Account, openWith: (content: ReactElement) => Promise<void>) => void
  ) => {
    event.stopPropagation();
    action(account, openWith);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          alignSelf="flex-end"
          color="gray.500"
          background="transparent"
          aria-label="Account actions"
          icon={<ThreeDotsIcon />}
          onClick={event => event.stopPropagation()}
          size="xs"
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent maxWidth="204px">
          <PopoverBody color="gray.400">
            {accountSelectorPopoverOptions.map(
              ({ icon, text, action, isEnabled }, index) =>
                isEnabled(account) && (
                  <Flex
                    key={`${text}-${index}`}
                    alignItems="center"
                    gap="10px"
                    padding="12px 16px"
                    _hover={{
                      background: "gray.100",
                    }}
                    cursor="pointer"
                    onClick={e => handleAction(e, action)}
                    rounded="full"
                  >
                    {icon}
                    <Text color="gray.900" fontWeight="600">
                      {text}
                    </Text>
                  </Flex>
                )
            )}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
