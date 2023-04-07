import React from "react";
import styles from "./Investment.module.css";
import { CryptoState } from "../../store/CryptoContext";

const Investment = ({ invested, currvalue }) => {
  const { currency , portfolio} = CryptoState();
  // console.log(invested, currvalue);
  const returns = currvalue - invested;
  return (
    <div className={styles.body}>
      <div className={styles.box}>
        <h1>
          <span>{currency.toLowerCase() === "usd" ? "$" : "Rs"}</span>{" "}
          {currvalue.toFixed(2)}{" "}
        </h1>
        <p>Current Value</p>
      </div>
      <div className={styles.box}>
        <p>
          Invested Amount:{" "}
          <span>{currency.toLowerCase() === "usd" ? "$" : "Rs"}</span>{" "}
          {invested}
        </p>
        <br />
        <p>
          Total Returns:{" "}
          <span style={{color : returns > 0 ? 'green' : 'red' }}>{currency.toLowerCase() === "usd" ? "$" : "Rs"}{" "}{returns.toFixed(4)}</span>
        </p>
      </div>
    </div>
  );
};

export default Investment;
