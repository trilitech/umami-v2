import { PermissionRequestOutput } from "@airgap/beacon-wallet";
import {
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import React from "react";

const PermissionRequest: React.FC<{
  request: PermissionRequestOutput;
}> = ({ request }) => {
  return (
    <ModalContent>
      <ModalHeader>
        Permission Request from {request.appMetadata.name}
      </ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <AspectRatio width={"100%"} ratio={1}>
          <Image width="100%" height={40} src={request.appMetadata.icon} />
        </AspectRatio>
      </ModalBody>

      <ModalFooter>hello</ModalFooter>
    </ModalContent>
  );
};

export default PermissionRequest;
