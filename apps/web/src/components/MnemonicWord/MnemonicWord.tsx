import { GridItem, type GridItemProps, Text } from "@chakra-ui/react";
import { MnemonicAutocomplete } from "@umami/components";
import { type ComponentProps } from "react";

import { useColor } from "../../styles/useColor";

type MnemonicWordProps = {
  index: number;
  word?: string;
  autocompleteProps?: ComponentProps<typeof MnemonicAutocomplete>;
} & GridItemProps;

export const MnemonicWord = ({ index, word, autocompleteProps, ...props }: MnemonicWordProps) => {
  const color = useColor();

  return (
    <GridItem {...props}>
      <Text
        position="absolute"
        zIndex={1}
        marginTop={{ lg: "11px", base: "8px" }}
        marginLeft={{ lg: "16px", base: "10px" }}
        color={color("300")}
        textAlign="right"
        size={{ lg: "lg", base: "xs" }}
      >
        {String(index + 1).padStart(2, "0")}.
      </Text>
      {autocompleteProps && <MnemonicAutocomplete {...autocompleteProps} />}
      {word && (
        <Text
          alignSelf="center"
          paddingRight="10px"
          paddingLeft={{ base: "30px", lg: "48px" }}
          fontSize={{ base: "xs", lg: "lg" }}
          fontWeight="medium"
        >
          {word}
        </Text>
      )}
    </GridItem>
  );
};
