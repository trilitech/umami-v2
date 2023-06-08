import { Box, Divider, Flex } from "@chakra-ui/react";
import { isArray } from "lodash";
import React from "react";
import { MultisigAccount } from "../../../types/Account";

export const MultisigPendingList: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  return (
    <Box p={10} w={"120%"}>
      <Box>threshold:{account.threshold}</Box>
      {account.operations.map((o) => {
        return (
          <Box m={4}>
            {Object.entries(o).map(([k, v]) => {
              return (
                <Box>
                  <Flex m={2} wordBreak="break-word">
                    {k}:{isArray(v) ? [...v] : v}
                  </Flex>
                </Box>
              );
            })}
            "============================================="
          </Box>
        );
      })}
    </Box>
  );
};

export default MultisigPendingList;
