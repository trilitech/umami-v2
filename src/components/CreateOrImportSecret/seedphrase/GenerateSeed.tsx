import { Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { generate24WordMnemonic } from "../../../utils/mnemonic";
import AccountNameForm from "../accountName/AccountNameForm";

const GenerateSeed = ({
  onClickNext,
}: {
  onClickNext: (seedPhrase: string) => void;
}) => {
  // seedPhrase value will be stable across rerenders
  const [seedPhrase] = useState(generate24WordMnemonic());

  return (
    <VStack>
      <Text size={"lg"}>{seedPhrase}</Text>
      <Button onClick={(_) => onClickNext(seedPhrase)}>Next</Button>
    </VStack>
  );
};

export const GenerateSeedAndNameAccount = ({
  onClickNext,
}: {
  onClickNext: (seedPhrase: string, label: string) => void;
}) => {
  const [seedPhrase, setSeedPhrase] = useState<string>();

  if (!seedPhrase) {
    return <GenerateSeed onClickNext={setSeedPhrase} />;
  }

  return (
    <AccountNameForm
      isLoading={false}
      onSubmit={(label) => {
        onClickNext(seedPhrase, label);
      }}
    />
  );
};
