import { Box, Flex, Link } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useAddPeer, useBuyTezUrl, useCurrentAccount } from "@umami/state";

import { SendTezButton } from "./SendTezButton";
import { ArrowDownLeftIcon, QRCodeIcon, WalletIcon } from "../../assets/icons";
import { AccountInfoModal } from "../AccountSelectorModal";
import { IconButtonWithText } from "../IconButtonWithText";
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";
import { useOnWalletConnect } from "../WalletConnect";

export const AccountButtons = () => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount()!;
  const address = currentAccount.address.pkh;
  const buyTezUrl = useBuyTezUrl(address);
  const isVerified = useIsAccountVerified();
  const onBeaconConnect = useAddPeer();
  const onWalletConnect = useOnWalletConnect();

  return (
    <Box data-testid="account-buttons" paddingX="12px">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        marginTop={{ base: "20px", md: "40px" }}
      >
        <IconButtonWithText
          as={Link}
          pointerEvents={isVerified ? "auto" : "none"}
          href={isVerified ? buyTezUrl : ""}
          icon={WalletIcon}
          isDisabled={!isVerified}
          isExternal
          label="Buy"
          variant="iconButtonSolid"
        />
        <Flex gap="24px">
          <IconButtonWithText
            icon={QRCodeIcon}
            isDisabled={!isVerified}
            label="Connect"
            onClick={() =>
              navigator.clipboard
                .readText()
                .then(payload =>
                  payload.startsWith("wc:") ? onWalletConnect(payload) : onBeaconConnect(payload)
                )
            }
            variant="iconButtonSolid"
          />
          <IconButtonWithText
            icon={ArrowDownLeftIcon}
            isDisabled={!isVerified}
            label="Receive"
            onClick={() => openWith(<AccountInfoModal account={currentAccount} />)}
            variant="iconButtonSolid"
          />
          <SendTezButton />
        </Flex>
      </Flex>
    </Box>
  );
};
