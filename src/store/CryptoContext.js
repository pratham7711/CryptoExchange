import React, { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../firebase";
import axios from "axios";
import { CoinList } from "../config/api";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const Crypto = createContext();

const CryptoContext = (props) => {
  const [currency, setcurrency] = useState("INR");
  const [symbol, setsymbol] = useState("Rs");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [watchlist, setWatchlist] = useState([]);

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
          console.log(coin.data().coins);
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in watchlist");
        }
      });

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
