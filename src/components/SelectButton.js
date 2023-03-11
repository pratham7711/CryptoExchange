import React from "react";
import classes from "./SelectedButton.module.css";

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={classes.selectbutton}
      style={{ backgroundColor: selected ? "aliceblue" : "" ,
                color: selected ? "black" : "" ,
                fontWeight : selected ? 700 : 500}}
    >
      {children}
    </span>
  );
};

export default SelectButton;
