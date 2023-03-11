import React, { useEffect, useState } from "react";
import classes from "./CoinsTable.module.css";
import { CryptoState } from "../store/CryptoContext";
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
  TextField,
  Typography,
  Pagination,
} from "@mui/material";
import { numberWithCommas } from "./Banner/Carousel";
import { useNavigate } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const CoinsTable = () => {
  const navigate = useNavigate(); 
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1)
  const { currency, symbol , coins , loading , fetchCoins} = CryptoState();


  // console.log(coins);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };
  useEffect(() => {
    fetchCoins();
  }, [currency]);
//  console.log(coins);
//  console.log(page);
  return (
    <ThemeProvider theme={darkTheme}>
      <Container sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: "18px", fontFamily: "Montserrat" }}
        >
          Crypto Currencies By Market Cap
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          sx={{ marginBottom: "20px", width: "100%" }}
          onChange={(e) => {
            if(e.target.value === "")
            {
                window.location.reload(false);
            }
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <TableContainer>
          {loading ? (
            <LinearProgress sx={{ backgroundColor: "aliceblue" }} />
          ) : (
            <Table>
              <TableHead sx={{ backgroundColor: "aliceblue" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      sx={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Coin" ? "inherit" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(4))}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination 
        count={+(handleSearch().length/10).toFixed(0)} 
        sx ={{padding:"20px" , display : "flex" , width : "100%" ,justifyContent:"center"}}
        onChange = {(_ ,value)=>{
          //first argument onChange given by object is the event object second is value
          setPage(value);
          window.scroll(0,450);
        }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
