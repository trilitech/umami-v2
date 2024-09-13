import { Card, Divider } from "@chakra-ui/react";
import { ModalStore } from "@umami/state";
import { useSnapshot } from "valtio";

import RequestModalContainer from "./RequestModalContainer";


export default function LoadingModal() {
  const state = useSnapshot(ModalStore.state);
  const message = state.data?.loadingMessage;

  return (
    <RequestModalContainer title="">
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div>
          <div>
            <h3>Loading your request...</h3>
          </div>
        </div>
        {message ? (
          <div style={{ textAlign: "center" }}>
            <Divider />
            <Card>{message}</Card>
          </div>
        ) : null}
      </div>
    </RequestModalContainer>
  );
}
