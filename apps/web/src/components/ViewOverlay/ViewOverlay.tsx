import { Box, Icon } from "@chakra-ui/react";

import { CoinIcon, LockIcon, PercentIcon, PyramidIcon, WalletIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";

type ViewOverlayProps = {
  iconType: "activity" | "earn" | "nfts" | "tokens";
};

const iconMap = {
  activity: WalletIcon,
  earn: PercentIcon,
  nfts: PyramidIcon,
  tokens: CoinIcon,
};

export const ViewOverlay = ({ iconType }: ViewOverlayProps) => {
  const color = useColor();
  const isVerified = useIsAccountVerified();

  const getIcon = () => {
    if (!isVerified) {
      return LockIcon;
    } else {
      return iconMap[iconType];
    }
  };

  const currentColor = color("400");

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      overflow="hidden"
      width="100%"
      height="100%"
      color={currentColor}
      opacity="0.1"
      z-index="0"
    >
      <Icon
        as={getIcon()}
        position="absolute"
        top="20%"
        left="-25%"
        width="clamp(100px, 50%, 487px)"
        height="auto"
      />
      <Icon
        as={getIcon()}
        position="absolute"
        top="5%"
        left="50%"
        width="clamp(100px, 20%, 180px)"
        height="auto"
      />
      <Icon
        as={getIcon()}
        position="absolute"
        top="69%"
        right="5%"
        width="clamp(100px, 30%, 352px)"
        height="auto"
      />
    </Box>
  );
};
