import React, { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../firebase";
// import axios from "axios";
import { CoinList, ExchangeRate } from "../config/api";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const Crypto = createContext();

const CryptoContext = (props) => {
  const [currency, setcurrency] = useState("INR");
  const [symbol, setsymbol] = useState("Rs");
  const [coins, setCoins] = useState([]);
  const axios = require('axios');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [exchange , setExchange] = useState(81.82);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [watchlist, setWatchlist] = useState([]);
  const [portfolio , setPortfolio] = useState({});

  const config = {
    headers: { 'apikey': 'EX7BuCjRrI20rrEZR88885cPb30hf1Jd' }
  };
  const url = ExchangeRate();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const { data } = await axios.get(url,config);
      // console.log(data);
      setExchange(data.info.rate);
    };
    fetchExchangeRate();  

  }, [])
  // console.log(exchange);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else setUser(null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user.uid);
      // console.log(coinRef); 
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          console.log(coin);
          setWatchlist(coin.data().coins);
        } else {
          // console.log("No Items in watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);
// console.log(portfolio);
  useEffect(() => {
    if (user) {
      const portfolioRef = doc(db, "portfolio", user.uid);
      console.log(portfolioRef); 
      var unsubscribe = onSnapshot(portfolioRef, (portf) => {
        if (portf.exists()) {
          // console.log(portf.data());
          setPortfolio(portf.data());
        } else {
          setPortfolio({"bal":{"usd":10000 , "inr":(exchange*10000)},"holdings":{}})}
      });
      // console.log(portfolio);
      return () => {
        unsubscribe();
      };
    }
  }, [user]);


  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currency === "INR") setsymbol("Rs");
    else if (currency === "USD") setsymbol("$");
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        setcurrency,
        coins,
        loading,
        fetchCoins,
        alert,
        setAlert,
        user,
        watchlist,
        portfolio,
        setPortfolio,
        exchange,
      }}
    >
      {props.children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
