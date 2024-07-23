import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DynamicDisclosureContext } from "@umami/components";
import {
  networksActions,
  useAppDispatch,
  useAvailableNetworks,
  useSelectNetwork,
  useSelectedNetwork,
} from "@umami/state";
import { type Network, isDefault } from "@umami/tezos";
import { Fragment, useContext } from "react";

import { UpsertNetworkModal } from "./UpsertNetworkModal";
import { PenIcon, PlusIcon, TrashIcon } from "../../../assets/icons";
import { PopoverMenu } from "../../../components/PopoverMenu";
import colors from "../../../style/colors";

export const NetworkSettingsDrawerBody = () => {
  const { openWith } = useContext(DynamicDisclosureContext);
  const network = useSelectedNetwork();
  const selectNetwork = useSelectNetwork();
  const availableNetworks = useAvailableNetworks();
  const dispatch = useAppDispatch();

  const removeNetwork = (network: Network) => {
    dispatch(networksActions.removeNetwork(network));
  };
  return (
    <Flex flexDirection="column">
      <Center justifyContent="space-between">
        <Heading>Network Settings</Heading>
        <Button
          paddingRight="0"
          onClick={() => openWith(<UpsertNetworkModal />)}
          variant="CTAWithIcon"
        >
          <Text size="sm">Add Network</Text>
          <PlusIcon width="18px" height="18px" marginLeft="4px" stroke="currentcolor" />
        </Button>
      </Center>
      <RadioGroup marginTop="60px" onChange={selectNetwork} value={network.name}>
        <Stack>
          {availableNetworks.map(network => (
            <Fragment key={network.name}>
              <Divider borderColor={colors.gray[700]} />
              <Flex justifyContent="space-between" data-testid={`network-${network.name}`}>
                <Radio height="100px" value={network.name} variant="primary">
                  <Flex flexDirection="column" marginLeft="16px">
                    <Heading marginBottom="4px" size="sm">
                      {network.name}
                    </Heading>
                    <Text color={colors.gray[400]}>{network.rpcUrl}</Text>
                  </Flex>
                </Radio>
                {!isDefault(network) && (
                  <Center data-testid="popover-menu">
                    <PopoverMenu>
                      <Button
                        onClick={() => openWith(<UpsertNetworkModal network={network} />)}
                        variant="popover"
                      >
                        <Text marginRight="4px">Edit</Text>
                        <PenIcon stroke="inherit" />
                      </Button>
                      <Divider marginTop="4px" />
                      <Button onClick={() => removeNetwork(network)} variant="popover">
                        <Text marginRight="4px">Remove</Text>
                        <TrashIcon stroke="inherit" />
                      </Button>
                    </PopoverMenu>
                  </Center>
                )}
              </Flex>
            </Fragment>
          ))}
        </Stack>
      </RadioGroup>
    </Flex>
  );
};
