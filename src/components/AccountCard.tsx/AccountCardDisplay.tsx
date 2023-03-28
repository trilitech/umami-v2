import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { MdArrowOutward, MdSouthWest } from "react-icons/md";

import { FiPlus } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { Identicon } from "../Identicon";
import { TezRecapDisplay } from "../TezRecapDisplay";
import { CopyableAddress } from "../CopyableAddress";

type Props = {
  onSend?: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
  onDelegate?: () => void;
  label: string;
  pkh: string;
  tezBalance: number | null;
  dollarBalance: number | null;
};

const RoundButton: React.FC<{
  label: string;
  icon: any;
}> = ({ icon, label }) => {
  return (
    <Box textAlign="center" ml={4} mr={4}>
      <IconButton
        borderRadius={"50%"}
        aria-label="Search database"
        icon={icon}
        mb={2}
      />
      <Text size={"sm"}>{label}</Text>
    </Box>
  );
};

export const AccountCardDisplay: React.FC<Props> = ({
  pkh,
  onSend = () => {},
  onReceive = () => {},
  onBuyTez = () => {},
  onDelegate = () => {},
  label,
  tezBalance,
  dollarBalance,
}) => {
  return (
    <Flex direction="column" alignItems={"center"}>
      <Identicon address={pkh} />
      <Heading mt={4} mb={2} size={"md"}>
        {label}
      </Heading>
      <CopyableAddress pkh={pkh} copyable={true} mb={4} />
      {tezBalance !== null && (
        <TezRecapDisplay
          center
          tezBalance={tezBalance}
          dollarBalance={dollarBalance}
        />
      )}
      <Flex mt={6}>
        <RoundButton label="Send" icon={<MdArrowOutward />} />
        <RoundButton label="Receive" icon={<MdSouthWest />} />
        <RoundButton label="Buy tez" icon={<FiPlus />} />
        <RoundButton label="Delegate" icon={<VscWand />} />
      </Flex>
    </Flex>
  );
};
