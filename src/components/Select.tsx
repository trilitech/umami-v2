import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useState } from "react";
import colors from "../style/colors";
import ChevronDownIcon from "../assets/icons/ChevronDown";

export type Option = { label: string; value: string };
export const Select: React.FC<{
  selected: Option;
  options: Option[];
  onChange: (newValue: string) => void;
}> = ({ selected, options, onChange }) => {
  const [currentOption, setCurrentOption] = useState(selected);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <Box>
      <Flex
        data-testid="select-input"
        justify="space-between"
        height="48px"
        bg={colors.gray[800]}
        color={colors.gray[300]}
        border="1px solid"
        borderRadius="4px"
        padding="15px"
        borderColor={colors.gray[500]}
        _hover={{ borderColor: colors.gray[450] }}
        cursor="pointer"
        onClick={() => setShowOptions(show => !show)}
      >
        <Text size="sm">{currentOption.label}</Text>
        <ChevronDownIcon />
      </Flex>
      {showOptions && (
        <UnorderedList
          data-testid="select-options"
          margin={0}
          marginTop="8px"
          borderRadius="8px"
          padding="15px"
          bg={colors.gray[700]}
          border="1px solid"
          zIndex={2}
          listStyleType="none"
          width="100%"
          position="absolute"
          borderColor={colors.gray[500]}
        >
          {options.map(option => (
            <ListItem
              padding="11px"
              borderRadius="4px"
              color={colors.gray[300]}
              cursor="pointer"
              key={option.value}
              bg="transparent"
              _hover={{ background: colors.gray[500] }}
              marginBottom="5px"
              onClick={() => {
                setShowOptions(false);
                setCurrentOption(option);
                onChange(option.value);
              }}
            >
              <Text size="sm">{option.label}</Text>
            </ListItem>
          ))}
        </UnorderedList>
      )}
    </Box>
  );
};
