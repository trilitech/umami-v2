import React from "react";

import { GoogleAuthProps } from "../GoogleAuth";

export const MOCK_GOOGLE_SK = "mockGoogleSK";

export const GoogleAuthMock: React.FC<GoogleAuthProps> = props => {
  return (
    <button
      data-testid="google-auth-button"
      onClick={e => {
        e.preventDefault();

        setTimeout(() => {
          props.onSuccessfulAuth(MOCK_GOOGLE_SK, "mockGoogleEmail");
        });
      }}
    >
      Connect with Google
    </button>
  );
};
