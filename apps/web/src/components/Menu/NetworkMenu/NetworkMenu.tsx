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
import Hotjar from "@hotjar/browser";
import { useDynamicDrawerContext } from "@umami/components";
import {
  networksActions,
  useAppDispatch,
  useAvailableNetworks,
  useSelectNetwork,
  useSelectedNetwork,
} from "@umami/state";
import { type Network, isDefault } from "@umami/tezos";

import { EditNetworkMenu } from "./EditNetworkMenu";
import { EditIcon, ThreeDotsIcon, TrashIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ActionsDropdown } from "../../ActionsDropdown";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

type NetworkMenuItemProps = {
  network: Network;
  isDefault: boolean;
};

const NetworkMenuItem = ({ network, isDefault }: NetworkMenuItemProps) => {
  const color = useColor();
  const { openWith } = useDynamicDrawerContext();
  const dispatch = useAppDispatch();

  const removeNetwork = () => {
    dispatch(networksActions.removeNetwork(network));
  };

  const actions = (
    <Box>
      <Button
        data-testid="edit-network"
        onClick={e => {
          e.stopPropagation();
          return openWith(<EditNetworkMenu network={network} />);
        }}
        variant="dropdownOption"
      >
        <EditIcon />
        <Text color={color("900")} fontWeight="600">
          Edit
        </Text>
      </Button>
      <Button data-testid="remove-network" onClick={removeNetwork} variant="dropdownOption">
        <TrashIcon />
        <Text color={color("900")} fontWeight="600">
          Remove
        </Text>
      </Button>
    </Box>
  );

  return (
    <Flex justifyContent="space-between" width="full" data-testid={`network-${network.name}`}>
      <Radio width="full" spacing="20px" value={network.name}>
        <Box>
          <Text color={color("900")} fontWeight="600" size="lg">
            {network.name}
          </Text>
          <Text size="sm">{network.rpcUrl}</Text>
        </Box>
      </Radio>
      {!isDefault && (
        <ActionsDropdown actions={actions}>
          <IconButton
            alignSelf="flex-end"
            color={color("500")}
            aria-label="Network actions"
            data-testid="popover-menu"
            icon={<ThreeDotsIcon />}
            onClick={event => event.stopPropagation()}
          />
        </ActionsDropdown>
      )}
    </Flex>
  );
};

export const NetworkMenu = () => {
  const selectNetwork = useSelectNetwork();
  const currentNetwork = useSelectedNetwork();
  const { openWith } = useDynamicDrawerContext();
  const availableNetworks = useAvailableNetworks();

  Hotjar.stateChange("menu/network");

  return (
    <DrawerContentWrapper
      actions={
        <Button
          width="fit-content"
          marginTop="18px"
          padding="0 24px"
          onClick={() => openWith(<EditNetworkMenu />)}
          variant="primary"
        >
          Add new
        </Button>
      }
      title="Network"
    >
      <RadioGroup onChange={selectNetwork} value={currentNetwork.name}>
        <VStack
          alignItems="flex-start"
          gap="24px"
          marginTop="24px"
          divider={<Divider />}
          spacing="0"
        >
          {availableNetworks.map(network => (
            <NetworkMenuItem key={network.name} isDefault={isDefault(network)} network={network} />
          ))}
        </VStack>
      </RadioGroup>
    </DrawerContentWrapper>
  );
};
