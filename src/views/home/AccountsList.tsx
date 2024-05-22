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

export const AccountsList = () => {
  const accounts = useAllAccounts();
  const accountsByKind = groupBy(accounts, getAccountGroupLabel);
  const { openWith } = useContext(DynamicModalContext);

  const accountTiles = Object.entries(accountsByKind).map(([accountGroupLabel, accountsByType]) => (
    <AccountGroup
      key={accountGroupLabel}
      accounts={accountsByType}
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
              margin="20px"
              color={colors.gray[400]}
              textAlign="center"
            >
              <KeyIcon marginRight="4px" />
              Create New Multisig
            </Text>
          </Button>
        </NestedScroll>
      </Box>
    </>
  );
};
