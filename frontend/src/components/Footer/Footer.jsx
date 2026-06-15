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
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
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
            <li>+91 9876543210</li>
            <li>contact@swigato.com</li>
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
