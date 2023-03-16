import { useAppSelector } from "../../utils/store/hooks";

import { Box } from "@chakra-ui/react";
import { OperationTile } from "../../components/OperationTile";
import { formatPkh } from "../../utils/tezos";

export const OperationsList = () => {
  const operations = useAppSelector((s) => s.assets.operations);

  const operationEls = Object.values(operations).flatMap((b) => b);
  const last = operationEls.slice(0, 5);

  return (
    <Box>
      {last.map((t) => {
        return (
          <OperationTile
            key={(t.hash || "") + t.from[0]}
            from={formatPkh(t.from[0])}
            to={formatPkh(t.to[0])}
            amount={t.amount}
          />
        );
      })}
    </Box>
  );
};
