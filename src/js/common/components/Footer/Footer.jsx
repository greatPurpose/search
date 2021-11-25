import React from "react"
import "./Footer.scss"

const Footer = ({ isAutoResize }) => (
  <div className="FooterWrapper container-fluid absolute">
    <div className="container">
      <p>© Paradigm Labs 2019</p>
      <a href="mailto:info@paradigm.market">Contact Us</a>
    </div>
  </div>
)

export default Footer
