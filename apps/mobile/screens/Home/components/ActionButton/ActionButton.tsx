import type React from "react";
import { Button, type ButtonProps, Text, YStack } from "tamagui";

type ActionButtonComponentProps = {
  title: string;
  icon: React.JSX.Element;
} & ButtonProps;

export const ActionButton: React.FC<ActionButtonComponentProps> = ({ title, icon, ...props }) => (
  <YStack alignItems="center">
    <Button
      alignItems="center"
      justifyContent="center"
      height={40}
      borderRadius={100}
      backgroundColor="#E1E1EF"
      icon={icon}
      {...props}
    />
    <Text>{title}</Text>
  </YStack>
);
