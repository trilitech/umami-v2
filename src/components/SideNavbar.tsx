import { Box, Divider, Flex, Icon, Text } from "@chakra-ui/react";
import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";
import React from "react";
import { IconType } from "react-icons/lib";
import {
  MdCalendarViewMonth,
  MdHistory,
  MdMoney,
  MdOutlineContacts,
  MdOutlineDiamond,
  MdOutlineSettings,
  MdSupport,
  MdViewCompact,
} from "react-icons/md";
import colors from "../style/colors";
import { useTotalBalance } from "../utils/hooks/accountHooks";
import { useAppSelector } from "../utils/store/hooks";
import { MakiLogo } from "./MakiLogo";
import NetworkSelector from "./NetworkSelector";
import { TezRecapDisplay } from "./TezRecapDisplay";

const MenuItem: React.FC<{ label: string; icon: IconType }> = (props) => {
  return (
    <Flex
      _hover={{
        background: colors.gray[800],
      }}
      pb={2}
      pt={2}
      mb={2}
      mt={2}
      justifyContent="flex-start"
      alignItems={"center"}
      border={40}
      cursor="pointer"
    >
      <Icon w={6} h={6} ml={2} mr={4} as={props.icon} />
      <Text fontSize="md">{props.label}</Text>
    </Flex>
  );
};

const TopIems = () => {
  return (
    <Box>
      <MenuItem label="Overview" icon={MdViewCompact} />
      <MenuItem label="NFTs" icon={MdOutlineDiamond} />
      <MenuItem label="Operations" icon={MdHistory} />
      <MenuItem label="Tokens" icon={MdMoney} />
      <MenuItem label="Batch" icon={MdCalendarViewMonth} />
    </Box>
  );
};

const BottomIems = () => {
  return (
    <Box>
      <Divider />
      <MenuItem label="Address Book" icon={MdOutlineContacts} />
      <MenuItem label="Settings" icon={MdOutlineSettings} />
      <MenuItem label="Help" icon={MdSupport} />
    </Box>
  );
};

const TotalBalance = () => {
  const totalMutez = useTotalBalance();

  const tezBalance =
    totalMutez && (format("mutez", "tz", totalMutez) as BigNumber).toNumber();

  return (
    <Box mt={4} mb={12} height={"80px"}>
      <Text>Balance</Text>
      {tezBalance && (
        <TezRecapDisplay tezBalance={tezBalance} dollarBalance={3} />
      )}
    </Box>
  );
};

export const SideNavbar = () => {
  return (
    <Flex
      flexDirection={"column"}
      height={"100%"}
      pl={4}
      pr={4}
      bg="umami.gray.900"
      w={"240px"}
    >
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mt={4} mb={4}>
          <MakiLogo size={50} />
          <NetworkSelector />
        </Flex>
        <Divider />
      </Box>
      <Flex flexDirection={"column"} justifyContent={"space-between"} flex={1}>
        <Box>
          <TotalBalance />
          <TopIems />
        </Box>
        <BottomIems />
      </Flex>
    </Flex>
  );
};

export default SideNavbar;
