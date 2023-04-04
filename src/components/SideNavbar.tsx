import { Box, Divider, Flex, Icon, Text } from "@chakra-ui/react";
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
import { RxCube } from "react-icons/rx";
import { useNavigate } from "react-router";
import colors from "../style/colors";
import { useTotalBalance } from "../utils/hooks/assetsHooks";
import { MakiLogo } from "./MakiLogo";
import NetworkSelector from "./NetworkSelector";
import { TezRecapDisplay } from "./TezRecapDisplay";

const MenuItem: React.FC<{
  label: string;
  icon: IconType;
  onClick?: any;
}> = (props) => {
  return (
    <Flex
      onClick={props.onClick}
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
      <Text size="sm">{props.label}</Text>
    </Flex>
  );
};

const TopIems = () => {
  const navigate = useNavigate();
  // TODO use <Link /> element instead of hook
  return (
    <Box>
      <MenuItem
        onClick={() => navigate("/home")}
        label="Overview"
        icon={MdViewCompact}
      />
      <MenuItem
        label="NFTs"
        onClick={() => navigate("/nfts")}
        icon={MdOutlineDiamond}
      />
      <MenuItem
        label="Operations"
        onClick={() => navigate("/operations")}
        icon={MdHistory}
      />
      <MenuItem
        label="Delegations"
        onClick={() => navigate("/delegations")}
        icon={RxCube}
      />
      <MenuItem label="Tokens" icon={MdMoney} />
      <MenuItem label="Batch" icon={MdCalendarViewMonth} />
    </Box>
  );
};

const BottomIems = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Divider />
      <MenuItem label="Adress Book" icon={MdOutlineContacts} />
      <MenuItem
        onClick={() => navigate("/settings")}
        label="Settings"
        icon={MdOutlineSettings}
      />
      <MenuItem
        onClick={() => navigate("/help")}
        label="Help"
        icon={MdSupport}
      />
    </Box>
  );
};

const TotalBalance = () => {
  const balance = useTotalBalance();

  return (
    <Box mt={4} mb={12} height={"80px"}>
      <Text size="sm">Balance</Text>
      {balance !== null && (
        <TezRecapDisplay
          tezBalance={balance.tezBalance}
          dollarBalance={balance.dollarBalance}
        />
      )}
    </Box>
  );
};

export const SideNavbar = () => {
  return (
    <Flex
      flexDirection={"column"}
      bg="umami.gray.900"
      w={"240px"}
      pl={4}
      pr={4}
    >
      <Box>
        <Flex height={24} justifyContent="space-between" alignItems="center">
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
