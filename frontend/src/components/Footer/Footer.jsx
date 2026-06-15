import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h2 className="footer-brand">Swigato.</h2>
          <p>
          Swigato is your go-to destination for delicious meals delivered right to your doorstep. 
We offer a wide variety of cuisines crafted with quality ingredients to satisfy every craving. 
Experience fast delivery, great taste, and convenience — all in one place.
          </p>
          <div className="footer-social-icons">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://www.linkedin.com/in/guru-sharan/" target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>+91 8207629969</li>
            <li>gurusharan4666@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2026 @ Swigato - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
