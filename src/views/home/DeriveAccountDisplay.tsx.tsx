import { useState } from "react";

import { EnterPassword } from "../../components/Onboarding/masterPassword/password/EnterPassword";
import { NameAccountDisplay } from "../../components/Onboarding/nameAccount/NameAccountDisplay";

export const DeriveAccountDisplay = (props: {
  onSubmit: (args: { name: string; password: string }) => void;
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}) => {
  const [name, setName] = useState<string>();

  if (name === undefined) {
    return (
      <NameAccountDisplay
        onSubmit={p => setName(p.accountName)}
        subtitle={props.subtitle}
        title={props.title}
      />
    );
  }

  return (
    <EnterPassword
      isLoading={props.isLoading}
      onSubmit={p => props.onSubmit({ name, password: p })}
    />
  );
};
