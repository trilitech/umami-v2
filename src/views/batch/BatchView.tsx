import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { TfiNewWindow } from "react-icons/tfi";
import CSVFileUploader from "../../components/CSVFileUploader";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { navigateToExternalLink } from "../../utils/helpers";
import { useGetBestSignerForAccount, useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useConfirmation } from "../../utils/hooks/confirmModal";
import { useAppDispatch, useAppSelector } from "../../utils/redux/hooks";
import { useSendFormModal } from "../home/useSendFormModal";
import { BatchDisplay } from "./BatchDisplay";
import NoItems from "../../components/NoItems";
import { makeFormOperations } from "../../components/sendForm/types";
import { useClearBatch } from "../../utils/hooks/assetsHooks";

export const FilterController: React.FC<{ batchPending: number }> = props => {
  return (
    <Flex alignItems="center" mb={4} mt={4}>
      <Heading size="sm" color="umami.green" flex={1}>
        {props.batchPending} Pending
      </Heading>
      <CSVFileUploader />
      <IconAndTextBtn
        ml={4}
        icon={TfiNewWindow}
        label="See file specs"
        color={colors.gray[400]}
        _hover={{
          color: colors.gray[300],
        }}
        onClick={() => {
          navigateToExternalLink(
            "https://github.com/trilitech/umami-v2/blob/main/doc/Batch-File-Format-Specifications.md"
          );
        }}
      />
    </Flex>
  );
};

const BatchView = () => {
  const batches = useAppSelector(s => s.assets.batches);

  const dispatch = useAppDispatch();
  const getAccount = useGetOwnedAccount();
  // TODO: allow user to select signer for multisig
  const getSigner = useGetBestSignerForAccount();
  const clearBatch = useClearBatch();

  const { onOpen: openSendForm, modalElement: sendFormModalEl } = useSendFormModal();
  const { onOpen, element, onClose } = useConfirmation();

  const batchEls = Object.entries(batches).map(([pkh, operations]) => {
    const account = getAccount(pkh);

    const onConfirm = () => {
      dispatch(clearBatch(account));
      onClose();
    };

    return operations && operations.length > 0 ? (
      <BatchDisplay
        onSend={() =>
          openSendForm({
            sender: account.address.pkh,
            mode: {
              type: "batch",
              data: makeFormOperations(account, getSigner(account), operations),
            },
          })
        }
        onDelete={() =>
          onOpen({
            onConfirm,
            body: "Are you sure you want to delete the batch?",
          })
        }
        key={account.address.pkh}
        account={account}
        operations={operations}
      />
    ) : null;
  });

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Batch" />
      <FilterController batchPending={batchEls.length} />
      <Box overflowY="auto" minH="80%">
        {batchEls.length === 0 ? (
          <NoItems
            text="Your batch is currently empty"
            primaryText="Start a Batch"
            secondaryText="Load CSV file"
          />
        ) : (
          batchEls
        )}
      </Box>
      {sendFormModalEl}
      {element}
    </Flex>
  );
};

export default BatchView;
