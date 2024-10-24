import { DrawerBody, Flex, Heading } from "@chakra-ui/react";
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
    <>
      <DrawerBackButton />
      <DrawerCloseButton />
      <DrawerBody
        as={Flex}
        flexDirection="column"
        paddingTop={{ base: "66px", md: "90px" }}
        paddingX={{ base: "24px", md: "40px" }}
      >
        {title && (
          <Heading color={color("900")} size="2xl">
            {title}
          </Heading>
        )}
        {children}
      </DrawerBody>
    </>
  );
};
