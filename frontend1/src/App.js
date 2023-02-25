import './App.css';
import Header from './component/layout/Header/Header.js'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import webfont from "webfontloader";
import Footer from './component/layout/Footer/Footer.js'
import React from 'react';
import Home from "./component/Home/Home.js";

function App() {

  React.useEffect(()=>{
    webfont.load({
      google:{
        families:["Roboto","Droid Sans"],
      },
    });
  },[]);
  return (
     <Router>
    <Header/>
    <Routes>
    <Route exact path="/" element={<Home/>}/>
    </Routes>
    <Footer/>
  </Router>
  );
}

export default App;
