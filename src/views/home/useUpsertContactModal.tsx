import { useContext } from "react";
import { UpsertContactModal } from "../../components/ContactModal";
import { Contact } from "../../types/Contact";
import { useGetOwnedAccountSafe } from "../../utils/hooks/accountHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import { DynamicModalContext } from "../../components/DynamicModal";

type Options = {
  title: string;
  buttonText: string;
  contact?: Contact;
};

export const useOpenUpsertContactModal = () => {
  const { openWith, onClose } = useContext(DynamicModalContext);
  const dispatch = useAppDispatch();
  const getAccount = useGetOwnedAccountSafe();
  const onSubmitContact = (newContact: Contact) => {
    if (getAccount(newContact.pkh)) {
      return;
    }
    dispatch(contactsActions.upsert(newContact));
    onClose();
  };

  return ({ title, buttonText, contact }: Options) => {
    openWith(
      <UpsertContactModal
        title={title}
        buttonText={buttonText}
        contact={contact}
        onSubmitContact={onSubmitContact}
      />
    );
  };
};
