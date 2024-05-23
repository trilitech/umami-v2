import { Box, Button, Center, Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import React, { ReactNode, useContext } from "react";

import { ExternalLinkIcon, PenIcon, XMarkIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { Account } from "../../../types/Account";
import { prettyTezAmount } from "../../../utils/format";
import {
  useGetAccountDelegate,
  useGetAccountStakedBalance,
} from "../../../utils/hooks/assetsHooks";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { buildTzktUrl } from "../../../utils/tzkt/helpers";
import { AddressPill } from "../../AddressPill/AddressPill";
import { DynamicModalContext } from "../../DynamicModal";
import { ExternalLink } from "../../ExternalLink";
import { FormPage as DelegationFormPage } from "../../SendFlow/Delegation/FormPage";
import { FormPage as StakeFormPage } from "../../SendFlow/Stake/FormPage";
import { FormPage as UndelegationFormPage } from "../../SendFlow/Undelegation/FormPage";
import { FormPage as UnstakeFormPage } from "../../SendFlow/Unstake/FormPage";

const Row: React.FC<
  {
    label: string;
    value: ReactNode;
  } & FlexProps
> = ({ label, value, ...props }) => (
  <Flex alignItems="center" height="50px" padding="16px" data-testid={label} {...props}>
    <Box flex={1}>
      <Heading color={colors.gray[400]} size="sm">
        {label}
      </Heading>
    </Box>
    <Box flex={1}>{value}</Box>
  </Flex>
);

const RoundStatusDot = ({ background }: { background: string }) => (
  <Box
    display="inline-block"
    width="8px"
    height="8px"
    marginRight="5px"
    background={background}
    borderRadius="100%"
  />
);

export const EarnTab: React.FC<{
  account: Account;
}> = ({ account }) => {
  const { openWith } = useContext(DynamicModalContext);
  const network = useSelectedNetwork();
  const pkh = account.address.pkh;
  const delegate = useGetAccountDelegate()(pkh);
  const stakedBalance = useGetAccountStakedBalance()(pkh);

  const openDelegationForm = () =>
    openWith(
      <DelegationFormPage
        form={delegate ? { sender: pkh, baker: delegate.address } : undefined}
        sender={account}
      />
    );

  return (
    <Box>
      <Row
        borderBottom={`1px solid ${colors.gray[700]}`}
        borderTopRadius="8px"
        _odd={{ background: colors.gray[800] }}
        data-testid="staked-balance"
        label="Staked:"
        value={prettyTezAmount(stakedBalance || 0)}
      />
      <Row
        borderBottom={`1px solid ${colors.gray[700]}`}
        _odd={{ background: colors.gray[800] }}
        data-testid="delegation-status"
        label="Delegation:"
        value={
          <Flex justifyContent="space-between">
            {delegate ? (
              <>
                <Center>
                  <RoundStatusDot background={colors.greenL} />
                  <Text size="sm">Active</Text>
                </Center>
                <Button
                  justifyContent="space-between"
                  gap="4px"
                  padding="0"
                  data-testid="end-delegation-button"
                  onClick={() =>
                    openWith(
                      <UndelegationFormPage
                        form={{ sender: pkh, baker: delegate.address }}
                        sender={account}
                      />
                    )
                  }
                  size="sm"
                  variant="CTAWithIcon"
                >
                  <Text display="inline">End</Text>
                  <XMarkIcon stroke="inherit" />
                </Button>
              </>
            ) : (
              <Center>
                <RoundStatusDot background={colors.orangeL} />
                <Text size="sm">Inactive</Text>
              </Center>
            )}
          </Flex>
        }
      />
      <Row
        borderBottomRadius="8px"
        _odd={{ background: colors.gray[800] }}
        label="Baker:"
        value={
          <Flex justifyContent="space-between">
            {delegate ? (
              <>
                <Center>
                  <AddressPill address={delegate} />
                </Center>
                <Button
                  justifyContent="space-between"
                  gap="4px"
                  padding="0"
                  data-testid="change-delegation-button"
                  onClick={openDelegationForm}
                  size="sm"
                  variant="CTAWithIcon"
                >
                  <Text display="inline">Edit</Text>
                  <PenIcon stroke="inherit" />
                </Button>
              </>
            ) : (
              <>
                <Center>
                  <Text color={colors.gray[450]} size="sm">
                    --
                  </Text>
                </Center>
                <ExternalLink href={buildTzktUrl(network, "bakers")}>
                  <Button padding="0" variant="CTAWithIcon">
                    <Text marginRight="7px" size="sm">
                      View Bakers
                    </Text>
                    <ExternalLinkIcon stroke="inherit" />
                  </Button>
                </ExternalLink>
              </>
            )}
          </Flex>
        }
      />
      {/* TODO: add onClick handlers */}
      <Flex justifyContent="space-between" gap="16px" marginTop="24px">
        {delegate ? (
          <>
            <Button
              flex={1}
              isDisabled={!stakedBalance}
              onClick={() =>
                openWith(<UnstakeFormPage sender={account} stakedBalance={stakedBalance || 0} />)
              }
              variant="secondary"
            >
              Unstake
            </Button>
            <Button flex={1} onClick={() => openWith(<StakeFormPage sender={account} />)}>
              Stake
            </Button>
          </>
        ) : (
          <>
            <Button flex={1} onClick={openDelegationForm}>
              Delegate
            </Button>
            <Button flex={1} isDisabled>
              Stake
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};
