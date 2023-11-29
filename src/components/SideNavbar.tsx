import { Box, Divider, Flex, FlexProps, Text } from "@chakra-ui/react";
import React from "react";

import { Link, useLocation } from "react-router-dom";
import colors from "../style/colors";
import { useTotalBalance } from "../utils/hooks/assetsHooks";
import { MakiLogo } from "./MakiLogo";
import NetworkSelector from "./NetworkSelector";
import { TezRecapDisplay } from "./TezRecapDisplay";
import { AppVersion } from "./AppVersion";
import CoinIcon from "../assets/icons/Coin";
import AccountsIcon from "../assets/icons/Accounts";
import DiamondIcon from "../assets/icons/Diamond";
import RefreshClockIcon from "../assets/icons/RefreshClock";
import BatchIcon from "../assets/icons/Batch";
import AddressBookIcon from "../assets/icons/AddressBook";
import GearIcon from "../assets/icons/Gear";
import HelpIcon from "../assets/icons/Help";
import { UpdateAppButton } from "./UpdateAppButton";

const MenuItem: React.FC<
  {
    label: string;
    icon: JSX.Element;
    to: string;
  } & FlexProps
> = ({ icon, label, to, ...flexProps }) => {
  const currentLocation = useLocation();
  // TODO: check if there are named routes in react-router-dom
  const isSelected = currentLocation.pathname.includes(to);

  return (
    <Link to={to}>
      <Flex
        alignItems="center"
        justifyContent="flex-start"
        width="176px"
        marginBottom="8px"
        padding="10px"
        background={isSelected ? colors.gray[600] : "transparent"}
        borderRadius="4px"
        _hover={{
          background: isSelected ? colors.gray[600] : colors.gray[800],
        }}
        cursor="pointer"
        {...flexProps}
      >
        {icon}
        <Text marginLeft="10px" size="sm">
          {label}
        </Text>
      </Flex>
    </Link>
  );
};

const TotalBalance = () => {
  const balance = useTotalBalance();

  return (
    <Box marginTop="24px" marginBottom="100px">
      <Text marginBottom="4px" size="sm">
        Balance
      </Text>
      {balance !== null && <TezRecapDisplay balance={balance.mutez} dollarBalance={balance.usd} />}
    </Box>
  );
};

export const SideNavbar = () => {
  return (
    <Flex
      flexDirection="column"
      width="236px"
      padding="30px 30px 30px 30px"
      background={colors.gray[900]}
    >
      <Box>
        <Flex alignItems="center" justifyContent="space-between" height="30px">
          <MakiLogo size={38} />
          <NetworkSelector />
        </Flex>
        <Divider marginTop="28px" />
      </Box>
      <Flex justifyContent="space-between" flexDirection="column" flex={1}>
        <Box>
          <UpdateAppButton />
          <TotalBalance />
          <Box>
            <MenuItem label="Accounts" to="/home" icon={<AccountsIcon />} />
            <MenuItem label="NFTs" to="/nfts" icon={<DiamondIcon />} />
            <MenuItem
              label="Operations"
              to="/operations"
              icon={<RefreshClockIcon w="24px" h="24px" />}
            />
            <MenuItem label="Tokens" to="/tokens" icon={<CoinIcon />} />
            <MenuItem label="Batch" to="/batch" icon={<BatchIcon />} />
          </Box>
        </Box>
        <Box>
          <Divider />
          <MenuItem mt="22px" label="Address Book" to="/address-book" icon={<AddressBookIcon />} />

          <MenuItem label="Settings" to="/settings" icon={<GearIcon />} />
          <MenuItem label="Help" to="/help" icon={<HelpIcon />} />
          <AppVersion mt="24px" fontSize="14px" />
        </Box>
      </Flex>
    </Flex>
  );
};

export default SideNavbar;
