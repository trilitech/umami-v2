import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { TfiNewWindow } from "react-icons/tfi";
import CSVFileUploader from "../../components/CSVFileUploader";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { useGetAccount } from "../../utils/hooks/accountHooks";
import { useConfirmation } from "../../utils/hooks/confirmModal";
import assetsSlice from "../../utils/store/assetsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { useSendFormModal } from "../home/useSendFormModal";
import { BatchDisplay } from "./BatchDisplay";

export const FilterController: React.FC<{ batchPending: number }> = (props) => {
  return (
    <Flex alignItems={"center"} mb={4} mt={4}>
      <Heading size="sm" color="umami.green" flex={1}>
        {props.batchPending} Pending
      </Heading>
      <CSVFileUploader />
      <IconAndTextBtn
        ml={4}
        icon={TfiNewWindow}
        label="See file specs"
        color={colors.gray[600]}
        _hover={{
          color: colors.gray[300],
        }}
        onClick={() => {
          window.open(
            "https://github.com/trilitech/umami-v2/blob/main/doc/Batch-File-Format-Specifications.md",
            "_blank"
          );
        }}
      />
    </Flex>
  );
};

const BatchView = () => {
  const batches = useAppSelector((s) => s.assets.batches);

  const dispatch = useAppDispatch();
  const getAccount = useGetAccount();

  const { onOpen: openSendForm, modalElement: sendFormModalEl } =
    useSendFormModal();
  const { onOpen, element, onClose } = useConfirmation();

  const batchEls = Object.entries(batches).map(([pkh, batch]) => {
    const account = getAccount(pkh);

    const onConfirm = () => {
      dispatch(assetsSlice.actions.clearBatch({ pkh }));
      onClose();
    };

    return account && batch && batch.items.length > 0 ? (
      <BatchDisplay
        onSend={() =>
          openSendForm({ mode: { type: "batch", data: { batch } } })
        }
        onDelete={() =>
          onOpen({
            onConfirm,
            body: "Are you sure you want to delete the batch?",
          })
        }
        key={batch.items[0].operation.value.sender}
        account={account}
        batch={batch}
      />
    ) : null;
  });

  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Batch" />
      <FilterController batchPending={batchEls.length} />
      <Box overflow={"scroll"}>
        {batchEls.length === 0 ? (
          <Heading size={"3xl"}>{"Your batch is empty"}</Heading>
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
