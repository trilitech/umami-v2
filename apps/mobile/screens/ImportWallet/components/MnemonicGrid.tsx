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

  const rowsNumber = Math.ceil(fields.length / 3);

  // Create 2D array with dynamic rows and 3 columns
  const rows = Array.from(
    { length: rowsNumber },
    (_, rowIndex) =>
      Array.from({ length: 3 }, (_, colIndex) => {
        const index = rowIndex * 3 + colIndex;
        return index < fields.length ? fields[index] : null;
      }).filter((field): field is T => field !== null) // Type guard to remove null entries
  );

  return (
    <YStack flex={1} gap="$3">
      {rows.map((row, rowIndex) => (
        <XStack key={rowIndex} justifyContent="flex-start" gap="$3">
          {row.map((field, colIndex) => (
            <XStack
              key={field.id}
              alignItems="center"
              flex={1}
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$8"
              backgroundColor="$gray2"
              paddingHorizontal="$3"
              paddingVertical="$1"
            >
              <IndexLabel flex={1}>{rowIndex * 3 + colIndex + 1}</IndexLabel>
              <Controller
                control={form.control}
                name={`mnemonic.${rowIndex * 3 + colIndex}.val`}
                render={({ field }) => (
                  <StyledInput
                    {...field}
                    multiline={false}
                    numberOfLines={1}
                    onChangeText={field.onChange}
                    placeholder={`word #${rowIndex * 3 + colIndex + 1}`}
                    unstyled
                  />
                )}
              />
            </XStack>
          ))}
        </XStack>
      ))}
    </YStack>
  );
};

const MnemonicGridItem = styled(XStack, {
  flex: 1,
  maxWidth: 100 / 3 + "%",
});
