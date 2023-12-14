import { Box, Divider, Flex, FlexProps, Text } from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AppVersion } from "./AppVersion";
import { feedbackEmailBodyTemplate } from "./ErrorPage";
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
  FeedbackIcon,
  GearIcon,
  HelpIcon,
  RefreshClockIcon,
} from "../assets/icons";
import colors from "../style/colors";
import { useTotalBalance } from "../utils/hooks/assetsHooks";

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
            <MenuItem icon={<AccountsIcon />} label="Accounts" to="/home" />
            <MenuItem icon={<DiamondIcon />} label="NFTs" to="/nfts" />
            <MenuItem
              icon={<RefreshClockIcon width="24px" height="24px" />}
              label="Operations"
              to="/operations"
            />
            <MenuItem icon={<CoinIcon />} label="Tokens" to="/tokens" />
            <MenuItem icon={<BatchIcon />} label="Batch" to="/batch" />
          </Box>
        </Box>
        <Box>
          <Divider />
          <MenuItem
            marginTop="22px"
            icon={<AddressBookIcon />}
            label="Address Book"
            to="/address-book"
          />

          <MenuItem icon={<GearIcon />} label="Settings" to="/settings" />
          <MenuItem icon={<HelpIcon />} label="Help" to="/help" />
          <MenuItem
            icon={<FeedbackIcon />}
            label="Share Feedback"
            target="_blank"
            to={`mailto:umami-support@trili.tech?subject=Umami V2 feedback&body=${feedbackEmailBodyTemplate}`}
          />
          <AppVersion marginTop="24px" fontSize="14px" />
        </Box>
      </Flex>
    </Flex>
  );
};

const MenuItem: React.FC<
  {
    label: string;
    icon: JSX.Element;
    to: string;
    target?: string;
  } & FlexProps
> = ({ icon, target, label, to, ...flexProps }) => {
  const currentLocation = useLocation();
  // TODO: check if there are named routes in react-router-dom
  const isSelected = currentLocation.pathname.startsWith(to);

  return (
    <Link rel="noopener noreferrer" target={target} to={to}>
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
