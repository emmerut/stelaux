import React from 'react'
import ReactDOM from 'react-dom/client'
import BaseLayout from '../src/homepage/layouts/BaseLayout'

// Libraries
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import { LazyMotion, domMax } from "framer-motion";

ReactDOM.createRoot(document.getElementById('root')).render(
  <LazyMotion features={domMax}>
    <ParallaxProvider>
      <BrowserRouter>
        <BaseLayout />
      </BrowserRouter>
    </ParallaxProvider>
  </LazyMotion>
)
