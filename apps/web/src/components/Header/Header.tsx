import { Card, Icon, SlideFade, useBreakpointValue } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";
import { useEffect, useState } from "react";

import { Actions } from "./Actions";
import { LogoLightIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountSelectorModal } from "../AccountSelectorModal";
import { AccountTile } from "../AccountTile";

export const Header = () => {
  const color = useColor();
  const currentAccount = useCurrentAccount()!;
  const { openWith } = useDynamicModalContext();

  const [isVisible, setIsVisible] = useState(false);

  const size = useBreakpointValue({
    base: {
      width: "42px",
      height: "42px",
    },
    md: {
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
      padding={{ base: "6px 12px", md: "10px 20px" }}
      borderRadius={{ base: 0, md: "100px" }}
      boxShadow={{
        base: "0px 4px 10px 0px rgba(45, 55, 72, 0.06)",
        md: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
      }}
    >
      <Icon as={LogoLightIcon} {...size} />
      <SlideFade in={isVisible} offsetY="20px" unmountOnExit>
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
