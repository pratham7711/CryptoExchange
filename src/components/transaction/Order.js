import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { CryptoState } from "../../store/CryptoContext";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const Order = ({ orderType, coin, handleClose }) => {
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const { currency, setAlert, portfolio, user, exchange, setPortfolio } =
    CryptoState();

  console.log(portfolio);
  const cbal = portfolio.bal;
  console.log(cbal, coin);
  const dcoin = portfolio.holdings[coin.name]
    ? portfolio.holdings[coin.name]
    : false;
  let cqnt = 0,
    camt = 0;

  if (dcoin) {
    cqnt = dcoin.quantity;
    camt = dcoin.invested;
  }

  const validOrder = () => {
    if (orderType === 1) {
      if (cbal[currency.toLowerCase()] < amount) {
        return "INSUFFICIENT_BALANCE";
      }
    } else if (orderType === -1) {
      if (camt < amount) {
        return "INSUFFICIENT_BALANCE";
      } else if (cqnt < quantity) {
        return "INSUFFICIENT_QUANTITY";
      }
    }

    return "SUCCESS";
  };

  const handleSubmit = async () => {
    const check = validOrder();
    if (check === "INSUFFICIENT_QUANTITY") {
      setAlert({
        open: true,
        message: `You cannot sell more than you have`,
        type: "error",
      });
    } else if (check === "INSUFFICIENT_BALANCE") {
      setAlert({
        open: true,
        message: `You cannot buy more than balance you own`,
        type: "error",
      });
    } 
    else if (check === "SUCCESS") {
      const updateBalance = {
        [currency.toLowerCase()]: (orderType === 1) ? cbal[currency.toLowerCase()] - amount:cbal[currency.toLowerCase()] + amount ,
        [currency.toLowerCase() === "usd" ? "inr" : "usd"]:
          (currency.toLowerCase() === "usd")
            ?((orderType === 1)? (cbal["inr"] - amount*exchange) : (cbal["inr"] + amount*exchange))
            :((orderType === 1)? (cbal["usd"] - amount / exchange) : (cbal["usd"] + amount/ exchange)),
      };
      const PortfolioRef = doc(db, "portfolio", user.uid);

      const hold = portfolio.holdings;

      if (coin.name in hold) {
        
        if(orderType === 1){
        hold[coin.name].quantity += quantity;
        hold[coin.name].invested[currency.toLowerCase()]+=amount;
        hold[coin.name].invested[currency.toLowerCase() === "usd" ? "inr" : "usd"] += ((currency.toLowerCase() === "usd" ? "inr" : "usd")? amount*exchange : amount/exchange);  
        }
        else if(orderType === -1)
        {
          hold[coin.name].quantity -= quantity;
          hold[coin.name].invested[currency.toLowerCase()] = coin.market_data.current_price[currency.toLowerCase()]*hold[coin.name].quantity;
          hold[coin.name].invested[currency.toLowerCase() === 'usd'?'inr':'usd'] = coin.market_data.current_price[currency.toLowerCase()==='usd'?'inr':'usd']*hold[coin.name].quantity;
        }
      } else {
        hold[coin.name] = { name : coin.name ,id: coin.id, quantity: quantity, invested: {
          [currency.toLowerCase()]:amount,
          [currency.toLowerCase() === 'usd'?'inr':'usd']:currency.toLowerCase() === 'usd'
          ? amount * exchange
          : amount / exchange,
        } };
      }

      for (const [key, value] of Object.entries(hold)) {
        if (value.quantity === 0) {
          delete hold[key];
        }
      }

      console.log(updateBalance, hold);
      try {
        await setDoc(
          PortfolioRef,
          { bal: updateBalance, holdings: hold },
          { merge: true }
        );

        setAlert({
          open: true,
          message: `${coin.name} ${orderType === 1 ? 'Bought' : 'Sold'} successfully!`,
          type: "success",
        });
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      }

      setAmount("");
      setQuantity("");
    }
    handleClose();
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3>{`Total Quantity you already have: ${cqnt.toFixed(4)}`}</h3>

      <TextField
  variant="outlined"
  type="number"
  label="Enter quantity"
  InputLabelProps={{ shrink: true }}
  value={quantity}
  onChange={(e) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setQuantity('');
      setAmount('');
    } else {
      setQuantity(+value);
      setAmount(+value * coin.market_data.current_price[currency.toLowerCase()]);
    }
  }}
  fullWidth
/>

      <TextField
        variant="outlined"
        type="number"
        label="Amount"
        value={amount}
        disabled
        InputLabelProps={{ shrink: true }}
        onChange={(e) => {
          setAmount(+e.target.value.toFixed(4));
          setQuantity(
            e.target.value.toFixed(4) /
              coin.market_data.current_price[currency.toLowerCase()]
          );
        }}
        fullWidth
      />


      <Button
        variant="contained"
        size="large"
        sx={{ backgroundColor: orderType === 1 ? "green" : "red" }}
        onClick={() => {
          handleSubmit(orderType, amount, quantity);
        }}
      >
        {orderType === 1 ? "Buy" : "Sell"}
      </Button>
    </Box>
  );
};

export default Order;
