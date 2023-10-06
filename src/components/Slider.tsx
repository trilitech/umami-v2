import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { CSSProperties, ReactElement } from "react";
import colors from "../style/colors";

type Props = {
  children: ReactElement[];
};

export default function Slider({ children }: Props) {
  const indicatorStyles: CSSProperties = {
    background: colors.gray[400],
    width: "10px",
    height: "10px",
    display: "inline-block",
    margin: "0 4px",
    borderRadius: "5px",
  };
  return (
    <Carousel
      showArrows={false}
      infiniteLoop={true}
      autoPlay={true}
      showStatus={false}
      dynamicHeight={false}
      showThumbs={false}
      interval={5000}
      transitionTime={1000}
      width="100%"
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
            style={indicatorStyles}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            value={index}
            key={index}
            role="button"
            tabIndex={0}
          />
        );
      }}
    >
      {children}
    </Carousel>
  );
}
