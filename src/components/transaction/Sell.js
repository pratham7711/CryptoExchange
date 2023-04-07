import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { AppBar } from "@mui/material";
import classes from "./SideBar.module.css";
// import { auth } from "../../firebase";
import { CryptoState } from "../../store/CryptoContext";
import Order from "./Order";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Buy({coin}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const { portfolio , setAlert} = CryptoState();



  return (
    <div className={classes.button}>
      <Button
        onClick={handleOpen}
        sx={{
          height: 40,
          backgroundColor: 'red',
          color: "aliceblue",
        }}
        fullWidth
      >
        Sell
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AppBar
            position="static"
            style={{ backgroundColor: "tranparent", color: "white" }}
          >
          </AppBar>
            <Order handleClose={handleClose} orderType = {-1} coin = {coin}/>
            <Box className={classes.google}>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
