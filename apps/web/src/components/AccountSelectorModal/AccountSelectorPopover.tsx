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
import { type Account } from "@umami/core";
import { type MouseEvent, type ReactElement } from "react";

import { RenameAccountPage } from "./RenameAccountPage";
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
  },
  {
    icon: <EditIcon />,
    text: "Rename",
    action: (account: Account) => <RenameAccountPage account={account} />,
  },
  {
    icon: <TrashIcon />,
    text: "Remove",
  },
  {
    icon: <ExternalLinkIcon />,
    text: "View in TzKT",
  },
];

type AccountSelectorPopoverProps = {
  account: Account;
};

export const AccountSelectorPopover = ({ account }: AccountSelectorPopoverProps) => {
  const { openWith } = useDynamicDisclosureContext();

  const handleAction = async (
    event: MouseEvent<HTMLDivElement>,
    action?: (props: any) => ReactElement
  ) => {
    event.stopPropagation();

    if (action) {
      await openWith(action(account));
    }
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
            {accountSelectorPopoverOptions.map(({ icon, text, action }, index) => (
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
            ))}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
