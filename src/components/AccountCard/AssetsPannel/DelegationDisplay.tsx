import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import colors from "../../../style/colors";
import { Delegation } from "../../../types/Delegation";
import { useGetDelegationPrettyDisplayValues } from "../../../utils/hooks/delegationHooks";
import { CopyableAddress } from "../../CopyableText";
import { NoDelegations } from "../../NoItems";
import { DelegationMode } from "../../sendForm/types";

const Row: React.FC<{
  label: string;
  value: string | ReactNode;
  grayBg?: boolean;
}> = ({ label, value, grayBg }) => {
  console.log(label, value);
  return (
    <Flex
      data-testid={label}
      bg={grayBg ? "umami.gray.800" : "initial"}
      h="50px"
      alignItems="center"
      borderBottom={`1px solid ${colors.gray[700]}`}
    >
      <Box flex={1}>
        <Heading size="sm" color="text.dark">
          {label}
        </Heading>
      </Box>
      <Box flex={1}>{typeof value === "string" ? <Text size="sm">{value}</Text> : value}</Box>
    </Flex>
  );
};

export const DelegationDisplay: React.FC<{
  delegation: Delegation | null;
  onDelegate: (opts?: DelegationMode["data"]) => void;
}> = ({ delegation, onDelegate }) => {
  const getDelegationPrettyDisplay = useGetDelegationPrettyDisplayValues();
  if (!delegation) {
    return <NoDelegations small onDelegate={onDelegate} />;
  }

  const { currentBalance, duration, initialBalance } = getDelegationPrettyDisplay(delegation);

  return (
    <Box>
      <Row label="Initial Balance:" value={initialBalance} grayBg />
      {currentBalance && <Row label="Current Balance:" value={currentBalance} />}
      <Row label="Duration:" value={duration} />
      <Row label="Baker:" value={<CopyableAddress pkh={delegation.delegate.address} />} />
      <Flex>
        <Button flex={1} mr={2} bg="umami.blue" onClick={() => onDelegate()}>
          Change Baker
        </Button>
        <Button flex={1} ml={2} onClick={() => onDelegate({ undelegate: true })}>
          End Delegation
        </Button>
      </Flex>
    </Box>
  );
};
