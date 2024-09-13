import { Button, Divider, Link } from "@chakra-ui/react";
import { type CoreTypes } from "@walletconnect/types";

import RequestModalContainer from "./RequestModalContainer";
import { PencilIcon } from "../../assets/icons";


interface IProps {
  metadata: CoreTypes.Metadata;
  onApprove: () => void;
  onReject: () => void;
}

const StyledProceedButton = "m-2.5 mx-auto div-2.5 text-red-500 cursor-pointer color=$error";
const StyledCloseButton =
  "m-2.5 mx-auto div-2.5 border-2 border-red-500 rounded-3xl cursor-pointer";

export default function ThreatPrompt({ metadata, onApprove, onReject }: IProps) {
  const { url } = metadata;

  return (
    <RequestModalContainer title="">
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div>
          <div>
            <PencilIcon sx={{ fontSize: "55px", color: "$error" }} color="error" />
          </div>
        </div>
        <div>
          <div>
            <h3>Website flagged</h3>
          </div>
        </div>
        <div>
          <div>
            <Link
              data-testid="session-info-card-url"
              href={url}
              style={{ verticalAlign: "middle" }}
            >
              <span>{url}</span>
            </Link>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Divider />
          <div>
            This website you`re trying to connect is flagged as malicious by multiple security
            providers. Approving may lead to loss of funds.
          </div>
          <div>
            <Button className={StyledProceedButton} onClick={onApprove}>
              Proceed anyway
            </Button>
          </div>
          <div>
            <div onClick={onReject} style={{ margin: "auto", cursor: "pointer" }}>
              <Button className={StyledCloseButton}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </RequestModalContainer>
  );
}
