import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>download app for android and ios mobile phone</p>
            <img src={playStore} alt="playStore"/>
            <img src={appStore} alt="appStore"/>
          </div>

        <div className="midFooter">
            <h1>ECOMMERCE</h1>
            <p>High quality is our first priority</p>
            <p>Copyrights 2023 &copy; PriyaCh</p>

            
        </div>

        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href="http://instagram.com/PriyaCh7374">Instagram</a>
            <a href="http://youtube.com.com/PriyaCh7374">YouTube</a>
            <a href="http://instagram.com/PriyaCh7374">Facebook</a>
            
            
        </div>



    </footer>
    
  );
}

export default Footer