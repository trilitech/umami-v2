import "react-responsive-carousel/lib/styles/carousel.min.css";
import { SupportedIcons, CircleIcon } from "./CircleIcon";
import { Box, Text } from "@chakra-ui/react";


export default function SlideItem({
    src,
    text,
    icon
}: {
    src: string;
    text: string;
    icon: SupportedIcons;
}) {
    return (
        <Box
            bg='black'
            paddingBottom={'35px'}
        >
            <Box
                paddingLeft={'50px'}
                paddingRight={'50px'}
                backgroundRepeat={'no-repeat'}
                backgroundPosition={'top'}
                __css={{
                    backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(0, 0, 0, 1)), url(${src})`
                }}
                height='400px'
            >
            </Box>
            <CircleIcon icon={icon} />
            <Text margin={'50px'}>{text}</Text>
        </Box>
    )
}