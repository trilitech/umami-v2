import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { parseRawMichelson } from "../../../../multisig/decode/decodeLambda";
import { UnrecognizedMichelsonError } from "../../../../multisig/decode/UnrecognizedMichelsonError";
import { MultisigAccount } from "../../../../types/Account";
import MultisigDecodedOperationItem from "./MultisigDecodedOperationItem";

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
    <Accordion allowMultiple={true} w="70%" mb={2}>
      <AccordionItem bg="umami.gray.800" border="none" borderRadius="8px" mb="2">
        <h2>
          <AccordionButton>
            <Box as="span" pl={1} flex="1" textAlign="left">
              Unrecognized operation
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={3} h="400px" overflowY="scroll">
          <Card bg="umami.gray.700" borderRadius="5px">
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "12px",
                lineHeight: "18px",
              }}
            >
              <CardBody>{JSON.stringify(JSON.parse(unrecoginizedRawActions), null, 1)}</CardBody>
            </pre>
          </Card>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default MultisigDecodedOperations;
