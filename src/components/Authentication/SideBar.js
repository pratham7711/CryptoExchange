import * as React from "react";
import Drawer from "@mui/material/Drawer";
import { CryptoState } from "../../store/CryptoContext";
import { Avatar } from "@mui/material";
import classes from "./SideBar.module.css";
import {
  LogOut,
  Bookmark,
} from "react-feather";

import {HiTrendingUp} from 'react-icons/hi';
import {AiOutlineOrderedList} from 'react-icons/ai';
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

export default function SideBar() {
  const [state, setState] = React.useState({
    right: false,
  });

  const { user } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

const logout =()=>
{
  signOut(auth).then(() => {
    console.log("success");
  }).catch((error) => {
    console.log("fail");
  });
};

  return (
    <div >
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            sx={{
              height: 38,
              width: 38,
              cursor: "pointer",
              backgroundColor: "aliceblue",
            }}
            src={user.photoUrl}
            alt={user.displayName || user.email}
          >
            {" "}
          </Avatar>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  onClick={toggleDrawer(anchor, true)}
                  sx={{
                    height: 150,
                    width: 150,
                    cursor: "pointer",
                    marginLeft:"auto",
                    marginRight:"auto",
                    marginTop:"auto",
                    backgroundColor: "aliceblue",
                  }}
                  src={user.photoUrl}
                  alt={user.displayName || user.email}
                ></Avatar>
                <p
            style={{
              margin: "1rem",
              color: "var(--white)",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {user.displayName || user.email}
          </p>
          <div
        style={{
          padding: "2rem",
          paddingLeft: "1.2rem",
          marginTop: "1rem",
        }}
      >
        <Link to="/portfolio">
          <p className={classes.navLinks} style={{ margin: "1rem" , color: 'green' , fontWeight :'bold' }}>
            <HiTrendingUp size={30} color = 'green' className={classes.icon} />
            Portfolio
          </p>
          </Link>
            <p className={classes.navLinks} style={{ margin: "1rem" }}>
              <span className={classes.icon}>
            <AiOutlineOrderedList size={24}/>
              </span>
              Orders
            </p>



          <p className={classes.navLinks} style={{ margin: "1rem" }}>
            <Bookmark className={classes.icon} />
            Watchlist
          </p>
          <p
            className={classes.navLinks}
            style={{ margin: "1rem" }}
            onClick={logout}
          >
            <LogOut className={classes.icon} />
            Logout
          </p>

      </div>
              </div>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
