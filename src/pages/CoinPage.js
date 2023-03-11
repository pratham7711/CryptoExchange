import { Button, LinearProgress, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { numberWithCommas } from "../components/Banner/Carousel";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../store/CryptoContext";
import classes from "./CoinPage.module.css";
import ReactHtmlParser from "react-html-parser";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));

    setCoin(data);
  };

  const inWatchlist = watchlist.includes(id);
  console.log(inWatchlist);

  const addToWatchList = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    console.log(coinRef);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, id] : [id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchList = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    console.log(coinRef);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish)=> wish !== id)},
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };


  useEffect(() => {
    fetchCoin();
  }, [currency]);

  if (!coin)
    return <LinearProgress sx={{ background: "white" }}></LinearProgress>;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img src={coin.image.large} alt={coin.name} />
        <Typography variant="h3" className={classes.heading}>
          {coin.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(coin.description.en.split(". ")[0])}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Montserrat",
              }}
            >
              {numberWithCommas(coin.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
          {user && (
            <div>
              <Button
                variant="outlined"
                onClick={inWatchlist ? removeFromWatchList : addToWatchList}
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: 20,
                  backgroundColor: inWatchlist ? "aliceblue" : "gray",
                }}
              >
                {inWatchlist ? "Remove from watchlist" : "Add to Watchlist"}
              </Button>
              <>
                <Button
                  variant="outlined"
                  style={{
                    width: "50%",
                    height: 40,
                    marginTop: 20,
                    backgroundColor: "green",
                    color: "aliceblue",
                  }}
                >
                  Buy
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    width: "50%",
                    height: 40,
                    marginTop: 20,
                    backgroundColor: "red",
                    color: "aliceblue",
                  }}
                >
                  Sell
                </Button>
              </>
            </div>
          )}
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
