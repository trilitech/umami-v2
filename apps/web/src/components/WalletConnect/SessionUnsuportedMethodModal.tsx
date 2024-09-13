import { Button, Divider, ModalFooter } from "@chakra-ui/react";
import { ModalStore } from "@umami/state";
import { Fragment } from "react";

import ProjectInfoCard from "./ProjectInfoCard";
import RequesDetailsCard from "./RequestDetailsCard";
import RequestMethodCard from "./RequestMethodCard";
import RequestModalContainer from "./RequestModalContainer";

export default function SessionUnsuportedMethodModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <div>Missing request data</div>;
  }

  // Get required request data
  const { params } = requestEvent;
  const { chainId, request } = params;

  return (
    <Fragment>
      <RequestModalContainer title="Unsuported Method">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <Divider />

        <RequesDetailsCard chains={[chainId]} protocol={requestSession.relay.protocol} />

        <Divider />

        <RequestMethodCard methods={[request.method]} />
      </RequestModalContainer>
      <ModalFooter>
        <Button color="danger" onClick={ModalStore.close}>
          Close
        </Button>
      </ModalFooter>
    </Fragment>
  );
}
