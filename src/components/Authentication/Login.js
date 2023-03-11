import React , {useState} from 'react'
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { CryptoState } from '../../store/CryptoContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../../firebase';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password , setPassowrd] = useState("");

  const {setAlert} = CryptoState();

  const handleSubmit = async()=>
  {
   if(!email || !password)
   {
    setAlert({
      open : true,
      message : "Please fill the require fields",
      type : "error",
    });
    return;
   } 

   try{
    const result = await signInWithEmailAndPassword(auth,email,password);

    setAlert({
      open : true,
      message : `Login Successfull. Welcome ${result.user.email}`,
      type : "success",
    })
    console.log(result);
   }
   catch(error){
      setAlert({
        open : true,
        message : error.message,
        type :"error", 
      })
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
        <Button variant='contained'
        size = 'large'
        sx={{backgroundColor : "khakhi"}}
        onClick={handleSubmit}>Login</Button>
      </Box>
  )
}

export default Login