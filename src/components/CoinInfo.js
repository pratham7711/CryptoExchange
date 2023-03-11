import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2/";
import { HistoricalChart } from "../config/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CryptoState } from "../store/CryptoContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import classes from "./CoinInfo.module.css";
import { CircularProgress } from "@mui/material";
import SelectButton from "./SelectButton";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const chartDays = [
  {
    label: "24 Hours",
    value: 1,
  },
  {
    label: "30 Days",
    value: 30,
  },
  {
    label: "3 Months",
    value: 90,
  },
  {
    label: "1 Year",
    value: 365,
  },
];

const CoinInfo = (props) => {
  const [historicalData, sethistoricalData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();

  const fetchChartData = async () => {
    const data = await axios.get(
      HistoricalChart(props.coin.id, days, currency)
    );
    sethistoricalData(data.data.prices);
  };

  useEffect(() => {
    fetchChartData();
  }, [currency, days]);

  // console.log(historicalData);
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicalData ? (
          <CircularProgress
            sx={{ color: "aliceblue" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days) in ${currency}`,
                    borderColor: "aliceblue",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton key={day.value}
                              onClick={()=>{
                                setDays(day.value);
                              }}
                              selected={day.value === days}>
                {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
