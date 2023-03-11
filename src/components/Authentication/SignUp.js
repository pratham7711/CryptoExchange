import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import { CryptoState } from '../../store/CryptoContext';
import {createUserWithEmailAndPassword} from '@firebase/auth';
import {auth} from "../../firebase";

const SignUp = ({handleClose}) => {
  const [email, setEmail] = useState("");
  const [password , setPassowrd] = useState("");
  const [confirm , setConfirm] = useState("");

  const {setAlert} = CryptoState();

  const handleSubmit = async()=>
  {
      if(password !== confirm){
        setAlert({
          open : true,
          message : "Unmatching Passwords",
          type: "error",
        });
        return ;
      }

      try{
        const result = await createUserWithEmailAndPassword(auth,email,password);
        
        console.log(result);

        setAlert({
          open : true,
          message : `Sign Up Successfull. Welcome ${result.user.email}`,
          type:"success",
        });

        handleClose();
      }catch(error)
      {
        setAlert({
          open : true,
          message : error.message,
          type: "error",
        });
      }
  }
  return (
    <Box p={3}
      sx={{display : "flex" , flexDirection : "column" , gap:"20px"}}>
        <TextField 
        variant='outlined'
        type='email'
        label = 'Enter email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        fullWidth />
        <TextField 
        variant='outlined'
        type='password'
        label = 'Enter password'
        value={password}
        onChange={(e)=>setPassowrd(e.target.value)}
        fullWidth />
        <TextField 
        variant='outlined'
        type='password'
        label = 'Confirm password'
        value={confirm}
        onChange={(e)=>setConfirm(e.target.value)}
        fullWidth />
        <Button variant='contained'
        size = 'large'
        sx={{backgroundColor : "khakhi"}}
        onClick={handleSubmit}>Sign Up</Button>
      </Box>
  )
}

export default SignUp