import {
  FormErrorMessageProps,
  Icon,
  FormErrorMessage as OriginalFormErrorMessage,
} from "@chakra-ui/react";

import { ExclamationIcon } from "../assets/icons";
import colors from "../style/colors";

export const FormErrorMessage = ({ children, ...props }: FormErrorMessageProps) => (
  <OriginalFormErrorMessage color={colors.orange} fontSize="12px" {...props}>
    <Icon as={ExclamationIcon} marginRight="6px" />
    {children}
  </OriginalFormErrorMessage>
);
