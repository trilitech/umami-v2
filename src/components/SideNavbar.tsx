import { Box, Divider, Flex, FlexProps, Text, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AppVersion } from "./AppVersion";
import { CollapseMenuButton, useCollapseMenu } from "./CollapseMenuButton";
import { MakiLogo } from "./MakiLogo";
import { NetworkSelector } from "./NetworkSelector";
import { TezRecapDisplay } from "./TezRecapDisplay";
import { UpdateAppButton } from "./UpdateAppButton";
import {
  AccountsIcon,
  AddressBookIcon,
  BatchIcon,
  CoinIcon,
  DiamondIcon,
  GearIcon,
  HelpIcon,
  RefreshClockIcon,
} from "../assets/icons";
import colors from "../style/colors";
import { useTotalBalance } from "../utils/hooks/assetsHooks";

export const SideNavbar = () => {
  const { isCollapsed, toggle } = useCollapseMenu();

  const collapseMenuButton = (
    <CollapseMenuButton
      marginTop={isCollapsed ? 0 : "2px"}
      marginRight={isCollapsed ? 0 : "-14px"}
      toggle={toggle}
    />
  );

  return (
    <Flex
      alignItems={isCollapsed ? "center" : "normal"}
      flexDirection="column"
      width={isCollapsed ? "80px" : "236px"}
      padding={isCollapsed ? "30px 20px" : "30px"}
      background={colors.gray[900]}
      data-testid={`side-navbar${isCollapsed ? "-collapsed" : ""}`}
    >
      <Box>
        <Flex alignItems="center" justifyContent="space-between" height="30px">
          {isCollapsed ? (
            collapseMenuButton
          ) : (
            <>
              <MakiLogo width="38px" height="38px" />
              <Flex>
                <NetworkSelector />
                {collapseMenuButton}
              </Flex>
            </>
          )}
        </Flex>
        <Divider marginTop="28px" />
      </Box>
      <Flex justifyContent="space-between" flexDirection="column" flex={1}>
        <Box
          alignItems={isCollapsed ? "center" : "normal"}
          justifyContent={isCollapsed ? "space-around" : "normal"}
          display={isCollapsed ? "flex" : "block"}
          height="100%"
        >
          {!isCollapsed && (
            <>
              <UpdateAppButton />
              <TotalBalance />
            </>
          )}
          <Box>
            <MenuItem
              icon={<AccountsIcon />}
              isCollapsed={isCollapsed}
              label="Accounts"
              to="/home"
            />
            <MenuItem icon={<DiamondIcon />} isCollapsed={isCollapsed} label="NFTs" to="/nfts" />
            <MenuItem
              icon={<RefreshClockIcon width="24px" height="24px" />}
              isCollapsed={isCollapsed}
              label="Operations"
              to="/operations"
            />
            <MenuItem icon={<CoinIcon />} isCollapsed={isCollapsed} label="Tokens" to="/tokens" />
            <MenuItem icon={<BatchIcon />} isCollapsed={isCollapsed} label="Batch" to="/batch" />
          </Box>
        </Box>
        <Box>
          <Divider />
          <MenuItem
            marginTop="22px"
            icon={<AddressBookIcon />}
            isCollapsed={isCollapsed}
            label="Address Book"
            to="/address-book"
          />

          <MenuItem icon={<GearIcon />} isCollapsed={isCollapsed} label="Settings" to="/settings" />
          <MenuItem icon={<HelpIcon />} isCollapsed={isCollapsed} label="Help" to="/help" />
          <AppVersion
            marginTop="24px"
            fontSize="14px"
            textAlign={isCollapsed ? "center" : "left"}
            isCollapsed={isCollapsed}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

const MenuItem: React.FC<
  {
    label: string;
    icon: React.ReactElement;
    to: string;
    isCollapsed: boolean;
  } & FlexProps
> = ({ icon, label, to, isCollapsed, ...flexProps }) => {
  const currentLocation = useLocation();
  // TODO: check if there are named routes in react-router-dom
  const isSelected = currentLocation.pathname.startsWith(to);

  return (
    <Link to={to}>
      <Flex
        alignItems="center"
        justifyContent="flex-start"
        width={isCollapsed ? "44px" : "176px"}
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
        {!isCollapsed && (
          <Text marginLeft="10px" size="sm">
            {label}
          </Text>
        )}
      </Flex>
    </Link>
  );
};

const TotalBalance = () => {
  const balance = useTotalBalance();
  const [isShort] = useMediaQuery("(max-height: 900px)");

  return (
    <Box marginTop="24px" marginBottom={isShort ? "30px" : "100px"} data-testid="total-balance">
      <Text marginBottom="4px" size="sm">
        Balance
      </Text>
      {balance && <TezRecapDisplay balance={balance.mutez} dollarBalance={balance.usd} />}
    </Box>
  );
};
