import {
  Button,
  type ButtonProps,
  Checkbox,
  CheckboxGroup,
  Flex,
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
import { Tag } from "../../../components/Tag/Tag";
import { useColor } from "../../../styles/useColor";

export const NFTFilter = ({
  options,
  getCheckboxProps,
  selected,
  ...props
}: {
  options: [string, string][];
  getCheckboxProps: UseCheckboxGroupReturn["getCheckboxProps"];
  selected: [string, string][];
} & ButtonProps) => {
  const color = useColor();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const isChecked = (value: string) => selected.some(option => option[1] === value);

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom-end"
      variant="dropdown"
    >
      <Flex alignItems="flex-start" gap="10px">
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
        <Flex
          flexWrap="wrap"
          flex="1"
          gap="4px"
          display={{ base: "none", md: "flex" }}
          marginRight="auto"
        >
          {selected.map(([label, value]) => (
            <Tag
              key={label}
              data-testid={`nft-filter-tag-${value}`}
              onClick={() => {
                getCheckboxProps({ value }).onChange(value);
              }}
              option={[label, value]}
            />
          ))}
        </Flex>
      </Flex>
      <PopoverContent maxWidth="274px">
        <PopoverBody overflowY="auto" maxHeight="312px" data-testid="nft-filter">
          <VStack alignItems="flex-start" spacing="0">
            <CheckboxGroup>
              {options.map(([label, value]) => (
                <Checkbox
                  key={label}
                  width="full"
                  padding="12px 16px"
                  color={color("900")}
                  fontWeight="600"
                  borderRadius="full"
                  _hover={{ backgroundColor: color("100") }}
                  data-testid="nft-filter-option"
                  isChecked={isChecked(value)}
                  onChange={() => getCheckboxProps({ value }).onChange(value)}
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
