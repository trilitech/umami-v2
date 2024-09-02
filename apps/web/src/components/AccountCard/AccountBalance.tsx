import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount, useGetAccountBalance, useGetDollarBalance } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";

import { SendTezButton } from "./SendTezButton";
import { ArrowDownLeftIcon, WalletIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountInfoModal } from "../AccountSelectorModal";
import { IconButtonWithText } from "../IconButtonWithText";
import { useIsAccountVerified } from "../Onboarding/useIsAccountVerified";

export const AccountBalance = () => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount()!;
  const address = currentAccount.address.pkh;
  const balance = useGetAccountBalance()(address);
  const usdBalance = useGetDollarBalance()(address);
  const isVerified = useIsAccountVerified();

  const buyTezUrl = `https://widget.wert.io/default/widget/?commodity=XTZ&address=${address}&network=tezos&commodity_id=xtz.simple.tezos`;

  return (
    <Box data-testid="account-balance" paddingX="12px">
      <Flex flexDirection="column" gap="4px">
        <Text
          display={{
            base: "none",
            lg: "block",
          }}
          color={color("600")}
          fontWeight="600"
          size="sm"
        >
          Tez Balance
        </Text>
        {balance !== undefined && (
          <Text color={color("900")} fontWeight="600" data-testid="tez-balance" size="2xl">
            {prettyTezAmount(balance)}
          </Text>
        )}
        {usdBalance !== undefined && (
          <Text color={color("700")} data-testid="usd-balance" size="sm">
            {`$${usdBalance}`}
          </Text>
        )}
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        marginTop={{ base: "20px", lg: "40px" }}
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
