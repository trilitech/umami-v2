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
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { type Address, parsePkh } from "@umami/tezos";
import { type TzktAlias } from "@umami/tzkt";
import { useRef, useState } from "react";

import { LeftIcon, RightIcon } from "./AddressPillIcon";
import { type AddressPillMode } from "./AddressPillMode";
import { AddressPillText } from "./AddressPillText";
import { useAddressKind } from "./useAddressKind";
import colors from "../../style/colors";

export const AddressPill = ({
  address: rawAddress,
  mode = { type: "default" },
  ...rest
}: { address: Address | TzktAlias; mode?: AddressPillMode } & BoxProps) => {
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
    handler: () => setMouseHover(false),
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
        onMouseEnter={() => setMouseHover(true)}
        onMouseLeave={() => setMouseHover(false)}
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
                alias={isAlias && rawAddress.alias ? rawAddress.alias : undefined}
                data-testid="address-pill-text"
                marginX="4px"
                showPkh={!showIcons}
                size="sm"
              />
              <Box display="none" data-testid="address-pill-raw-address">
                {address.pkh}
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
            addressPillMode={mode}
            data-testid="address-pill-right-icon"
          />
        )}
      </Flex>
    </Box>
  );
};
