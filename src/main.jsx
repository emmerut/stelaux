import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Libraries
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import { LazyMotion, domMax } from "framer-motion";

ReactDOM.createRoot(document.getElementById('root')).render(
  <LazyMotion features={domMax}>
    <ParallaxProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ParallaxProvider>
  </LazyMotion>
)
