import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { parseRawMichelson } from "../../../../multisig/decode/decodeLambda";
import { UnrecognizedMichelsonError } from "../../../../multisig/decode/UnrecognizedMichelsonError";
import { MultisigAccount } from "../../../../types/Account";
import MultisigDecodedOperationItem from "./MultisigDecodedOperationItem";
import JsValueWrap from "../../JsValueWrap";

const MultisigDecodedOperations: React.FC<{
  rawActions: string;
  sender: MultisigAccount;
}> = ({ rawActions, sender }) => {
  try {
    const operations = parseRawMichelson(rawActions, sender);
    return (
      <Box>
        {operations.map((operation, i) => (
          // it is safe to use index here because the array is static
          <MultisigDecodedOperationItem key={i} operation={operation} />
        ))}
      </Box>
    );
  } catch (err: any) {
    if (err instanceof UnrecognizedMichelsonError) {
      return <UnrecognizedOperationAccordion unrecoginizedRawActions={rawActions} />;
    } else {
      return <Box>Invalid michelson code: {err.message}</Box>;
    }
  }
};

const UnrecognizedOperationAccordion: React.FC<{ unrecoginizedRawActions: string }> = ({
  unrecoginizedRawActions,
}) => {
  return (
    <Accordion width="70%" marginBottom={2} allowMultiple={true}>
      <AccordionItem marginBottom="2" background="umami.gray.800" border="none" borderRadius="8px">
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" paddingLeft={1} textAlign="left">
              Unrecognized operation
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel overflowY="scroll" height="400px" paddingBottom={3}>
          <JsValueWrap space={1} value={JSON.parse(unrecoginizedRawActions)} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default MultisigDecodedOperations;
