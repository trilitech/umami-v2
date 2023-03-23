import { useAppSelector } from "../../utils/store/hooks";

import { Box, Tab, TabList, Tabs } from "@chakra-ui/react";
import { OperationTile } from "../../components/OperationTile";

export const OperationsList = () => {
  const operations = useAppSelector((s) => s.assets.operations);

  const operationEls = Object.values(operations).flatMap((b) => b);
  const last = operationEls.slice(0, 20);

  const operations2 = last.map((op) => {
    return <OperationTile key={op.hash + op.from[0]} operation={op} />;
  });

  return (
    <Tabs
      height={"100%"}
      display={"flex"}
      flexDirection="column"
      mt={4}
      bg="umami.gray.900"
      borderRadius={4}
      // color scheme not workkig even when put int 50-900 range
      // TODO Fix
      // https://chakra-ui.com/docs/components/tabs
    >
      <TabList>
        <Tab>All</Tab>
        <Tab>Sent</Tab>
        <Tab>Received</Tab>
        <Tab>Delegations</Tab>
      </TabList>

      <Box minHeight={"10px"} overflow={"scroll"}>
        {operations2}
      </Box>
    </Tabs>
  );
};
