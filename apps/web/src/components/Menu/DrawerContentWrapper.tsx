import { Divider, DrawerBody, Flex, Heading } from "@chakra-ui/react";
import { type PropsWithChildren, useRef, useState } from "react";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { DrawerCloseButton } from "../CloseButton";

type DrawerContentWrapperProps = {
  title?: string;
  actions?: React.ReactNode;
};

export const DrawerContentWrapper = ({
  title,
  actions,
  children,
}: PropsWithChildren<DrawerContentWrapperProps>) => {
  const color = useColor();
  const [showHeader, setShowHeader] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;

    if (currentScrollY === 0) {
      setShowHeader(true);
      setScrollDirection(null);
    } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setShowHeader(false);
      setScrollDirection("down");
    } else {
      setShowHeader(true);
      setScrollDirection("up");
    }

    lastScrollY.current = currentScrollY;
  };

  const getHeaderMargin = () => {
    if (scrollDirection === "down") {
      return { base: "59px -36px 0", md: "68px -40px 0" };
    }
    if (scrollDirection === "up") {
      return { base: "36px -36px 0", md: "40px -40px 0" };
    }
    return { base: "36px 0 0", md: "40px 0 0" };
  };

  return (
    <>
      <DrawerBackButton />
      <DrawerCloseButton />
      <DrawerBody
        as={Flex}
        position="relative"
        flexDirection="column"
        onScroll={handleScroll}
        paddingX={{ base: "24px", md: "40px" }}
      >
        <Flex
          position="sticky"
          zIndex={1}
          top={0}
          justifyContent="space-between"
          flexDirection="column"
          margin="0 -40px"
          padding="0 40px"
          paddingTop={{ base: "78px", md: "90px" }}
          background={color("white")}
          boxShadow={scrollDirection ? "0px 4px 10px 0px rgba(0, 0, 0, 0.15)" : "none"}
          transform={showHeader ? "translateY(0)" : "translateY(-75%)"}
          transition="all 0.2s ease-in"
        >
          {title && (
            <Heading color={color("900")} size="2xl">
              {title}
            </Heading>
          )}
          {actions && (
            <>
              {actions}
              <Divider
                width="inherit"
                margin={getHeaderMargin()}
                background={color("100")}
                transition="margin 0.2s ease-in"
              />
            </>
          )}
        </Flex>
        <Flex flexDirection="column" flex="1">
          {children}
        </Flex>
      </DrawerBody>
    </>
  );
};
