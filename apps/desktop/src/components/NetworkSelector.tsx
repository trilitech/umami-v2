import {
  Button,
  Divider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { Fragment } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "../assets/icons";
import colors from "../style/colors";
import {
  useAvailableNetworks,
  useSelectNetwork,
  useSelectedNetwork,
} from "../utils/hooks/networkHooks";

export const NetworkSelector = () => {
  const currentNetwork = useSelectedNetwork();
  const availableNetworks = useAvailableNetworks();
  const selectNetwork = useSelectNetwork();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-end">
      <PopoverTrigger>
        <Button
          marginTop="4px"
          color={colors.green}
          data-testid="network-selector"
          variant="unstyled"
        >
          {capitalize(currentNetwork.name)}

          {isOpen ? (
            <ChevronUpIcon marginTop="-2px" stroke="currentcolor" />
          ) : (
            <ChevronDownIcon marginTop="-2px" stroke="currentcolor" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="100px"
        marginTop="-10px"
        background={colors.gray[700]}
        border="1px solid"
        borderColor={colors.gray[500]}
      >
        <PopoverBody padding="4px 12px">
          <Flex flexDirection="column">
            {availableNetworks.map((network, index) => (
              <Fragment key={network.name}>
                <Button
                  height="34px"
                  color={network.name === currentNetwork.name ? colors.green : colors.gray[300]}
                  fontSize="14px"
                  fontWeight={400}
                  textAlign="right"
                  _hover={{ color: colors.greenL }}
                  onClick={() => {
                    selectNetwork(network.name);
                    onClose();
                  }}
                  variant="unstyled"
                >
                  {capitalize(network.name)}
                </Button>
                {index < availableNetworks.length - 1 && <Divider />}
              </Fragment>
            ))}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
