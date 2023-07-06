import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { UpsertContactModal } from "../../components/ContactModal";
import { Contact } from "../../types/Contact";
import { useGetImplicitAccount } from "../../utils/hooks/accountHooks";
import { contactsActions } from "../../utils/store/contactsSlice";

type Options = {
  title: string;
  buttonText: string;
  contact?: Contact;
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
  const [options, setOptions] = useState<Options | undefined>(undefined);

  return {
    modalElement: options && (
      <UpsertContactModal
        title={options.title}
        buttonText={options.buttonText}
        contact={options?.contact}
        onSubmitContact={onSubmitContact}
        isOpen={isOpen}
        onClose={onClose}
      />
    ),
    onOpen: (options: Options) => {
      setOptions(options);
      onOpen();
    },
  };
};
