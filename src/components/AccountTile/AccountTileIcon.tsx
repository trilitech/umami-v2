import { memo } from "react";

import {
  EmailIcon,
  FacebookIcon,
  GoogleIcon,
  KeyIcon,
  LedgerIcon,
  RedditIcon,
  TwitterIcon,
} from "../../assets/icons";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { AddressTileIconSize } from "../AddressTile/AddressTileIconSize";
import { Identicon } from "../Identicon";

const SIZES = {
  lg: {
    defaults: {
      width: "48px",
      height: "48px",
      borderRadius: "4px",
    },
    mnemonic: {
      padding: "8px",
      identiconSize: 32,
    },
    ledger: {
      padding: "10px",
    },
    secret_key: {
      padding: "8px",
      identiconSize: 32,
    },
    multisig: {
      padding: "10px",
    },
    social: {
      google: {
        paddingX: "10.28px",
        paddingY: "10px",
      },
      facebook: {
        padding: "9px",
      },
      twitter: {
        paddingX: "12.78px",
        paddingY: "13.5px",
      },
      reddit: {
        padding: "10px",
      },
      email: {
        padding: "10px",
      },
    },
  },
  sm: {
    defaults: {
      width: "30px",
      height: "30px",
      borderRadius: "4px",
    },
    mnemonic: {
      padding: "5px",
      identiconSize: 20,
    },
    ledger: {
      padding: "5px",
    },
    secret_key: {
      padding: "5px",
      identiconSize: 20,
    },
    multisig: {
      padding: "5px",
    },
    social: {
      google: {
        paddingX: "6.425px",
        paddingY: "6.25px",
      },
      facebook: {
        padding: "6px",
      },
      twitter: {
        paddingX: "7.5px",
        paddingY: "8px",
      },
      reddit: {
        padding: "6px",
      },
      email: {
        padding: "6px",
      },
    },
  },
} as const;

/**
 * Displays an icon for an account based on its type.
 *
 * @param account - The account to display the icon for.
 * @param size - The size of the icon.
 */
export const AccountTileIcon: React.FC<{ account: Account; size: AddressTileIconSize }> = memo(
  ({ account, size }) => {
    const sizeObj = SIZES[size];
    const defaults = sizeObj.defaults;

    switch (account.type) {
      case "secret_key":
        return <Identicon address={account.address} {...defaults} {...sizeObj.secret_key} />;
      case "mnemonic":
        return <Identicon address={account.address} {...defaults} {...sizeObj.mnemonic} />;
      case "ledger":
        return <LedgerIcon {...defaults} {...sizeObj.ledger} background={colors.gray[500]} />;
      case "multisig":
        return (
          <KeyIcon
            {...defaults}
            {...sizeObj.multisig}
            stroke={colors.gray[400]}
            background={colors.gray[500]}
          />
        );
      case "social": {
        switch (account.idp) {
          case "google":
            return <GoogleIcon {...defaults} {...sizeObj.social.google} background="white" />;

          case "facebook":
            return <FacebookIcon {...defaults} {...sizeObj.social.facebook} background="white" />;

          case "twitter":
            return <TwitterIcon {...defaults} {...sizeObj.social.twitter} background="white" />;

          case "reddit":
            return <RedditIcon {...defaults} {...sizeObj.social.reddit} background="white" />;

          case "email":
            return (
              <EmailIcon {...defaults} {...sizeObj.social.email} color="black" background="white" />
            );
        }
      }
    }
  }
);
