import {
  Box,
  BoxProps,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

import { LeftIcon, RightIcon } from "./AddressPillIcon";
import { AddressPillText } from "./AddressPillText";
import { useAddressKind } from "./useAddressKind";
import colors from "../../style/colors";
import { Address, TzktAlias, parsePkh } from "../../types/Address";

export type AddressPillMode =
  | { type: "default" }
  | { type: "removable"; onRemove: () => void }
  | { type: "no_icons" };

export const AddressPill: React.FC<
  { address: Address | TzktAlias; mode?: AddressPillMode } & BoxProps
> = ({ address: rawAddress, mode = { type: "default" }, ...rest }) => {
  const isAlias = !("pkh" in rawAddress && "type" in rawAddress);
  const address = isAlias ? parsePkh(rawAddress.address) : rawAddress;
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
    <Box maxWidth="max-content" data-testid="address-pill" {...rest}>
      <Flex
        ref={ref}
        alignItems="center"
        background={bgColor}
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
            marginLeft="4px"
            stroke={iconColor}
            addressKind={addressKind}
            data-testid="address-pill-left-icon"
          />
        )}

        <Popover autoFocus={false} isOpen={isOpen} onOpen={onClickAddress}>
          <PopoverTrigger>
            <Button height="24px" _focus={{ boxShadow: "none" }} variant="unstyled">
              <AddressPillText
                color={textColor}
                cursor="pointer"
                addressKind={addressKind}
                alias={isAlias && rawAddress.alias ? rawAddress.alias : undefined}
                data-testid="address-pill-text"
                marginX="4px"
                showPkh={!showIcons}
                size="sm"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent maxWidth="max-content" background="white">
            <PopoverArrow background="white" />
            <PopoverBody>
              <Text color="black" size="sm">
                Copied!
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {showIcons && (
          <RightIcon
            marginRight="4px"
            stroke={colors.gray[300]}
            cursor="pointer"
            addressKind={addressKind}
            addressPillMode={mode}
            data-testid="address-pill-right-icon"
          />
        )}
      </Flex>
    </Box>
  );
};
