import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";
import { useSelectNetwork, useSelectedNetwork } from "@umami/state";
import { type PropsWithChildren } from "react";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { EditIcon, ThreeDotsIcon, TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ActionsDropdown } from "../ActionsDropdown";

type NetworkMenuItemProps = {
  value: string;
  url: string;
};

const NetworkMenuItem = ({ value, url, children }: PropsWithChildren<NetworkMenuItemProps>) => {
  const color = useColor();
  const { openWith } = useDynamicDrawerContext();

  const actions = (
    <Box>
      <Button
        onClick={e => {
          e.stopPropagation();
          // return openWith(<AccountInfoModal account={account} />);
        }}
        variant="dropdownOption"
      >
        <EditIcon />
        <Text color={color("900")} fontWeight="600">
          Edit
        </Text>
      </Button>
      <Button
        onClick={e => {
          e.stopPropagation();
          // return openWith(<AccountInfoModal account={account} />);
        }}
        variant="dropdownOption"
      >
        <TrashIcon />
        <Text color={color("900")} fontWeight="600">
          Remove
        </Text>
      </Button>
    </Box>
  );

  return (
    <Flex justifyContent="space-between" width="full">
      <Radio width="full" spacing="20px" value={value}>
        <Box>
          <Text color={color("900")} fontWeight="600" size="lg">
            {children}
          </Text>
          <Text size="sm">{url}</Text>
        </Box>
      </Radio>
      <ActionsDropdown actions={actions}>
        <IconButton
          alignSelf="flex-end"
          color={color("500")}
          aria-label="Network actions"
          icon={<ThreeDotsIcon />}
          onClick={event => event.stopPropagation()}
        />
      </ActionsDropdown>
    </Flex>
  );
};

export const NetworkMenu = () => {
  const selectNetwork = useSelectNetwork();
  const currentNetwork = useSelectedNetwork();

  return (
    <DrawerContentWrapper title="Network">
      <Button width="fit-content" marginTop="18px" padding="0 24px" variant="secondary">
        Add New
      </Button>
      <Divider marginTop={{ base: "36px", lg: "40px" }} />
      <RadioGroup onChange={selectNetwork} value={currentNetwork.name}>
        <VStack
          alignItems="flex-start"
          gap="24px"
          marginTop="24px"
          divider={<Divider />}
          spacing="0"
        >
          <NetworkMenuItem url="https://mainnet.api.tez.ie" value="mainnet">
            Mainnet
          </NetworkMenuItem>
          <NetworkMenuItem url="https://tezos-ghostnet-node-1.papers.tech" value="ghostnet">
            Ghostnet
          </NetworkMenuItem>
        </VStack>
      </RadioGroup>
    </DrawerContentWrapper>
  );
};
