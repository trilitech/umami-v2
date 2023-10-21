import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useDisclosure,
  Button,
  useOutsideClick,
  BoxProps,
} from "@chakra-ui/react";

import { Flex, Text, Box } from "@chakra-ui/react";
import { Address } from "../../types/Address";
import colors from "../../style/colors";
import { useRef, useState } from "react";
import useAddressKind from "./useAddressKind";
import { LeftIcon, RightIcon } from "./AddressPillIcon";
import AddressPillText from "./AddressPillText";

export type AddressPillMode =
  | { type: "default" }
  | { type: "removable"; onRemove: () => void }
  | { type: "no_icons" };

const AddressPill: React.FC<{ address: Address; mode?: AddressPillMode } & BoxProps> = ({
  address,
  mode = { type: "default" },
  ...rest
}) => {
  const addressKind = useAddressKind(address);
  const showIcons = mode.type !== "no_icons";

  const { onOpen, onClose, isOpen } = useDisclosure();
  const [mouseHover, setMouseHover] = useState(false);
  const onClickAddress = async () => {
    await navigator.clipboard.writeText(address.pkh);
    onOpen();
    setTimeout(onClose, 1000);
  };

  // Needed to handle styling after contact modal opens
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref,
    handler: () => {
      setMouseHover(false);
    },
  });

  let bgColor, iconColor, textColor;
  if (isOpen) {
    bgColor = colors.green;
    iconColor = colors.gray[300];
    textColor = "white";
  } else if (mouseHover) {
    bgColor = colors.gray[450];
    iconColor = colors.gray[400];
    textColor = colors.gray[200];
  } else {
    bgColor = colors.gray[500];
    iconColor = colors.gray[450];
    textColor = colors.gray[300];
  }

  return (
    <Box data-testid="address-pill" maxW="max-content" {...rest}>
      <Flex
        ref={ref}
        alignItems="center"
        bg={bgColor}
        borderRadius="full"
        onMouseEnter={() => {
          setMouseHover(true);
        }}
        onMouseLeave={() => {
          setMouseHover(false);
        }}
        paddingX="4px"
      >
        {showIcons && (
          <LeftIcon
            data-testid="address-pill-left-icon"
            addressKind={addressKind}
            marginLeft="4px"
            stroke={iconColor}
          />
        )}

        <Popover isOpen={isOpen} onOpen={onClickAddress} autoFocus={false}>
          <PopoverTrigger>
            <Button variant="unstyled" h="24px" _focus={{ boxShadow: "none" }}>
              <AddressPillText
                data-testid="address-pill-text"
                addressKind={addressKind}
                showPkh={!showIcons}
                cursor="pointer"
                marginX="4px"
                color={textColor}
                size="sm"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent bg="white" maxW="max-content">
            <PopoverArrow bg="white" />
            <PopoverBody>
              <Text size="sm" color="black">
                Copied!
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {showIcons && (
          <RightIcon
            data-testid="address-pill-right-icon"
            addressKind={addressKind}
            addressPillMode={mode}
            cursor="pointer"
            stroke={textColor}
            marginRight="4px"
          />
        )}
      </Flex>
    </Box>
  );
};

export default AddressPill;
