import React from "react";
import { GoogleAuthProps } from "../GoogleAuth";

export const MOCK_GOOGLE_SK = "mockGoogleSK";

export const GoogleAuthMock: React.FC<GoogleAuthProps> = (props) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();

        setTimeout(() => {
          props.onReceiveSk(MOCK_GOOGLE_SK);
        });
      }}
    >
      {props.buttonText || "connect with google"}
    </button>
  );
};
