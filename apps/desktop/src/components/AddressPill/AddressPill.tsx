import {
  Box,
  type BoxProps,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { type AddressPillMode, AddressPillText, useAddressPill } from "@umami/components";
import { type Address } from "@umami/tezos";
import { type TzktAlias } from "@umami/tzkt";

import { LeftIcon } from "./LeftIcon";
import { RightIcon } from "./RightIcon";
import colors from "../../style/colors";

export const AddressPill = ({
  address: rawAddress,
  mode = "default",
  onRemove,
  ...props
}: {
  address: Address | TzktAlias;
  mode?: AddressPillMode;
  onRemove?: () => void;
} & BoxProps) => {
  const {
    isPopoverOpen,
    showIcons,
    addressKind,
    addressAlias,
    onClick,
    elementRef,
    isMouseHover,
    setIsMouseHover,
  } = useAddressPill({ mode, rawAddress });

  let bgColor, iconColor, textColor;

  if (isPopoverOpen) {
    bgColor = colors.green;
    iconColor = colors.gray[300];
    textColor = "white";
  } else if (isMouseHover) {
    bgColor = colors.gray[450];
    iconColor = colors.gray[400];
    textColor = colors.gray[200];
  } else {
    bgColor = colors.gray[500];
    iconColor = colors.gray[450];
    textColor = colors.gray[300];
  }

  return (
    <Box maxWidth="max-content" data-testid="address-pill" {...props}>
      <Flex
        ref={elementRef}
        alignItems="center"
        background={bgColor}
        borderRadius="full"
        onMouseEnter={() => setIsMouseHover(true)}
        onMouseLeave={() => setIsMouseHover(false)}
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

        <Popover autoFocus={false} isOpen={isPopoverOpen} onOpen={onClick}>
          <PopoverTrigger>
            <Button
              height="24px"
              _focus={{ boxShadow: "none" }}
              onClick={e => e.stopPropagation()}
              variant="unstyled"
            >
              <AddressPillText
                color={textColor}
                cursor="pointer"
                addressKind={addressKind}
                alias={addressAlias}
                data-testid="address-pill-text"
                marginX="4px"
                showPkh={!showIcons}
                size="sm"
              />
              <Box display="none" data-testid="address-pill-raw-address">
                {addressKind.pkh}
              </Box>
            </Button>
          </PopoverTrigger>
          <PopoverContent maxWidth="max-content" background="white">
            <PopoverArrow background="white !important" />
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
            data-testid="address-pill-right-icon"
            onRemove={onRemove}
          />
        )}
      </Flex>
    </Box>
  );
};
