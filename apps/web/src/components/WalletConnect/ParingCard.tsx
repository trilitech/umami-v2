// import { Avatar, Button, Card, CardBody, Link, Tooltip } from "@chakra-ui/react";

// import { TrashIcon } from "../../assets/icons";

// /**
//  * Types
//  */
// interface IProps {
//   logo?: string;
//   name?: string;
//   url?: string;
//   topic?: string;
//   onDelete: () => Promise<void>;
// }

// export function truncate(value: string, length: number) {
//   if (value.length <= length) {
//     return value;
//   }

//   const separator = "...";
//   const stringLength = length - separator.length;
//   const frontLength = Math.ceil(stringLength / 2);
//   const backLength = Math.floor(stringLength / 2);

//   return value.substring(0, frontLength) + separator + value.substring(value.length - backLength);
// }

// /**
//  * Component
//  */
// export default function PairingCard({ logo, name, url, topic, onDelete }: IProps) {
//   return (
//     <Card className="relative mb-6 min-h-[70px]">
//       <CardBody className="flex flex-row items-center justify-between overflow-hidden">
//         <Avatar src={logo} />
//         <div style={{ flex: 1 }}>
//           <h5 data-testid={"pairing-text-" + topic}>{name}</h5>
//           <Link href={url} data-testid={"pairing-text-" + topic}>
//               {truncate(url?.split("https://")[1] ?? "Unknown", 23)}
//           </Link>
//         </div>
//         <Tooltip content="Delete" placement="left">
//           <Button
//             className="m-2.5 mx-auto p-2.5 text-red-500 cursor-pointer color=$error"
//             data-testid={"pairing-delete-" + topic}
//             onClick={onDelete}
//           >
//             <TrashIcon />
//           </Button>
//         </Tooltip>
//       </CardBody>
//     </Card>
//   );
// }
