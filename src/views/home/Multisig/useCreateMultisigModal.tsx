import {
  Box,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import colors from "../../../style/colors";
import { useStepHistory } from "../../../components/useStepHistory";
import { ImplicitAccount } from "../../../types/Account";
import { useImplicitAccounts } from "../../../utils/hooks/accountHooks";
import { BsArrowLeft } from "react-icons/bs";
import { CreateForm } from "./CreateForm";

export type MultisigFields = {
  name: string;
  owner: string;
  signers: { val: string }[];
  threshold: number;
};

export type InitialStep = { type: "initial"; defaultOwner: ImplicitAccount; data?: MultisigFields };
export type ReviewStep = { type: "review"; data: MultisigFields };
export type SubmitStep = { type: "submit"; data: MultisigFields; fee: string };

export type Step = InitialStep | ReviewStep | SubmitStep;

const ReviewPage: React.FC<{ goToStep: (step: Step) => void; multisigFields: MultisigFields }> = ({
  goToStep,
  multisigFields,
}) => {
  // TODO: complete this
  return <>{JSON.stringify(multisigFields, null, 2)}</>;
};

export const useCreateMultisigModal = () => {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const accounts = useImplicitAccounts();
  const history = useStepHistory<Step>({ type: "initial", defaultOwner: accounts[0] });

  const getStepPage = () => {
    switch (history.currentStep.type) {
      case "initial":
        return <CreateForm goToStep={history.goToStep} currentStep={history.currentStep} />;
      case "review":
        return <ReviewPage goToStep={history.goToStep} multisigFields={history.currentStep.data} />;
      case "submit":
    }
  };

  const onClose = () => {
    history.reset();
    // to clean the form
    delete history.currentStep.data;
    closeModal();
  };

  return {
    element: (
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent bg={colors.gray[900]}>
          <Box>
            {!history.atInitialStep && (
              <Icon
                onClick={history.goBack}
                cursor="pointer"
                w={6}
                h={6}
                ml={3}
                mt={2}
                as={BsArrowLeft}
              />
            )}
            <ModalCloseButton />
          </Box>
          {getStepPage()}
        </ModalContent>
      </Modal>
    ),
    open: onOpen,
  };
};
