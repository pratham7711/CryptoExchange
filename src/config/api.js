import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export const CoinList = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const SingleCoin = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`; 

export const ExchangeRate = ()=>
 `https://api.apilayer.com/exchangerates_data/convert?to=INR&from=USD&amount=1`



//  export const defaultPortfolio = async(exchange)=>{
//   console.log("hi");
//   console.log(exchange);
//   const data ={'bal':{'usd':10000 , 'inr':exchange*10000},'holdings':{}};
//   console.log(data);
//   // const portfolioRef = collection(db, "portfolio");
//   // await addDoc(portfolioRef, 
//     // data);
//     // console.log("hi2");
  
//     const portfolioRef = await addDoc(collection(db,"portfolio") , 
//     data)
//   console.log(portfolioRef.id);
//  }