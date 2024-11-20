import { GridItem, type GridItemProps, Text, type TextProps } from "@chakra-ui/react";
import { MnemonicAutocomplete } from "@umami/components";
import { type ComponentProps } from "react";

import { useColor } from "../../styles/useColor";

type MnemonicWordProps = {
  index: number;
  word?: string;
  indexProps?: TextProps;
  autocompleteProps?: ComponentProps<typeof MnemonicAutocomplete>;
} & GridItemProps;

export const MnemonicWord = ({
  index,
  word,
  autocompleteProps,
  indexProps,
  ...props
}: MnemonicWordProps) => {
  const color = useColor();

  return (
    <GridItem {...props} position="relative">
      <Text
        position="absolute"
        zIndex={1}
        alignItems="center"
        display="flex"
        height="100%"
        marginLeft={word ? 0 : { base: "12px", md: "16px" }}
        paddingTop={{ md: "0.5px" }}
        color={color("400")}
        fontSize={{ base: "12px", md: word ? "14px" : "18px" }}
        {...indexProps}
      >
        {String(index + 1).padStart(2, "0")}.
      </Text>
      {autocompleteProps && <MnemonicAutocomplete {...autocompleteProps} />}
      {word && (
        <Text
          paddingLeft={{ base: "22px", md: "26px" }}
          fontSize={{ base: "12px", md: "14px" }}
          fontWeight="medium"
        >
          {word}
        </Text>
      )}
    </GridItem>
  );
};
