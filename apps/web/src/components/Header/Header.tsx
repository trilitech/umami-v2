import { Card, Icon, IconButton, SlideFade, useBreakpointValue } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";
import { useEffect, useState } from "react";

import { Actions } from "./Actions";
import { FileCopyIcon, LogoLightIcon, SelectorIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountSelectorModal } from "../AccountSelectorModal";
import { AccountTile } from "../AccountTile";
import { CopyButton } from "../CopyButton";

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
      <IconButton
        pointerEvents={{ base: "auto", md: "none" }}
        aria-label="Logo"
        icon={<Icon as={LogoLightIcon} {...size} />}
        onClick={() => {
          scrollTo({ top: 0, behavior: "smooth" });
        }}
        size="xs"
        variant="empty"
      />
      <SlideFade
        in={isVisible}
        offsetY="20px"
        style={{ display: "flex", flex: 1, gap: "8px", justifyContent: "center" }}
        unmountOnExit
      >
        <AccountTile
          background={color("100")}
          account={currentAccount}
          onClick={() => openWith(<AccountSelectorModal />, { canBeOverridden: true })}
          size="xs"
        >
          <IconButton
            alignSelf="center"
            width="fit-content"
            marginLeft="auto"
            aria-label="Account Selector"
            icon={<Icon as={SelectorIcon} boxSize="18px" color={color("400")} />}
            size="xs"
            variant="empty"
          />
        </AccountTile>
        <CopyButton
          width="42px"
          aria-label="Copy Address"
          size="md"
          value={currentAccount.address.pkh}
          variant="iconButtonSolid"
        >
          <Icon as={FileCopyIcon} boxSize="24px" />
        </CopyButton>
      </SlideFade>
      <Actions />
    </Card>
  );
};
