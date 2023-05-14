import { Button, Grid, GridItem, VStack } from "@chakra-ui/react";
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
    <VStack overflow='scroll'>
      <Grid templateColumns='repeat(3, 1fr)' gap={3} pb='20px'>
        {seedPhrase.split(' ').map((item, index) => {
          return (
            <GridItem
              fontSize='sm'
              border='1px dashed #D6D6D6;'
              borderRadius='4px'
              p='6px'>{index}. {item}</GridItem>
          )
        })}
      </Grid>
      <Button
        bg='umami.blue'
        w='100%'
        size='lg'
        minH='48px'
        onClick={(_) => onClickNext(seedPhrase)}
      >
        OK, I’ve recorded it
      </Button>
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
