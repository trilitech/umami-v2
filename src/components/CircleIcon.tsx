import { Box, Center } from "@chakra-ui/react";
import {
  diamontIcon,
  documentIcon,
  googleIcon,
  usbIcon,
  walletIcon,
} from "./Icons";

const iconMap = {
  diamont: diamontIcon,
  document: documentIcon,
  wallet: walletIcon,
  google: googleIcon,
  usb: usbIcon,
};

export enum SupportedIcons {
  diamont = "diamont",
  document = "document",
  wallet = "wallet",
  google = "google",
  usb = "usb",
}

type Props = {
  icon: SupportedIcons;
  size?: string;
  iconSize?: number | string;
  color?: string;
  onClick?: () => void;
};

export const CircleIcon = ({
  icon,
  size = "58px",
  iconSize = 6,
  color = "umami.gray.400",
  onClick = () => {},
}: Props) => {
  const CompName = iconMap[icon];
  return (
    <Box
      height={size}
      width={size}
      borderRadius={"full"}
      bg={"umami.gray.700"}
      margin={"auto"}
      onClick={onClick}
    >
      <Center h="100%">
        <CompName {...{ color }} />
      </Center>
    </Box>
  );
};
