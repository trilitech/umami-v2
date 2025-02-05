import { Controller, type FieldArrayWithId, useFormContext } from "react-hook-form";
import { Input, Text, XStack, YStack, styled } from "tamagui";

type FormValues = {
  mnemonic: { val: string }[];
};

const StyledInput = styled(Input, {
  flex: 4,
  size: "$3",
  borderRadius: "$4",
  color: "$gray12",
  textAlign: "center",
  // borderWidth: 1,
  padding: 0,
  paddingVertical: 10,
  variants: {
    focused: { true: { borderColor: "$blue8", backgroundColor: "$blue2" } },
    filled: { true: { backgroundColor: "$gray3" } },
  },
});

const IndexLabel = styled(Text, {
  color: "$gray11",
  width: 28,
  fontSize: "$3",
});

export const MnemonicGrid = <T extends FieldArrayWithId<FormValues>>({
  fields,
}: {
  fields: T[];
}) => {
  const form = useFormContext<FormValues>();

  return (
    <YStack flexWrap="wrap" flexDirection="row" flex={1} gap="$3">
      {fields.map((field, row) => (
        <XStack
          key={field.id}
          alignItems="center"
          width="30%"
          paddingRight="$3"
          paddingLeft="$3"
          borderWidth={1}
          borderColor="$gray5"
          borderRadius="$8"
          backgroundColor="$gray2"
          paddingVertical="$1"
        >
          <IndexLabel flex={1}>{row + 1}</IndexLabel>
          <Controller
            control={form.control}
            name={`mnemonic.${row}.val`}
            render={({ field }) => (
              <StyledInput
                {...field}
                multiline={false}
                numberOfLines={1}
                onChangeText={field.onChange}
                placeholder={`word #${row + 1}`}
                unstyled
              />
            )}
          />
        </XStack>
      ))}
    </YStack>
  );
};
