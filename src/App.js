import { Route, Routes , Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage'
import CoinPage from './pages/CoinPage';
import classes from './App.module.css';
import React from 'react';
import { StyledEngineProvider } from '@mui/material';
import Alert from './components/Alert';


function App() {

  return (
    <StyledEngineProvider injectFirst>    
  <div className={classes.App}>
    <Header/>
    <Routes>
    <Route path='/' element={<Navigate replace to='/homepage'/>}/>
    <Route path='/homepage' element = {<HomePage/>}/>
      <Route path='/coins/:id' element = {<CoinPage/> }/>
    </Routes>
  </div>
  <Alert></Alert>
  </StyledEngineProvider>
  );
}

export default App;
