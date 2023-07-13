import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useDisclosure,
  Button,
  useOutsideClick,
} from "@chakra-ui/react";

import { Flex, Text, Box } from "@chakra-ui/react";
import { Address } from "../../types/Address";
import colors from "../../style/colors";
import { useRef, useState } from "react";
import useAddressKind from "./useAddressKind";
import { LeftIcon, RightIcon } from "./AddressPillIcon";
import AddressPillText from "./AddressPillText";

type AddressPillMode = "default" | "removable" | "no_icons";

const AddressPill: React.FC<{ address: Address; mode?: AddressPillMode }> = ({
  address,
  mode = "default",
}) => {
  const addressKind = useAddressKind(address);
  const showIcons = mode !== "no_icons";
  const isRemovable = mode === "removable";

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
    <Box maxW="max-content">
      <Flex
        ref={ref}
        alignItems="center"
        bg={bgColor}
        borderRadius="100px"
        onMouseEnter={() => {
          setMouseHover(true);
        }}
        onMouseLeave={() => {
          setMouseHover(false);
        }}
        paddingX={1}
      >
        {showIcons && (
          <LeftIcon
            data-testid="address-pill-left-icon"
            addressKind={addressKind}
            ml={2}
            stroke={iconColor}
          />
        )}

        <Popover isOpen={isOpen} onOpen={onClickAddress} autoFocus={false}>
          <PopoverTrigger>
            <Button variant="unstyled" h={7}>
              <AddressPillText
                addressKind={addressKind}
                showPkh={!showIcons}
                cursor="pointer"
                marginX={2}
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
            isRemove={isRemovable}
            cursor="pointer"
            stroke={textColor}
            mr={2}
          />
        )}
      </Flex>
    </Box>
  );
};

export default AddressPill;
