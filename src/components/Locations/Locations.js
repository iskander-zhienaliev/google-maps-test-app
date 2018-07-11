import React from "react";
let style = require("./style.scss");

const Locations = props => {
  const { locations, onClick } = props;
  const location = locations.map((loc, i) => (
    <div className={style.wrap} key={i}>
      <li className={style.location}>{loc}</li>
      <button onClick={e => props.removeItem(i)} className={style.btn} />
    </div>
  ));
  return (
    <div>
      <ul className={style.list}>{location}</ul>
    </div>
  );
};

export default Locations;
