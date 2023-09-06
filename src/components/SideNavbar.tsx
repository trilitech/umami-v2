import { Box, Divider, Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
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
import { Link } from "react-router-dom";
import colors from "../style/colors";
import { useTotalBalance } from "../utils/hooks/assetsHooks";
import { MakiLogo } from "./MakiLogo";
import NetworkSelector from "./NetworkSelector";
import { TezRecapDisplay } from "./TezRecapDisplay";
import { AppVersion } from "./AppVersion";

const MenuItem: React.FC<
  {
    label: string;
    icon: IconType;
    to: string;
  } & FlexProps
> = props => {
  return (
    <Link to={props.to}>
      <Flex
        _hover={{
          background: colors.gray[800],
        }}
        pb={2}
        pt={2}
        mb={2}
        mt={2}
        justifyContent="flex-start"
        alignItems="center"
        border={40}
        cursor="pointer"
        {...props}
      >
        <Icon w={6} h={6} ml={2} mr={4} as={props.icon} />
        <Text size="sm">{props.label}</Text>
      </Flex>
    </Link>
  );
};

const TotalBalance = () => {
  const balance = useTotalBalance();

  return (
    <Box mt={4} mb={12} height="80px">
      <Text size="sm">Balance</Text>
      {balance !== null && <TezRecapDisplay balance={balance.mutez} dollarBalance={balance.usd} />}
    </Box>
  );
};

export const SideNavbar = () => {
  return (
    <Flex flexDirection="column" bg={colors.gray[900]} w="240px" pl={4} pr={4}>
      <Box>
        <Flex height={24} justifyContent="space-between" alignItems="center">
          <MakiLogo size={50} />
          <NetworkSelector />
        </Flex>
        <Divider />
      </Box>
      <Flex flexDirection="column" justifyContent="space-between" flex={1}>
        <Box>
          <TotalBalance />
          <Box>
            <MenuItem label="Overview" to="/home" icon={MdViewCompact} />
            <MenuItem label="NFTs" to="/nfts" icon={MdOutlineDiamond} />
            <MenuItem label="Operations" to="/operations" icon={MdHistory} />
            <MenuItem label="Tokens" to="/tokens" icon={MdMoney} />
            <MenuItem label="Batch" to="/batch" icon={MdCalendarViewMonth} />
          </Box>
        </Box>
        <Box>
          <Divider />
          <MenuItem label="Address Book" to="/address-book" icon={MdOutlineContacts} />

          <MenuItem label="Settings" to="/settings" icon={MdOutlineSettings} />
          <MenuItem label="Help" to="/help" icon={MdSupport} mb="24px" pb={0} />
          <AppVersion mb="24px" />
        </Box>
      </Flex>
    </Flex>
  );
};

export default SideNavbar;
