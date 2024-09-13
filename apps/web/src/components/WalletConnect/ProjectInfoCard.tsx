import { Avatar, Link } from "@chakra-ui/react";
import { SettingsStore } from "@umami/state";
import { type SignClientTypes } from "@walletconnect/types";
import { useSnapshot } from "valtio";

import { CheckmarkIcon, PencilIcon, VerifiedIcon } from "../../assets/icons";


/**
 * Types
 */
interface IProps {
  metadata: SignClientTypes.Metadata;
  intention?: string;
}

/**
 * Components
 */
export default function ProjectInfoCard({ metadata, intention }: IProps) {
  const { currentRequestVerifyContext } = useSnapshot(SettingsStore.state);
  const validation = currentRequestVerifyContext?.verified.validation;
  const { icons, name, url } = metadata;

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <div>
          <Avatar size="lg" src={icons[0]} style={{ margin: "auto" }} />
        </div>
      </div>
      <div>
        <div>
          <div data-testid="session-info-card-text">
            <span>{name}</span> <br />
            <h4> wants to {intention ? intention : "connect"}</h4>
          </div>
        </div>
      </div>
      <div>
        <div>
          {validation === "VALID" ? <VerifiedIcon data-testid="session-info-verified" /> : null}
          <Link data-testid="session-info-card-url" href={url} style={{ verticalAlign: "middle" }}>
            {url}
          </Link>
        </div>
      </div>
      {currentRequestVerifyContext?.verified.isScam ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <div style={{ margin: "auto" }}>
            <div>
              <CheckmarkIcon style={{ verticalAlign: "bottom" }} />
              Potential threat
            </div>
          </div>
        </div>
      ) : validation === "UNKNOWN" ? (
        <div>
          <div style={{ margin: "auto" }}>
            <div>
              <PencilIcon style={{ verticalAlign: "bottom" }} />
              Cannot Verify
            </div>
          </div>
        </div>
      ) : validation === "INVALID" ? (
        <div>
          <div style={{ margin: "auto" }}>
            <div>
              <PencilIcon style={{ verticalAlign: "bottom", marginRight: "2px" }} />
              Invalid Domain
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
