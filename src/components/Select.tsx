import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useState } from "react";

import { ChevronDownIcon } from "../assets/icons";
import colors from "../style/colors";

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
        justifyContent="space-between"
        height="48px"
        padding="15px"
        color={colors.gray[300]}
        background={colors.gray[800]}
        border="1px solid"
        borderColor={colors.gray[500]}
        borderRadius="4px"
        _hover={{ borderColor: colors.gray[450] }}
        cursor="pointer"
        data-testid="select-input"
        onClick={() => setShowOptions(show => !show)}
      >
        <Text size="sm">{currentOption.label}</Text>
        <ChevronDownIcon />
      </Flex>
      {showOptions && (
        <UnorderedList
          position="absolute"
          zIndex={2}
          width="100%"
          margin={0}
          marginTop="8px"
          padding="15px"
          background={colors.gray[700]}
          border="1px solid"
          borderColor={colors.gray[500]}
          borderRadius="8px"
          data-testid="select-options"
          listStyleType="none"
        >
          {options.map(option => (
            <ListItem
              key={option.value}
              marginBottom="5px"
              padding="11px"
              color={colors.gray[300]}
              background="transparent"
              borderRadius="4px"
              _hover={{ background: colors.gray[500] }}
              cursor="pointer"
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
