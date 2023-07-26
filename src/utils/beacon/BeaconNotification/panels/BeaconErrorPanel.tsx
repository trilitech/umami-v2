import React from "react";

const BeaconErrorPanel: React.FC<{ message: string }> = ({ message }) => {
  return <div>{message}</div>;
};

export default BeaconErrorPanel;
