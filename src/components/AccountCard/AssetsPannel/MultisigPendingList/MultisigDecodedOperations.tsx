import { Box } from "@chakra-ui/react";
import { parseRawMichelson } from "../../../../multisig/decode/decodeLambda";
import { UnrecognizedMichelsonError } from "../../../../multisig/decode/UnrecognizedMichelsonError";
import { useGetAccountAssetsLookup } from "../../../../utils/hooks/assetsHooks";
import MultisigDecodedOperationItem from "./MultisigDecodedOperationItem";

const MultisigDecodedOperations: React.FC<{
  rawActions: string;
  pkh: string;
}> = ({ rawActions, pkh }) => {
  const getAssetLookup = useGetAccountAssetsLookup();
  try {
    const operations = parseRawMichelson(rawActions);
    return (
      <Box>
        {operations.map((operation, i) => (
          <MultisigDecodedOperationItem
            key={`${operation.recipient}${i}`}
            assets={getAssetLookup(pkh)}
            operation={operation}
          />
        ))}
      </Box>
    );
  } catch (err: any) {
    if (err instanceof UnrecognizedMichelsonError) {
      //TODO: implment the ui.
      return <Box>Unrecognized operation</Box>;
    } else {
      //TODO: implment the ui.
      return <Box>Invalid michelson code: {err.message}</Box>;
    }
  }
};

export default MultisigDecodedOperations;
