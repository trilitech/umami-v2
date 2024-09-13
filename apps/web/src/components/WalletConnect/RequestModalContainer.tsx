import { Card, ModalBody, ModalHeader } from "@chakra-ui/react";
import { Fragment, type ReactNode } from "react";

/**
 * Types
 */
interface IProps {
  title?: string;
  children: ReactNode | ReactNode[];
}

/**
 * Component
 */
export default function RequestModalContainer({ children, title }: IProps) {
  return (
    <Fragment>
      {title ? (
        <ModalHeader>
          <h3>{title}</h3>
        </ModalHeader>
      ) : null}
      <ModalBody>
        <Card>{children}</Card>
      </ModalBody>
    </Fragment>
  );
}
