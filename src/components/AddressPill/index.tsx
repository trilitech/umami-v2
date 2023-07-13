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
    onOpen();
    await navigator.clipboard.writeText(address.pkh);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Needed to handle styling after contact modal opens
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref,
    handler: () => {
      setMouseHover(false);
    },
  });

  const bgColorHoverColor = mouseHover ? colors.gray[450] : colors.gray[500];
  const bgColor = isOpen ? `${colors.green} !important` : bgColorHoverColor;

  const iconHoverColor = mouseHover ? colors.gray[400] : colors.gray[450];
  const iconColor = isOpen ? colors.gray[300] : iconHoverColor;

  const textHoverColor = mouseHover ? colors.gray[200] : colors.gray[300];
  const textColor = isOpen ? "white" : textHoverColor;

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
        {showIcons && <LeftIcon addressKind={addressKind} ml={2} stroke={iconColor} />}

        <Popover
          isOpen={isOpen}
          onOpen={async () => {
            await onClickAddress();
          }}
          autoFocus={false}
        >
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
