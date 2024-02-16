import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Heading,
} from "@chakra-ui/react";

import { MultisigDecodedOperation } from "./MultisigDecodedOperation";
import { parseRawMichelson } from "../../../../multisig/decode/decodeLambda";
import { UnrecognizedMichelsonError } from "../../../../multisig/decode/UnrecognizedMichelsonError";
import colors from "../../../../style/colors";
import { MultisigAccount } from "../../../../types/Account";
import { JsValueWrap } from "../../JsValueWrap";

export const MultisigDecodedOperations: React.FC<{
  rawMichelson: string;
  sender: MultisigAccount;
}> = ({ rawMichelson, sender }) => {
  try {
    const operations = parseRawMichelson(rawMichelson, sender);
    return (
      <Box borderRadius="8px" backgroundColor={colors.gray[900]}>
        {operations.map((operation, i) => (
          // it is safe to use index here because the array is static
          <Box
            key={i}
            width="100%"
            paddingTop="10px"
            paddingBottom={i < operations.length - 1 ? 0 : "15px"}
            paddingX="15px"
          >
            <MultisigDecodedOperation operation={operation} />
            {i < operations.length - 1 && <Divider marginTop="15px" />}
          </Box>
        ))}
      </Box>
    );
  } catch (err: any) {
    if (err instanceof UnrecognizedMichelsonError) {
      return <UnrecognizedOperation rawMichelson={rawMichelson} />;
    } else {
      return (
        <Box height="50px" padding="10px" background={colors.gray[900]} borderRadius="8px">
          Invalid michelson code: {err.message}
        </Box>
      );
    }
  }
};

const UnrecognizedOperation: React.FC<{ rawMichelson: string }> = ({ rawMichelson }) => (
  <Accordion
    width="100%"
    marginBottom="8px"
    background={colors.gray[900]}
    borderColor={colors.gray[900]}
    borderRadius="8px"
    allowToggle
  >
    <AccordionItem>
      <AccordionButton>
        <Heading flex="1" height="30px" marginTop="6px" textAlign="left" size="md">
          Unrecognized operation
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel overflowY="scroll" height="400px" paddingBottom="12px">
        <JsValueWrap space={1} value={JSON.parse(rawMichelson)} />
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
