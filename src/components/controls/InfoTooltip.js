import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const InfoTooltip = ({ description }) => {
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => <Tooltip {...props}>{description}</Tooltip>}
    >
      <img
        src="/assets/icons/information-circle.svg"
        className="mx-1 clickable"
        alt="information"
      />
    </OverlayTrigger>
  );
};

export default InfoTooltip;
