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
      width="100%"
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
  );
}
