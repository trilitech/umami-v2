import { useState } from "react";
import EnterPassword from "../../components/Onboarding/masterPassword/password/EnterPassword";
import NameAccountDisplay from "../../components/Onboarding/nameAccount/NameAccountDisplay";

const DeriveAccountDisplay = (props: {
  onSubmit: (args: { name: string; password: string }) => void;
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}) => {
  const [name, setName] = useState<string>();

  if (name === undefined) {
    return (
      <NameAccountDisplay
        title={props.title}
        subtitle={props.subtitle}
        onSubmit={p => setName(p.accountName)}
      />
    );
  }

  return (
    <EnterPassword
      onSubmit={p => props.onSubmit({ name, password: p })}
      isLoading={props.isLoading}
    />
  );
};

export default DeriveAccountDisplay;
