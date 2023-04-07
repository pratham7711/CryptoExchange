import React, { useState } from 'react'
import classes from "./Investment.module.css";
import { CryptoState } from '../../store/CryptoContext'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container } from "@mui/system";
import {
  LinearProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from "../Banner/Carousel";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Holdings = ({data}) => {
console.log(data);
// const [loading, setLoading] = useState(false);

const {currency , symbol} =  CryptoState();
const navigate = useNavigate(); 

if(Object.keys(data) === 0)
{
  return (
    <LinearProgress sx={{ backgroundColor: "aliceblue" }} />
  )
}

  return (
    <ThemeProvider theme={darkTheme}>
      <Container sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: "18px", fontFamily: "Montserrat" }}
        >
          Your Crypto Holdings
        </Typography>
        
        <TableContainer>
          {
              <Table>
          <TableHead sx={{ backgroundColor: "aliceblue" }}>
                <TableRow>
                  {["Coin", "Market Price", "Invested Value", "Returns"].map((head) => (
                    <TableCell
                    sx={{
                      color: "black",
                      fontWeight: "700",
                      fontFamily: "Montserrat",
                    }}
                    key={head}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Object.values(data)
                  .map((row) => {
                  
                    let name = row.name ? row.name : "COIN";
                    let marketPrice = row.marketPrice ? row.marketPrice[currency.toLowerCase()]: 0;
                    let invested = row.invested ? row.invested[currency.toLowerCase()]: 0;
                    let returns = row.quantity ? row.quantity*marketPrice - invested : 0;
                    // console.log(row);
                    // const profit = row.marketPrice[currency.toLowerCase()] - row.invested[currency.toLowerCase()];
                    return (
                      <TableRow
                      onClick={() => navigate(`/coins/${row.id}`)}
                      className={classes.row}
                      key={row.name}
                      >
                            <TableCell
                          component="th"
                          scope="row"
                          // sx={{
                          //   display: "flex",
                          //   gap: 15,
                          // }}
                        >
                              {row.name}
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(marketPrice.toFixed(3))}
                        </TableCell>
                          <TableCell align="right">
                            {symbol}{" "}
                            {numberWithCommas(invested.toFixed(3))}
                          </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: returns > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {returns > 0 && "+"}
                          {symbol}
                          {returns.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
          </Table>
      }
      </TableContainer>
      </Container>
      </ThemeProvider>
      )
}

export default Holdings