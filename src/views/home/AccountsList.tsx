import { Box, Button, Text } from "@chakra-ui/react";
import { compact, groupBy } from "lodash";
import { useContext } from "react";

import { AccountGroup } from "./AccountGroup";
import { getAccountGroupLabel } from "./getAccountGroupLabel";
import { KeyIcon } from "../../assets/icons";
import { DynamicModalContext } from "../../components/DynamicModal";
import { NestedScroll } from "../../components/NestedScroll";
import { NameMultisigFormPage } from "../../components/SendFlow/MultisigAccount/NameMultisigFormPage";
import colors from "../../style/colors";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";
import { useAppSelector } from "../../utils/redux/hooks";

export const AccountsList = () => {
  const accounts = useAllAccounts();
  const mutezBalance = useAppSelector(s => s.assets.balances.mutez);
  const accountsByKind = groupBy(accounts, getAccountGroupLabel);
  const { openWith } = useContext(DynamicModalContext);

  const accountTiles = Object.entries(accountsByKind).map(([accountGroupLabel, accountsByType]) => (
    <AccountGroup
      key={accountGroupLabel}
      accounts={accountsByType}
      balances={mutezBalance}
      groupLabel={accountGroupLabel}
    />
  ));

  return (
    <>
      <Box height="100%" marginRight={0}>
        <NestedScroll>
          {compact(accountTiles)}
          <Button
            width="100%"
            height="90px"
            background={colors.black}
            border="1px dashed"
            borderColor={colors.gray[500]}
            onClick={() => openWith(<NameMultisigFormPage />)}
            variant="outline"
          >
            <Text
              display="block"
              width="100%"
              margin={5}
              color={colors.gray[400]}
              textAlign="center"
            >
              <KeyIcon marginRight={1} stroke={colors.gray[450]} />
              Create New Multisig
            </Text>
          </Button>
        </NestedScroll>
      </Box>
    </>
  );
};
