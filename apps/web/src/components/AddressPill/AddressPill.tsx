import {
  Box,
  Center,
  Flex,
  type FlexProps,
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
import { memo } from "react";

import { LeftIcon } from "./LeftIcon";
import { RightIcon } from "./RightIcon";
import { useColor } from "../../styles/useColor";

// TODO: update colors when design's finalized
export const AddressPill = memo(
  ({
    address: rawAddress,
    mode = "default",
    onRemove,
    ...props
  }: {
    address: Address | TzktAlias;
    mode?: AddressPillMode;
    onRemove?: () => void;
  } & FlexProps) => {
    const color = useColor();

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

    let bgColor, leftIconColor, rightIconColor, textColor;

    /* istanbul ignore if */
    if (isPopoverOpen) {
      bgColor = color("green");
      leftIconColor = color("white");
      rightIconColor = color("white");
      textColor = color("white");
    } else if (isMouseHover) {
      bgColor = color("gray.450");
      leftIconColor = color("gray.400");
      rightIconColor = color("gray.400");
      textColor = color("gray.700");
    } else {
      bgColor = color("gray.100");
      leftIconColor = color("gray.400");
      rightIconColor = color("gray.500");
      textColor = color("gray.700");
    }

    return (
      <Flex
        ref={elementRef}
        justifyContent="space-around"
        width="fit-content"
        background={bgColor}
        borderRadius="full"
        data-testid="address-pill"
        onMouseEnter={() => setIsMouseHover(true)}
        onMouseLeave={() => setIsMouseHover(false)}
        paddingY="3px"
        {...props}
      >
        <Popover autoFocus={false} isOpen={isPopoverOpen} onOpen={onClick}>
          <PopoverTrigger>
            <Center
              gap="4px"
              width="fit-content"
              _focus={{ boxShadow: "none" }}
              cursor="pointer"
              data-testid="address-pill-copy-button"
              marginX="10px"
              onClick={e => e.stopPropagation()}
            >
              {showIcons && (
                <LeftIcon
                  color={leftIconColor}
                  addressKind={addressKind}
                  data-testid="address-pill-left-icon"
                  style={{ display: "inline-block" }}
                />
              )}
              <AddressPillText
                display="inline-block"
                color={textColor}
                fontWeight="400"
                addressKind={addressKind}
                alias={addressAlias}
                data-testid="address-pill-text"
                showPkh={!showIcons}
                size="sm"
              />
              <Box display="none" data-testid="address-pill-raw-address">
                {addressKind.pkh}
              </Box>
            </Center>
          </PopoverTrigger>
          <PopoverContent maxWidth="max-content" background="white">
            <PopoverArrow background="white !important" />
            <PopoverBody>
              <Text color={color("black")} size="sm">
                Copied!
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {showIcons && (
          <Center>
            <RightIcon
              marginRight="10px"
              marginLeft="-4px"
              color={rightIconColor}
              cursor="pointer"
              addressKind={addressKind}
              data-testid="address-pill-right-icon"
            />
          </Center>
        )}
      </Flex>
    );
  }
);
