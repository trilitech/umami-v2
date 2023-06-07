import { useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { UpsertContactModal } from "../../components/ContactModal";
import { Contact } from "../../types/Contact";
import { useGetImplicitAccount } from "../../utils/hooks/accountHooks";
import { contactsActions } from "../../utils/store/contactsSlice";

type Options = {
  title?: string;
  buttonText?: string;
  isEdit?: boolean;
  contactToDisplay?: Contact;
};

const defaultOptions = {
  title: "Add Contact",
  buttonText: "Add to Contact",
};

export const useUpsertContactModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const getAccount = useGetImplicitAccount();
  const onSubmitContact = (newContact: Contact) => {
    if (getAccount(newContact.pkh)) {
      return;
    }
    dispatch(contactsActions.upsert(newContact));
    onClose();
  };
  const optionsRef = useRef<Options>();
  const options = optionsRef.current;

  return {
    modalElement: (
      <UpsertContactModal
        title={options?.title || defaultOptions.title}
        buttonText={options?.buttonText || defaultOptions.buttonText}
        contact={options?.contactToDisplay}
        onSubmitContact={onSubmitContact}
        isEdit={options?.isEdit}
        isOpen={isOpen}
        onClose={onClose}
      />
    ),
    onOpen: (options?: Options) => {
      optionsRef.current = options;
      onOpen();
    },
  };
};
