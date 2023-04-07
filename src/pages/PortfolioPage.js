import React, { useState, useEffect } from 'react';
import classes from './Portfolio.module.css';
import Investment from '../components/Portfolio/Investment';
import Holdings from '../components/Portfolio/Holdings';
import { CryptoState } from '../store/CryptoContext';
import axios from 'axios';
import { SingleCoin } from '../config/api';
import { LinearProgress } from '@mui/material';

const PortfolioPage = () => {
  const { portfolio, currency , exchange} = CryptoState();
  const [invested, setInvested] = useState(0);
  const [currvalue, setCurrValue] = useState(0);
  const [info , setInfo] = useState({});
  const [state , setState] = useState(0);
  let holdings = {...portfolio.holdings};

  useEffect(() => {
    setInvested(0);
    setCurrValue(0);
    
    if (portfolio.holdings) {
      Object.values(portfolio.holdings).forEach(async (holding) => {
        setInvested((prevInvested) => prevInvested + holding.invested[currency.toLowerCase()]);
        let price = await fetchCoin(holding.id);
        setCurrValue((prevCurrValue) => prevCurrValue + holding.quantity * price);
        let mp = {}
        mp[currency.toLowerCase()] = price;
        mp[currency.toLowerCase() === 'usd' ? 'inr' : 'usd'] = currency.toLowerCase() === 'usd' ? price * exchange : price / exchange; 
        holdings[holding.name].marketPrice = mp;
        // console.log(holdings[holding.name]);
      });
    }
    setInfo(holdings);
  }, [portfolio,currency]);
// console.log(holdings);

    // useEffect(()=>{
    //   setState(Math.random());
    // },[currency])

  const fetchCoin = async (id) => {
    const { data } = await axios.get(SingleCoin(id));
    return data.market_data.current_price[currency.toLowerCase()];
  };
  
  // console.log(info);
  return (
    <div className={classes.body}>
      <Investment state = {state} invested={invested} currvalue={currvalue} />
      { Object.keys(info).length && <Holdings state={state} data={info}  />}
    </div>
  );
};

export default PortfolioPage;
