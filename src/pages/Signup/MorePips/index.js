import React from "react";

import "./MorePips.scss";

//******************************************************************
//*
//* MorePips: function component
//*
//******************************************************************

const MorePips = (props) => {
  const { pipsConfig } = props;
  console.log(pipsConfig);

  const pipArray = pipsConfig.map((pip, index) => {
    return (
      <div
        className={`pip ${pip.current ? "current" : ""} ${
          pip.completed ? "pip-completed" : " "
        }`}
        key={`pip-${index}`}
      />
    );
  });
  return (
    <div className="more-pips">
      <div className="pip-array">{pipArray}</div>
    </div>
  );
};

export default MorePips;
