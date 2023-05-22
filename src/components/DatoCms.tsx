import { Heading } from "@chakra-ui/react";
import { useState } from "react";
import { request } from "../utils/datocms/request";
import { AllSlideItemsDocument, SlideitemRecord } from "../graphql/generated";

export const DatoCms = () => {
  const [slideItems, setSlideItems] = useState<SlideitemRecord[]>([]);
  const requestSlideItems = async () => {
    const result = await request(AllSlideItemsDocument);
    if (result.allSlideitems.length > 0) {
      setSlideItems(result.allSlideitems as SlideitemRecord[]);
    }
  };
  requestSlideItems();

  return (
    <>
      {slideItems.map((slideItem) => {
        return <Heading>{slideItem.title}</Heading>;
      })}
    </>
  );
};

export default DatoCms;
