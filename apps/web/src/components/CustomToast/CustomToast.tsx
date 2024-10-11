import {
  Alert,
  AlertDescription,
  AlertTitle,
  Flex,
  Icon,
  IconButton,
  type UseToastOptions,
} from "@chakra-ui/react";
import { type ReactNode } from "react";

import {
  AlertCircleIcon,
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
} from "../../assets/icons";
import { useColor } from "../../styles/useColor";

type CustomToastProps = {
  onClose: () => void;
} & UseToastOptions;

export const CustomToast = (props: CustomToastProps): ReactNode => {
  const color = useColor();

  const { status, id, title, isClosable, onClose, description } = props;

  const ids = id
    ? {
        root: `toast-${id}`,
        title: `toast-${id}-title`,
        description: `toast-${id}-description`,
      }
    : undefined;

  const AlertIcon = () => {
    switch (props.status) {
      case "info":
        return <AlertCircleIcon />;
      case "success":
        return <CheckCircleIcon />;
      case "error":
        return <AlertTriangleIcon />;
      case "warning":
        return <AlertOctagonIcon />;
      default:
        return null;
    }
  };

  return (
    <Alert alignItems="flex-start" addRole={false} id={ids?.root} status={status}>
      <Icon as={AlertIcon} />
      <Flex flexDirection="column" width="full" marginLeft="6px">
        {title && <AlertTitle id={ids?.title}>{title}</AlertTitle>}
        {description && (
          <AlertDescription marginRight="12px" id={ids?.description}>
            {description}
          </AlertDescription>
        )}
      </Flex>
      {isClosable && (
        <IconButton
          boxSize="24px"
          marginLeft="auto"
          color={color("400")}
          aria-label="Close toast"
          icon={<CloseIcon />}
          onClick={onClose}
          variant="empty"
        />
      )}
    </Alert>
  );
};
