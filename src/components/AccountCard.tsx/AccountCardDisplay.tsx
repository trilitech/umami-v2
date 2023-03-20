import { Box, Flex, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { MdArrowOutward, MdCopyAll, MdSouthWest } from "react-icons/md";

import { FiPlus } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { formatPkh } from "../../utils/format";
import { Identicon } from "../Identicon";
import { TezRecapDisplay } from "../TezRecapDisplay";

type Props = {
  onSend?: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
  onDelegate?: () => void;
  onCopyAddress?: () => void;
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
      <Text fontSize={"sm"}>{label}</Text>
    </Box>
  );
};

export const AccountCardDisplay: React.FC<Props> = ({
  pkh,
  onSend = () => {},
  onReceive = () => {},
  onBuyTez = () => {},
  onDelegate = () => {},
  onCopyAddress = (pkh: string) => {},
  label,
  tezBalance,
  dollarBalance,
}) => {
  return (
    <Flex direction="column" alignItems={"center"}>
      <Identicon address={pkh} />
      <Heading mt={4} fontSize={"lg"}>
        {label}
      </Heading>
      <Flex mb={4}>
        <Text color={"umami.gray.400"}>{formatPkh(pkh)}</Text>
        <Icon
          cursor="pointer"
          onClick={(_) => onCopyAddress(pkh)}
          w={4}
          h={4}
          ml={2}
          mr={4}
          as={MdCopyAll}
        />
      </Flex>
      {tezBalance && dollarBalance && (
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
