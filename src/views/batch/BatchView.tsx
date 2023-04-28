import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { TfiNewWindow } from "react-icons/tfi";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import { useGetAccount } from "../../utils/hooks/accountHooks";
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
      <IconAndTextBtn icon={HiOutlineDocumentDownload} label="Load CSV file" />
      <IconAndTextBtn ml={4} icon={TfiNewWindow} label="See file specs" />
    </Flex>
  );
};

const useConfirmation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onConfirmRef = useRef(() => {});

  return {
    element: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent bg="umami.gray.900">
          <ModalCloseButton />
          <ModalHeader textAlign={"center"}>Confirmation</ModalHeader>
          <ModalBody>Are you sure you want to delete the batch?</ModalBody>
          <ModalFooter>
            <Button onClick={() => onConfirmRef.current()} bg="umami.blue">
              Confirm
            </Button>
            <Button onClick={onClose} ml={2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
    onClose,
    onOpen: (onConfirm: () => void) => {
      onConfirmRef.current = onConfirm;
      onOpen();
    },
  };
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
        onDelete={() => onOpen(onConfirm)}
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
