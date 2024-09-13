import { Divider } from "@chakra-ui/react";
import { SettingsStore } from "@umami/state";
import { type CoreTypes } from "@walletconnect/types";
import { Fragment, type ReactNode, useMemo, useState } from "react";
import { useSnapshot } from "valtio";

import ModalFooter, { type LoaderProps } from "./ModalFooter";
import ProjectInfoCard from "./ProjectInfoCard";
import RequestModalContainer from "./RequestModalContainer";
import ThreatPrompt from "./ThreatPrompt";
import VerifyInfobox from "./VerifyInfobox";


interface IProps {
  children: ReactNode;
  metadata: CoreTypes.Metadata;
  onApprove: () => void;
  onReject: () => void;
  intention?: string;
  infoBoxCondition?: boolean;
  infoBoxText?: string;
  approveLoader?: LoaderProps;
  rejectLoader?: LoaderProps;
  disableApprove?: boolean;
  disableReject?: boolean;
}
export default function RequestModal({
  children,
  metadata,
  onApprove,
  onReject,
  approveLoader,
  rejectLoader,
  intention,
  infoBoxCondition,
  infoBoxText,
  disableApprove,
  disableReject,
}: IProps) {
  const { currentRequestVerifyContext } = useSnapshot(SettingsStore.state);
  const isScam = currentRequestVerifyContext?.verified.isScam;
  const [threatAcknowledged, setThreatAcknowledged] = useState(false);

  const threatPromptContent = useMemo(() => (
      <ThreatPrompt
        metadata={metadata}
        onApprove={() => setThreatAcknowledged(true)}
        onReject={onReject}
      />
    ), [metadata, onReject]);

  const modalContent = useMemo(() => (
      <>
        <RequestModalContainer title="">
          <ProjectInfoCard intention={intention} metadata={metadata} />
          <Divider />
          {children}
          <Divider />
          <VerifyInfobox metadata={metadata} />
        </RequestModalContainer>
        <ModalFooter
          approveLoader={approveLoader}
          disableApprove={disableApprove}
          disableReject={disableReject}
          infoBoxCondition={infoBoxCondition}
          infoBoxText={infoBoxText}
          onApprove={onApprove}
          onReject={onReject}
          rejectLoader={rejectLoader}
        />
      </>
    ), [
    approveLoader,
    children,
    infoBoxCondition,
    infoBoxText,
    intention,
    metadata,
    onApprove,
    onReject,
    rejectLoader,
    disableApprove,
    disableReject,
  ]);
  return <Fragment>{isScam && !threatAcknowledged ? threatPromptContent : modalContent}</Fragment>;
}
