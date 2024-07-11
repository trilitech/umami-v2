import { Flex } from "@chakra-ui/react";

import { EmptyMessage } from "../../components/EmptyMessage";

export const Activity = () => (
  <Flex height="full">
    <EmptyMessage subtitle="Activity" title="Activity" />
  </Flex>
);
