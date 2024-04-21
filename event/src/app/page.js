// event/src/app/page.js
'use client'

import React from 'react';
import './homePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Link from 'next/link';
import NavbarComponent from './components/navbar/navbar';
import ImageCarousel from './components/carousel/imageCarousel';
import Cards from './components/cards/cards';
import Footer from './components/footer/Footer';
import Makers from './components/Makers/makers';
import HeaderComponent from './components/header/HeaderComponent';


const Home = () => {
  
  return (
    <>
      <NavbarComponent/>
      <HeaderComponent/>
      <br/>
      <Cards/>
      <br/>
      <Makers/>
      <br/>
      <Footer/>

    </>
  )
}

export default Home;
