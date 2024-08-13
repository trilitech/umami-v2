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
import {
  networksActions,
  useAppDispatch,
  useAvailableNetworks,
  useSelectNetwork,
  useSelectedNetwork,
} from "@umami/state";
import { type Network, isDefault } from "@umami/tezos";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { EditNetworkMenu } from "./EditNetworkMenu";
import { EditIcon, ThreeDotsIcon, TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ActionsDropdown } from "../ActionsDropdown";

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
      <Button onClick={removeNetwork} variant="dropdownOption">
        <TrashIcon />
        <Text color={color("900")} fontWeight="600">
          Remove
        </Text>
      </Button>
    </Box>
  );

  return (
    <Flex justifyContent="space-between" width="full">
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

  return (
    <DrawerContentWrapper title="Network">
      <Button
        width="fit-content"
        marginTop="18px"
        padding="0 24px"
        onClick={() => openWith(<EditNetworkMenu />)}
        variant="secondary"
      >
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
          {availableNetworks.map(network => (
            <NetworkMenuItem key={network.name} isDefault={isDefault(network)} network={network} />
          ))}
        </VStack>
      </RadioGroup>
    </DrawerContentWrapper>
  );
};
