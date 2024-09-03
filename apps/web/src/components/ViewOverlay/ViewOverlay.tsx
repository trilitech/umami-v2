import { Box, Icon } from "@chakra-ui/react";

import { CoinIcon, LockIcon, PyramidIcon, WalletIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { useIsAccountVerified } from "../Onboarding/useIsAccountVerified";

type ViewOverlayProps = {
  iconType: "activity" | "earn" | "nfts" | "tokens";
};

export const ViewOverlay = ({ iconType }: ViewOverlayProps) => {
  const color = useColor();
  const isVerified = useIsAccountVerified();

  const getIcon = () => {
    if (!isVerified) {
      return LockIcon;
    } else if (iconType === "activity") {
      return WalletIcon;
    } else if (iconType === "nfts") {
      return PyramidIcon;
    } else if (iconType === "tokens") {
      return CoinIcon;
    }
  };

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      overflow="hidden"
      width="100%"
      height="100%"
      z-index="0"
    >
      <Icon
        as={getIcon()}
        position="absolute"
        top="30%"
        left="-20%"
        width="50%"
        height="auto"
        color={color("50")}
      />
      <Icon
        as={getIcon()}
        position="absolute"
        top="5%"
        left="50%"
        width="20%"
        height="auto"
        color={color("50")}
      />
      <Icon
        as={getIcon()}
        position="absolute"
        top="78%"
        right="5%"
        width="30%"
        height="auto"
        color={color("50")}
      />
    </Box>
  );
};
