import { DrawerBody, DrawerContent, Flex, Heading } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { DrawerCloseButton } from "../CloseButton";

type DrawerContentWrapperProps = {
  title?: string;
};

export const DrawerContentWrapper = ({
  title,
  children,
}: PropsWithChildren<DrawerContentWrapperProps>) => {
  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <DrawerCloseButton />
      <DrawerBody as={Flex} flexDirection="column" paddingTop={{ base: "78px", lg: "90px" }}>
        {title && (
          <Heading color={color("900")} size="2xl">
            {title}
          </Heading>
        )}
        {children}
      </DrawerBody>
    </DrawerContent>
  );
};
