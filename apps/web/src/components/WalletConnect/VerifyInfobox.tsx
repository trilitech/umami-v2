import { Card } from "@chakra-ui/react";
import { SettingsStore } from "@umami/state";
import { type SignClientTypes } from "@walletconnect/types";
import { useSnapshot } from "valtio";

import { AlertCircleIcon, PencilIcon } from "../../assets/icons";


/**
 * Types
 */
interface IProps {
  metadata: SignClientTypes.Metadata;
}

const baseRowStyle = "border-[0.5px] px-4 py-2 rounded"; // Common base style
const baseContainerStyle = "text-left"; // Text alignment (initial equivalent in Tailwind is 'text-left')
const baseDescriptionStyle = "leading-[20px] text-[15px]"; // Line height and font size

const StyledUnknownRow = `${baseRowStyle} text-yellow-500 border-yellow-500`; // Warning color for text and border
const StyledInvalidRow = `${baseRowStyle} text-red-500 border-red-500`; // Error color for text and border

const StyledUnknownContainer = `${baseContainerStyle}`;
const StyledInvalidContainer = `${baseContainerStyle}`;
const StyledDescription = `${baseDescriptionStyle}`;

/**
 * Components
 */
export default function VerifyInfobox({ }: IProps) {
  const { currentRequestVerifyContext } = useSnapshot(SettingsStore.state);
  const validation = currentRequestVerifyContext?.verified.validation;
  return (
    <div style={{ textAlign: "center" }}>
      {currentRequestVerifyContext?.verified.isScam ? (
        <Card className={StyledUnknownRow}>
          <div style={{ margin: "auto" }}>
            <PencilIcon style={{ verticalAlign: "bottom" }} />
          </div>
          <div style={{ margin: "auto" }}>
            <div>Known secury risk</div>
            <div>
              <Card className={StyledInvalidContainer}>
                <Card className={StyledDescription}>
                  This website is flagged as unsafe by multiple security reports. Leave immediately
                  to protect your assets.
                </Card>
              </Card>
            </div>
          </div>
        </Card>
      ) : validation === "UNKNOWN" ? (
        <Card className={StyledUnknownRow}>
          <div style={{ margin: "auto" }}>
            <AlertCircleIcon style={{ verticalAlign: "bottom" }} />
          </div>
          <div style={{ margin: "auto" }}>
            <div>
              <Card className={StyledUnknownContainer}>Unknown domain</Card>
            </div>
            <div>
              <Card className={StyledUnknownContainer}>
                <Card className={StyledDescription}>
                  This domain cannot be verified. Please check the request carefully before
                  approving.
                </Card>
              </Card>
            </div>
          </div>
        </Card>
      ) : validation === "INVALID" ? (
        <Card className={StyledInvalidRow}>
          <div style={{ margin: "auto" }}>
            <AlertCircleIcon style={{ verticalAlign: "bottom" }} />
          </div>
          <div style={{ margin: "auto" }}>
            <div>
              <>Domain mismatch</>
            </div>
            <div>
              <Card className={StyledInvalidContainer}>
                <Card className={StyledDescription}>
                  This website has a domain that does not match the sender of this request.
                  Approving may lead to loss of funds.
                </Card>
              </Card>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
