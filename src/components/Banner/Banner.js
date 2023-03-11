import { Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'

import classes  from './Banner.module.css'
import Carousel from './Carousel'

const Banner = () => {
  return (
    <div className={classes.banner}>
      <Container className = {classes.bannerContent} sx={{height:"400"}}>
        <div className={classes.tagline}>
          <Typography variant='h2' sx={{fontWeight:"bold" , marginBottom : '15px', fontFamily:"Montserrat"}}>
            Crypto Exchange
          </Typography>
          <Typography variant='subtitle2' sx={{color : "darkgray" , textTransform : "capitalize" , fontFamily:"Montserrat"}}>
            Practise trading with your fav crypto currencies
          </Typography> 
        </div>
        <Carousel />
      </Container>
    </div>
  )
}

export default Banner