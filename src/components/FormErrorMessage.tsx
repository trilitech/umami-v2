import {
  FormErrorMessageProps,
  Icon,
  FormErrorMessage as OriginalFormErrorMessage,
} from "@chakra-ui/react";
import colors from "../style/colors";
import ExclamationIcon from "../assets/icons/Exclamation";

export const FormErrorMessage = ({ children, ...props }: FormErrorMessageProps) => {
  return (
    <OriginalFormErrorMessage color={colors.orange} fontSize="12px" {...props}>
      <Icon as={ExclamationIcon} marginRight="6px" />
      {children}
    </OriginalFormErrorMessage>
  );
};
