import { Box } from "@chakra-ui/react";
import { parseRawMichelson } from "../../../../multisig/decode/decodeLambda";
import { UnrecognizedMichelsonError } from "../../../../multisig/decode/UnrecognizedMichelsonError";

const MultisigOperationsDisplay: React.FC<{
  rawActions: string;
}> = ({ rawActions }) => {
  try {
    const operations = parseRawMichelson(rawActions);
    //TODO: implment the ui.
    return <Box>{JSON.stringify(operations, null, 2)}</Box>;
  } catch (err: any) {
    if (err instanceof UnrecognizedMichelsonError) {
      //TODO: implment the ui.
      return <Box>Unrecognized operation</Box>;
    } else {
      return <Box>Invalid michelson code: {err.messageg}</Box>;
    }
  }
};

export default MultisigOperationsDisplay;
