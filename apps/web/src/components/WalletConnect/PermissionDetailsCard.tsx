import { Card } from "@chakra-ui/react";

type PermissionAction = {
  description: string;
};

interface IProps {
  scope: PermissionAction[];
}

export default function PermissionDetailsCard({ scope }: IProps) {
  return (
    <div>
      <div>
        <h5>Dapp is requesting following permissions</h5>
        {scope.map((action, index) => <Card key={index}>{action.description}</Card>)}
      </div>
    </div>
  );
}
