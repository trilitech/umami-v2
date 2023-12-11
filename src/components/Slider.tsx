import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box } from "@chakra-ui/react";
import { CSSProperties, ReactElement } from "react";
import { Carousel } from "react-responsive-carousel";

import colors from "../style/colors";

type Props = {
  children: ReactElement[];
};

export const Slider = ({ children }: Props) => {
  const indicatorStyles: CSSProperties = {
    background: colors.gray[400],
    width: "10px",
    height: "10px",
    display: "inline-block",
    margin: "0 4px 60px 4px",
    borderRadius: "5px",
  };
  return (
    <Box
      backgroundImage="linear-gradient(180deg, rgba(18, 18, 18, 0.00) 36.43%, rgba(18, 18, 18, 0.50) 53.65%, #121212 76.24%)"
      borderRightRadius="30px"
      backgroundColor="#323131"
    >
      <Carousel
        autoPlay={true}
        dynamicHeight={false}
        infiniteLoop={true}
        interval={5000}
        renderIndicator={(onClickHandler, isSelected, index) => {
          if (isSelected) {
            return (
              <li
                style={{
                  ...indicatorStyles,
                  background: "#00C39A",
                  width: "24px",
                }}
              />
            );
          }
          return (
            <li
              key={index}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              role="button"
              style={indicatorStyles}
              tabIndex={0}
              value={index}
            />
          );
        }}
        showArrows={false}
        showStatus={false}
        showThumbs={false}
        transitionTime={1000}
      >
        {children}
      </Carousel>
    </Box>
  );
};
