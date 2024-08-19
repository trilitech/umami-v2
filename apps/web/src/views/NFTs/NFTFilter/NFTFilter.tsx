import {
  Button,
  type ButtonProps,
  Checkbox,
  CheckboxGroup,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  type UseCheckboxGroupReturn,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { FilterIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";

export const NFTFilter = ({
  options,
  getCheckboxProps,
  ...props
}: {
  options: [string, string][];
  getCheckboxProps: UseCheckboxGroupReturn["getCheckboxProps"];
} & ButtonProps) => {
  const color = useColor();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom-end"
      variant="dropdown"
    >
      <PopoverTrigger>
        <Button
          background={isOpen ? "gray.100" : "none"}
          data-testid="nft-filter-trigger"
          size="sm"
          variant="auxiliary"
          {...props}
        >
          <Icon as={FilterIcon} color={color("400")} />
          <Text color={color("600")} fontWeight="600" size="sm">
            Filter By
          </Text>
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverBody data-testid="nft-filter">
          <VStack alignItems="flex-start" spacing="0">
            <CheckboxGroup>
              {options.map(([label, value]) => (
                <Checkbox
                  key={label}
                  width="full"
                  padding="12px 16px"
                  borderRadius="full"
                  _hover={{ backgroundColor: color("100") }}
                  data-testid="nft-filter-option"
                  {...getCheckboxProps({ value })}
                  color={color("900")}
                  fontWeight="600"
                  size="md"
                >
                  {label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
