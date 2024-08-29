import { Card, Icon, SlideFade, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";
import { useEffect, useState } from "react";

import { Actions } from "./Actions";
import { LogoDarkIcon, LogoLightIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountSelectorModal } from "../AccountSelectorModal";
import { AccountTile } from "../AccountTile";

export const Header = () => {
  const color = useColor();
  const colorMode = useColorMode();
  const currentAccount = useCurrentAccount()!;
  const { openWith } = useDynamicModalContext();

  const [isVisible, setIsVisible] = useState(false);

  const size = useBreakpointValue({
    base: {
      width: "42px",
      height: "42px",
    },
    lg: {
      width: "48px",
      height: "48px",
    },
  });

  useEffect(() => {
    const accountTile = document.getElementById("account-tile")!;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 1,
      }
    );

    observer.observe(accountTile);

    return () => {
      observer.unobserve(accountTile);
    };
  }, []);

  return (
    <Card
      justifyContent="space-between"
      flexDirection="row"
      padding={{ base: "6px 12px", lg: "10px 20px" }}
      borderRadius={{ base: 0, lg: "100px" }}
      boxShadow={{
        base: "0px 4px 10px 0px rgba(45, 55, 72, 0.06)",
        lg: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
      }}
    >
      {mode(<Icon as={LogoLightIcon} {...size} />, <Icon as={LogoDarkIcon} {...size} />)(colorMode)}
      <SlideFade in={isVisible} offsetY="20px">
        <AccountTile
          background={color("100")}
          account={currentAccount}
          onClick={() => openWith(<AccountSelectorModal />)}
          size="xs"
        />
      </SlideFade>
      <Actions />
    </Card>
  );
};
