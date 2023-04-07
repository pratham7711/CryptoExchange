import { AppBar, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { ThemeProvider, createTheme} from "@mui/material/styles";
import { Container } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import { CryptoState } from "../store/CryptoContext";
import AuthModal from "./Authentication/AuthModal";
import SideBar from "./Authentication/SideBar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const title = {
  flex : 1 ,
  color : "aliceblue",
  fontFamily : 'Montserrat',
  fontWeight: 'bold',
  cursor : 'pointer'
};

const Header = () => {

  const {currency , setcurrency , user , portfolio} = CryptoState();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar  sx={{display: 'flex' , justifyContent : 'space-between' }} >
            <Link to="/homepage">
              <Typography sx={title} variant="h6">
                Coin<span style={{color:'orange'}}>Hub</span>
              </Typography>
            </Link>
            <div style={{display:'flex' , height:'100%' , width:'30%' , justifyContent:'space-around' }}>
            <Select
              variant="outlined"
              sx={{ width: 100, height: 40}}
              value={currency}
              onChange={(e) => setcurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>
            {user ? <SideBar></SideBar>:<AuthModal />}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;